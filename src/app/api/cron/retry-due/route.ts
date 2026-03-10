import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { retryPayment, getNextRetryTime } from "@/lib/services/retry-scheduler";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const MAX_RETRIES_PER_RUN = 50;

/**
 * Cron endpoint for processing scheduled payment retries.
 * Authenticated via CRON_SECRET header (Vercel Cron pattern).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  // Find campaigns due for retry
  const { data: campaigns, error } = await supabase
    .from("rk_recovery_campaigns")
    .select("id, user_id, stripe_invoice_id, retry_count, max_retries, amount_due, currency")
    .eq("status", "active")
    .lte("next_retry_at", now)
    .lt("retry_count", 999) // max_retries checked per-row below
    .order("next_retry_at", { ascending: true })
    .limit(MAX_RETRIES_PER_RUN);

  if (error) {
    console.error("[cron/retry-due] Failed to query campaigns:", error.message);
    return NextResponse.json({ error: "Query failed" }, { status: 500 });
  }

  // Filter to only those under their max_retries
  const dueCampaigns = (campaigns || []).filter(
    (c) => c.retry_count < c.max_retries
  );

  const results: { id: string; success: boolean; error?: string }[] = [];

  for (const campaign of dueCampaigns) {
    try {
      // Get the connected Stripe account for this user
      const { data: connection } = await supabase
        .from("rk_stripe_connections")
        .select("access_token")
        .eq("user_id", campaign.user_id)
        .single();

      if (!connection) {
        results.push({ id: campaign.id, success: false, error: "no_connection" });
        continue;
      }

      const attemptNumber = campaign.retry_count + 1;
      const result = await retryPayment(campaign.stripe_invoice_id, connection.access_token);

      // Record the attempt
      await supabase.from("rk_recovery_attempts").insert({
        user_id: campaign.user_id,
        campaign_id: campaign.id,
        attempt_number: attemptNumber,
        attempt_type: "retry",
        status: result.success ? "success" : "failed",
        stripe_payment_intent_id: result.payment_intent_id || null,
        error_code: result.error || null,
        error_message: result.error || null,
        scheduled_at: now,
        executed_at: new Date().toISOString(),
      });

      if (result.success) {
        await supabase
          .from("rk_recovery_campaigns")
          .update({
            status: "recovered",
            retry_count: attemptNumber,
            recovered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", campaign.id);

        await logAudit(campaign.user_id, "retry_attempted", {
          campaign_id: campaign.id,
          attempt_number: attemptNumber,
          result: "recovered",
          amount: campaign.amount_due,
          currency: campaign.currency,
          source: "cron",
        });
      } else {
        const nextRetry =
          attemptNumber < campaign.max_retries
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

        await logAudit(campaign.user_id, "retry_attempted", {
          campaign_id: campaign.id,
          attempt_number: attemptNumber,
          result: "failed",
          error: result.error,
          source: "cron",
        });
      }

      results.push({ id: campaign.id, success: result.success, error: result.error });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[cron/retry-due] Error processing campaign ${campaign.id}:`, message);
      results.push({ id: campaign.id, success: false, error: message });
    }
  }

  const succeeded = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  console.log(`[cron/retry-due] Processed ${results.length} campaigns: ${succeeded} succeeded, ${failed} failed`);

  return NextResponse.json({
    processed: results.length,
    succeeded,
    failed,
    results,
  });
}
