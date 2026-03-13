import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { checkPlanLimit } from "@/lib/plan-limits";
import { getNextRetryTime } from "@/lib/services/retry-scheduler";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * Processes queued recovery campaigns for a user.
 * Called after plan upgrades to activate campaigns that were queued due to limits.
 */
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { user_id } = body;

  if (!user_id) {
    return NextResponse.json({ error: "user_id required" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Get queued campaigns for this user
  const { data: queuedCampaigns, error: fetchError } = await supabase
    .from("rk_recovery_campaigns")
    .select("id")
    .eq("user_id", user_id)
    .eq("status", "queued")
    .order("created_at", { ascending: true });

  if (fetchError) {
    console.error("[process-queue] Failed to fetch queued campaigns:", fetchError.message);
    return NextResponse.json({ error: "Failed to fetch queue" }, { status: 500 });
  }

  if (!queuedCampaigns || queuedCampaigns.length === 0) {
    return NextResponse.json({ processed: 0 });
  }

  let activated = 0;

  for (const campaign of queuedCampaigns) {
    // Re-check limit for each campaign (capacity fills up as we activate)
    const limit = await checkPlanLimit(user_id);
    if (!limit.allowed) break;

    const nextRetry = getNextRetryTime(1);
    const { error: updateError } = await supabase
      .from("rk_recovery_campaigns")
      .update({
        status: "active",
        next_retry_at: nextRetry.toISOString(),
      })
      .eq("id", campaign.id);

    if (!updateError) {
      activated++;
      await logAudit(user_id, "campaign_activated_from_queue", {
        campaign_id: campaign.id,
      });
    }
  }

  console.log(`[process-queue] Activated ${activated}/${queuedCampaigns.length} queued campaigns for user ${user_id}`);
  return NextResponse.json({ processed: activated, remaining: queuedCampaigns.length - activated });
}
