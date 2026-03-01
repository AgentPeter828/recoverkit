import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET — recovery dashboard stats
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Total campaigns
  const { count: totalCampaigns } = await supabase
    .from("rk_recovery_campaigns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Active campaigns
  const { count: activeCampaigns } = await supabase
    .from("rk_recovery_campaigns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "active");

  // Recovered campaigns
  const { data: recoveredData } = await supabase
    .from("rk_recovery_campaigns")
    .select("amount_due")
    .eq("user_id", user.id)
    .eq("status", "recovered");

  const recoveredCount = recoveredData?.length || 0;
  const recoveredRevenue = (recoveredData || []).reduce((sum, c) => sum + c.amount_due, 0);

  // Failed campaigns
  const { count: failedCampaigns } = await supabase
    .from("rk_recovery_campaigns")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "failed");

  // Emails sent
  const { count: emailsSent } = await supabase
    .from("rk_sent_emails")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Total attempts
  const { count: totalAttempts } = await supabase
    .from("rk_recovery_attempts")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const successRate = (totalCampaigns || 0) > 0
    ? Math.round((recoveredCount / (totalCampaigns || 1)) * 100)
    : 0;

  return NextResponse.json({
    stats: {
      total_campaigns: totalCampaigns || 0,
      active_campaigns: activeCampaigns || 0,
      recovered_count: recoveredCount,
      recovered_revenue_cents: recoveredRevenue,
      failed_campaigns: failedCampaigns || 0,
      emails_sent: emailsSent || 0,
      total_attempts: totalAttempts || 0,
      success_rate: successRate,
    },
  });
}
