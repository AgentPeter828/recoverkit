import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getSubscription } from "@/lib/stripe/billing";
import { createServerComponentClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * POST — Cancel a subscription at end of billing period.
 * Does NOT cancel immediately — keeps access until current_period_end.
 *
 * Body: { reason?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json().catch(() => ({}));
    const reason = (body as { reason?: string }).reason || "Not specified";

    const subscription = await getSubscription(user.id);
    if (!subscription?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 400 }
      );
    }

    const isActive =
      subscription.status === "active" || subscription.status === "trialing";
    if (!isActive) {
      return NextResponse.json(
        { error: "Subscription is not active" },
        { status: 400 }
      );
    }

    // Cancel at end of period (not immediately)
    const updated = await stripe.subscriptions.update(
      subscription.stripe_subscription_id,
      { cancel_at_period_end: true }
    );

    await logAudit(user.id, "subscription_cancelled", {
      reason,
      effective: "end_of_period",
      current_period_end: subscription.current_period_end,
    });

    return NextResponse.json({
      success: true,
      cancelAtPeriodEnd: true,
      currentPeriodEnd: subscription.current_period_end,
      message: `Your subscription has been cancelled. You'll retain access until ${subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" }) : "the end of your billing period"}.`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Stripe Cancel] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
