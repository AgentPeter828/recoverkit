import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { retryPayment, getNextRetryTime } from "@/lib/services/retry-scheduler";
import { trackServerEvent } from "@/lib/mixpanel-server";

export const runtime = "nodejs";

/**
 * POST — manually trigger a retry for a campaign, or process scheduled retries.
 * Body: { campaign_id: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { campaign_id } = await request.json();
  if (!campaign_id) return NextResponse.json({ error: "Missing campaign_id" }, { status: 400 });

  // Get campaign
  const { data: campaign, error: campError } = await supabase
    .from("rk_recovery_campaigns")
    .select("*")
    .eq("id", campaign_id)
    .eq("user_id", user.id)
    .single();

  if (campError || !campaign) {
    return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  }

  if (campaign.status !== "active") {
    return NextResponse.json({ error: "Campaign is not active" }, { status: 400 });
  }

  if (campaign.retry_count >= campaign.max_retries) {
    return NextResponse.json({ error: "Max retries reached" }, { status: 400 });
  }

  // Get connected Stripe account
  const { data: connection } = await supabase
    .from("rk_stripe_connections")
    .select("access_token")
    .eq("user_id", user.id)
    .single();

  if (!connection) {
    return NextResponse.json({ error: "No Stripe connection found" }, { status: 400 });
  }

  const attemptNumber = campaign.retry_count + 1;

  // Attempt retry
  const result = await retryPayment(campaign.stripe_invoice_id, connection.access_token);

  // Record attempt
  await supabase.from("rk_recovery_attempts").insert({
    user_id: user.id,
    campaign_id: campaign.id,
    attempt_number: attemptNumber,
    attempt_type: "retry",
    status: result.success ? "success" : "failed",
    stripe_payment_intent_id: result.payment_intent_id || null,
    error_code: result.error || null,
    error_message: result.error || null,
    scheduled_at: new Date().toISOString(),
    executed_at: new Date().toISOString(),
  });

  // Update campaign
  if (result.success) {
    // Track recovery in Mixpanel
    const createdAt = new Date(campaign.created_at);
    const daysToRecover = Math.round((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
    await trackServerEvent("payment_recovered", {
      amount: campaign.amount_due,
      currency: campaign.currency,
      campaign_id: campaign.id,
      recovery_method: "retry",
      days_to_recover: daysToRecover,
    }, user.id);

    await supabase
      .from("rk_recovery_campaigns")
      .update({
        status: "recovered",
        retry_count: attemptNumber,
        recovered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
  } else {
    const nextRetry = attemptNumber < campaign.max_retries
      ? getNextRetryTime(attemptNumber + 1)
      : null;

    await supabase
      .from("rk_recovery_campaigns")
      .update({
        retry_count: attemptNumber,
        status: attemptNumber >= campaign.max_retries ? "failed" : "active",
        next_retry_at: nextRetry?.toISOString() || null,
        failure_code: result.error || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", campaign.id);
  }

  return NextResponse.json({
    success: result.success,
    attempt_number: attemptNumber,
    payment_intent_id: result.payment_intent_id,
    error: result.error,
  });
}
