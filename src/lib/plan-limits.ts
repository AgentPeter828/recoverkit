import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { plans } from "@/lib/stripe/config";

/** Recovery limits per plan (campaigns per month) */
const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  starter: 100,
  growth: 500,
  scale: Infinity,
};

function getLimitForPriceId(priceId: string | null): number {
  if (!priceId) return PLAN_LIMITS.free;
  const plan = plans.find((p) => p.priceId === priceId);
  if (!plan) return PLAN_LIMITS.free;
  const key = plan.name.toLowerCase();
  return PLAN_LIMITS[key] ?? PLAN_LIMITS.free;
}

interface PlanLimitResult {
  allowed: boolean;
  current: number;
  limit: number;
  planName: string;
}

/**
 * Check if a user has remaining recovery campaign capacity this month.
 */
export async function checkPlanLimit(userId: string): Promise<PlanLimitResult> {
  const supabase = getSupabaseAdmin();

  // Get subscription
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("price_id, status")
    .eq("user_id", userId)
    .single();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const priceId = isActive ? subscription?.price_id ?? null : null;
  const limit = getLimitForPriceId(priceId);

  const planObj = priceId ? plans.find((p) => p.priceId === priceId) : null;
  const planName = planObj?.name ?? "Free";

  // Count campaigns created this month
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("recovery_campaigns")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .gte("created_at", startOfMonth.toISOString());

  const current = count ?? 0;

  return {
    allowed: current < limit,
    current,
    limit,
    planName,
  };
}
