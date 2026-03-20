import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createOrGetCustomer, getSubscription } from "@/lib/stripe/billing";
import { createServerComponentClient } from "@/lib/supabase/server";
import { trackServerEvent } from "@/lib/mixpanel-server";

export const runtime = "nodejs";

/**
 * POST — Create a Stripe Checkout session for FIRST-TIME subscribers only.
 * If the user already has an active subscription, redirect them to use
 * the change-plan endpoint instead.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { priceId } = (await request.json()) as { priceId: string };
    if (!priceId) {
      return NextResponse.json(
        { error: "Missing priceId" },
        { status: 400 }
      );
    }

    // Check if user already has an active subscription
    const existing = await getSubscription(user.id);
    const isActive = existing?.status === "active" || existing?.status === "trialing";
    if (isActive && existing?.stripe_subscription_id) {
      return NextResponse.json(
        { error: "You already have an active subscription. Use the change plan option instead.", useChangePlan: true },
        { status: 400 }
      );
    }

    const customerId = await createOrGetCustomer(
      user.id,
      user.email ?? ""
    );

    await trackServerEvent("plan_selected", { priceId }, user.id);

    const origin = request.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
      metadata: { supabase_user_id: user.id },
      // Stripe Tax — auto-calculate VAT/GST/sales tax by customer location
      automatic_tax: { enabled: true },
      // Collect billing address for accurate tax calculation
      billing_address_collection: "required",
      // Let Stripe determine customer's tax location
      customer_update: { address: "auto" },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Stripe Checkout] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
