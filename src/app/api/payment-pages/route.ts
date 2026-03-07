import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { paymentPageSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

// GET — list payment update pages
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

// POST — create a payment update page
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await request.json();
  const parsed = paymentPageSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { title, message, brand_color, logo_url } = parsed.data;

  // Generate a unique slug
  const slug = `pay-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const { data, error } = await supabase
    .from("rk_payment_update_pages")
    .insert({
      user_id: user.id,
      slug,
      title,
      message,
      brand_color,
      logo_url: logo_url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit(user.id, "payment_page_created", { page_id: data.id, slug });

  return NextResponse.json({ page: data }, { status: 201 });
}
