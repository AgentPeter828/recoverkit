import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch queued campaigns (top 5 + total count and sum)
  const [campaignsResult, countResult] = await Promise.all([
    supabase
      .from("rk_recovery_campaigns")
      .select("id, customer_name, customer_email, amount_due, currency, created_at")
      .eq("user_id", user.id)
      .eq("status", "queued")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("rk_recovery_campaigns")
      .select("id, amount_due", { count: "exact" })
      .eq("user_id", user.id)
      .eq("status", "queued"),
  ]);

  const campaigns = campaignsResult.data ?? [];
  const totalCount = countResult.count ?? 0;
  const totalAtRisk = (countResult.data ?? []).reduce(
    (sum, c) => sum + (c.amount_due ?? 0),
    0
  );

  return NextResponse.json({ campaigns, totalCount, totalAtRisk });
}
