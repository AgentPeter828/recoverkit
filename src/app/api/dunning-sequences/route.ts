import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { dunningSequenceSchema } from "@/lib/validators";
import { logAudit } from "@/lib/audit";
import { checkFeatureAccess, getUserPlan } from "@/lib/plan-limits";

export const runtime = "nodejs";

// GET — list dunning sequences
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rk_dunning_sequences")
    .select("*, rk_dunning_emails(count)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sequences: data });
}

// POST — create a new dunning sequence
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check if user has access to the email sequence builder
  const access = await checkFeatureAccess(user.id, "emailSequenceBuilder");
  if (!access.allowed) {
    return NextResponse.json({
      error: "Creating custom sequences requires the Starter plan or above.",
      currentPlan: access.planName,
    }, { status: 403 });
  }

  // Check max sequences limit
  const { features } = await getUserPlan(user.id);
  const supabaseAdmin = await createServerComponentClient();
  const { count } = await supabaseAdmin
    .from("rk_dunning_sequences")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  const currentCount = count ?? 0;
  if (currentCount >= features.maxSequences) {
    return NextResponse.json({
      error: `You've reached the maximum of ${features.maxSequences} sequences for your plan. Upgrade to create more.`,
      currentPlan: access.planName,
      limit: features.maxSequences,
    }, { status: 403 });
  }

  const rawBody = await request.json();
  const parsed = dunningSequenceSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { name, description } = parsed.data;

  const { data, error } = await supabase
    .from("rk_dunning_sequences")
    .insert({
      user_id: user.id,
      name,
      description: description || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logAudit(user.id, "sequence_created", { sequence_id: data.id, name });

  return NextResponse.json({ sequence: data }, { status: 201 });
}
