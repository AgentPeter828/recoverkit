import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

// Use Node.js runtime for Stripe webhook verification
export const runtime = "nodejs";

// Supabase admin client for webhook processing
function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase environment variables for webhook processing");
  }
  return createClient(url, serviceKey);
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const supabase = getSupabaseAdmin();
  const customerId = session.customer as string;
  const customerEmail = session.customer_details?.email;

  // TODO: Update your database with the new subscription
  // Example: upsert a record in your subscriptions table
  console.log(
    `[Stripe Webhook] Checkout completed for customer ${customerId} (${customerEmail})`
  );

  // Example implementation:
  // const { error } = await supabase
  //   .from("subscriptions")
  //   .upsert({
  //     stripe_customer_id: customerId,
  //     email: customerEmail,
  //     status: "active",
  //     stripe_subscription_id: session.subscription as string,
  //     updated_at: new Date().toISOString(),
  //   }, { onConflict: "stripe_customer_id" });
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  const supabase = getSupabaseAdmin();
  const customerId = subscription.customer as string;
  const status = subscription.status;

  // TODO: Update subscription status in your database
  console.log(
    `[Stripe Webhook] Subscription updated for customer ${customerId}: ${status}`
  );

  // Example implementation:
  // const { error } = await supabase
  //   .from("subscriptions")
  //   .update({
  //     status,
  //     current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
  //     cancel_at_period_end: subscription.cancel_at_period_end,
  //     updated_at: new Date().toISOString(),
  //   })
  //   .eq("stripe_customer_id", customerId);
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[Stripe Webhook] STRIPE_WEBHOOK_SECRET is not configured");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Signature verification failed: ${message}`);
    return NextResponse.json(
      { error: `Webhook signature verification failed` },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(
          `[Stripe Webhook] Subscription deleted for customer ${subscription.customer}`
        );
        // TODO: Handle subscription cancellation
        break;
      }
      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(`[Stripe Webhook] Handler error: ${message}`);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}
