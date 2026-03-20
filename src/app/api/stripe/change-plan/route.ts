import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getSubscription } from "@/lib/stripe/billing";
import { createServerComponentClient } from "@/lib/supabase/server";
import { plans } from "@/lib/stripe/config";
import { logAudit } from "@/lib/audit";
import { trackServerEvent } from "@/lib/mixpanel-server";

export const runtime = "nodejs";

/**
 * POST — Change a user's subscription plan (upgrade or downgrade).
 *
 * Upgrades: take effect immediately, prorated charge invoiced now.
 * Downgrades: scheduled for end of current billing period.
 *
 * Body: { priceId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { priceId } = (await request.json()) as { priceId: string };
    if (!priceId) {
      return NextResponse.json({ error: "Missing priceId" }, { status: 400 });
    }

    // Validate the target plan exists
    const targetPlan = plans.find((p) => p.priceId === priceId);
    if (!targetPlan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    // Get current subscription
    const subscription = await getSubscription(user.id);
    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json({ error: "No active subscription. Use checkout instead." }, { status: 400 });
    }

    const isActive = subscription.status === "active" || subscription.status === "trialing";
    if (!isActive) {
      return NextResponse.json({ error: "Subscription is not active" }, { status: 400 });
    }

    // Get the current plan price to determine upgrade vs downgrade
    const currentPlan = plans.find((p) => p.priceId === subscription.price_id);
    const currentPrice = currentPlan?.price ?? 0;
    const targetPrice = targetPlan.price;

    if (subscription.price_id === priceId) {
      return NextResponse.json({ error: "Already on this plan" }, { status: 400 });
    }

    await trackServerEvent("plan_selected", { priceId }, user.id);

    // Retrieve the Stripe subscription to get the item ID
    const stripeSub = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id);
    const subscriptionItemId = stripeSub.items.data[0]?.id;

    if (!subscriptionItemId) {
      return NextResponse.json({ error: "Could not find subscription item" }, { status: 500 });
    }

    const isUpgrade = targetPrice > currentPrice;

    if (isUpgrade) {
      // UPGRADE: Apply immediately, charge prorated difference now
      const updated = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        items: [{ id: subscriptionItemId, price: priceId }],
        proration_behavior: "always_invoice",
      });

      await logAudit(user.id, "plan_upgraded", {
        from: currentPlan?.name ?? "Unknown",
        to: targetPlan.name,
        effective: "immediate",
      });

      return NextResponse.json({
        success: true,
        type: "upgrade",
        plan: targetPlan.name,
        effective: "immediate",
        message: `Upgraded to ${targetPlan.name}! The prorated difference has been charged.`,
      });
    } else {
      // DOWNGRADE: Schedule for end of billing period
      const updated = await stripe.subscriptions.update(subscription.stripe_subscription_id, {
        items: [{ id: subscriptionItemId, price: priceId }],
        proration_behavior: "none",
        billing_cycle_anchor: "unchanged",
      });

      // Note: Stripe applies the new price at the next billing cycle when
      // proration_behavior is "none". The subscription status remains the
      // same, but the price_id updates immediately in Stripe's system.
      // Our webhook (customer.subscription.updated) will sync this to our DB.

      await logAudit(user.id, "plan_downgraded", {
        from: currentPlan?.name ?? "Unknown",
        to: targetPlan.name,
        effective: "end_of_period",
        current_period_end: subscription.current_period_end,
      });

      return NextResponse.json({
        success: true,
        type: "downgrade",
        plan: targetPlan.name,
        effective: "end_of_period",
        currentPeriodEnd: subscription.current_period_end,
        message: `You'll be moved to ${targetPlan.name} at the end of your current billing period.`,
      });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Stripe Change Plan] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
