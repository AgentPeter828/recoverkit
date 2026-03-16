import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { plans } from "@/lib/stripe/config";

/**
 * Plan feature definitions.
 * Each plan tier unlocks specific features and limits.
 */

export type PlanTier = "free" | "starter" | "growth" | "scale";

interface PlanFeatures {
  recoveryLimit: number;          // campaigns per month
  aiEmailGeneration: boolean;     // AI-generated dunning emails
  customBranding: boolean;        // custom brand colors/logo on payment pages
  emailSequenceBuilder: boolean;  // create/edit custom sequences (vs default only)
  priorityRetryTiming: boolean;   // optimal-hour retry scheduling
  advancedAnalytics: boolean;     // detailed recovery analytics
  customPaymentPages: boolean;    // create custom payment update pages
  apiAccess: boolean;             // REST API access
  customEmailDomain: boolean;     // verified email domain
  maxSequences: number;           // max dunning sequences
}

const PLAN_FEATURES: Record<PlanTier, PlanFeatures> = {
  free: {
    recoveryLimit: 10,
    aiEmailGeneration: false,
    customBranding: false,
    emailSequenceBuilder: false,
    priorityRetryTiming: false,
    advancedAnalytics: false,
    customPaymentPages: false,
    apiAccess: false,
    customEmailDomain: false,
    maxSequences: 1,
  },
  starter: {
    recoveryLimit: 100,
    aiEmailGeneration: false,
    customBranding: false,
    emailSequenceBuilder: true,
    priorityRetryTiming: false,
    advancedAnalytics: false,
    customPaymentPages: false,
    apiAccess: false,
    customEmailDomain: true,
    maxSequences: 3,
  },
  growth: {
    recoveryLimit: 500,
    aiEmailGeneration: true,
    customBranding: true,
    emailSequenceBuilder: true,
    priorityRetryTiming: true,
    advancedAnalytics: false,
    customPaymentPages: false,
    apiAccess: false,
    customEmailDomain: true,
    maxSequences: 10,
  },
  scale: {
    recoveryLimit: Infinity,
    aiEmailGeneration: true,
    customBranding: true,
    emailSequenceBuilder: true,
    priorityRetryTiming: true,
    advancedAnalytics: true,
    customPaymentPages: true,
    apiAccess: true,
    customEmailDomain: true,
    maxSequences: Infinity,
  },
};

/**
 * Get the plan tier for a given Stripe price ID.
 */
function getPlanTier(priceId: string | null): PlanTier {
  if (!priceId) return "free";
  const plan = plans.find((p) => p.priceId === priceId);
  if (!plan) return "free";
  const name = plan.name.toLowerCase();
  if (name in PLAN_FEATURES) return name as PlanTier;
  return "free";
}

/**
 * Get the user's current plan tier and features.
 */
export async function getUserPlan(userId: string): Promise<{
  tier: PlanTier;
  features: PlanFeatures;
  planName: string;
}> {
  const supabase = getSupabaseAdmin();

  const { data: subscription } = await supabase
    .from("rk_subscriptions")
    .select("price_id, status")
    .eq("user_id", userId)
    .single();

  const isActive =
    subscription?.status === "active" || subscription?.status === "trialing";
  const priceId = isActive ? subscription?.price_id ?? null : null;
  const tier = getPlanTier(priceId);
  const planObj = priceId ? plans.find((p) => p.priceId === priceId) : null;

  return {
    tier,
    features: PLAN_FEATURES[tier],
    planName: planObj?.name ?? "Free",
  };
}

/**
 * Check if a specific feature is available for a user.
 */
export async function checkFeatureAccess(
  userId: string,
  feature: keyof PlanFeatures
): Promise<{ allowed: boolean; planName: string; tier: PlanTier }> {
  const { tier, features, planName } = await getUserPlan(userId);
  const value = features[feature];
  const allowed = typeof value === "boolean" ? value : value > 0;
  return { allowed, planName, tier };
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
  const { features, planName } = await getUserPlan(userId);
  const limit = features.recoveryLimit;

  if (limit === Infinity) {
    return { allowed: true, current: 0, limit: Infinity, planName };
  }

  const supabase = getSupabaseAdmin();
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("rk_recovery_campaigns")
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
