import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { generateDunningEmail } from "@/lib/services/ai-dunning";
import { checkFeatureAccess } from "@/lib/plan-limits";

export const runtime = "nodejs";

/**
 * POST — generate AI dunning email content.
 * Requires Growth plan or above.
 * Body: { step_number, customer_name?, business_name?, amount, currency, tone? }
 * Optionally saves to a sequence: { ...above, sequence_id, delay_hours? }
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check plan access
  const access = await checkFeatureAccess(user.id, "aiEmailGeneration");
  if (!access.allowed) {
    return NextResponse.json({
      error: "AI email generation requires the Growth plan or above.",
      currentPlan: access.planName,
      requiredPlan: "Growth",
    }, { status: 403 });
  }

  const body = await request.json();
  const { step_number, customer_name, business_name, amount, currency, tone, sequence_id, delay_hours } = body;

  if (!step_number || !amount || !currency) {
    return NextResponse.json({ error: "Missing required fields: step_number, amount, currency" }, { status: 400 });
  }

  const generated = await generateDunningEmail({
    step_number,
    customer_name,
    business_name,
    amount: String(amount),
    currency,
    tone,
  });

  // Optionally save to sequence
  if (sequence_id) {
    const { data: saved, error } = await supabase
      .from("rk_dunning_emails")
      .insert({
        user_id: user.id,
        sequence_id,
        step_number,
        subject: generated.subject,
        body_html: generated.body_html,
        body_text: generated.body_text,
        delay_hours: delay_hours || 24,
        is_ai_generated: generated.is_ai_generated,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ email: saved, generated });
  }

  return NextResponse.json({ generated });
}
