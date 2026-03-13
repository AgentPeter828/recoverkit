import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { paymentPageSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { checkFeatureAccess } from "@/lib/plan-limits";

export const runtime = "nodejs";

// GET — list payment update pages (all plans can view, only Scale can create)
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rk_payment_update_pages")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ pages: data });
}

// POST — create a payment update page (Scale plan only)
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check plan access
  const access = await checkFeatureAccess(user.id, "customPaymentPages");
  if (!access.allowed) {
    return NextResponse.json({
      error: "Custom payment pages require the Scale plan.",
      currentPlan: access.planName,
      requiredPlan: "Scale",
    }, { status: 403 });
  }

  const rawBody = await request.json();
  const parsed = paymentPageSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { title, message, brand_color, logo_url } = parsed.data;

  // Check custom branding access — strip branding fields if not allowed
  let appliedBrandColor: string | undefined = brand_color;
  let appliedLogoUrl = logo_url || null;
  let brandingNote: string | undefined;

  if (brand_color !== "#6366f1" || logo_url) {
    const brandingAccess = await checkFeatureAccess(user.id, "customBranding");
    if (!brandingAccess.allowed) {
      appliedBrandColor = undefined; // use DB default
      appliedLogoUrl = null;
      brandingNote = "Custom branding requires the Growth plan or above. Default branding applied.";
    }
  }

  // Generate a unique slug
  const slug = `pay-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await supabase
    .from("rk_payment_update_pages")
    .insert({
      user_id: user.id,
      slug,
      title,
      message,
      brand_color: appliedBrandColor,
      logo_url: appliedLogoUrl,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit(user.id, "payment_page_created", { page_id: data.id, slug });

  return NextResponse.json({ page: data, ...(brandingNote && { note: brandingNote }) }, { status: 201 });
}
