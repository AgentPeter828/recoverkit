import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import { trackServerEvent } from "@/lib/mixpanel-server";
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
  const subscriptionId = session.subscription as string;
  const userId = session.metadata?.supabase_user_id;

  if (!userId) {
    console.error("[Stripe Webhook] No supabase_user_id in session metadata");
    return;
  }

  // Retrieve subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id ?? null;

  const { error } = await supabase.from("rk_subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      status: subscription.status,
      price_id: priceId,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[Stripe Webhook] Failed to upsert subscription:", error.message);
    throw error;
  }

  // Fetch UTM params from profile for attribution
  const { data: profile } = await supabase
    .from("profiles")
    .select("utm_source, utm_medium, utm_campaign, utm_content")
    .eq("id", userId)
    .single();

  await trackServerEvent("upgraded_to_paid", {
    plan: priceId,
    stripe_customer_id: customerId,
    ...(profile || {}),
  }, userId);

  console.log(
    `[Stripe Webhook] Checkout completed for customer ${customerId}, user ${userId}`
  );
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  const customerId = subscription.customer as string;
  const priceId = subscription.items.data[0]?.price.id ?? null;

  const { error } = await supabase
    .from("rk_subscriptions")
    .update({
      status: subscription.status,
      price_id: priceId,
      current_period_end: new Date(
        subscription.current_period_end * 1000
      ).toISOString(),
      cancel_at_period_end: subscription.cancel_at_period_end,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[Stripe Webhook] Failed to update subscription:", error.message);
    throw error;
  }

  console.log(
    `[Stripe Webhook] Subscription updated for customer ${customerId}: ${subscription.status}`
  );
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const supabase = getSupabaseAdmin();
  const customerId = subscription.customer as string;

  const { error } = await supabase
    .from("rk_subscriptions")
    .update({
      status: "canceled",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[Stripe Webhook] Failed to cancel subscription:", error.message);
    throw error;
  }

  console.log(`[Stripe Webhook] Subscription deleted for customer ${customerId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const supabase = getSupabaseAdmin();
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string | null;

  if (!subscriptionId) return;

  const { error } = await supabase
    .from("rk_subscriptions")
    .update({
      status: "active",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[Stripe Webhook] Failed to update after payment:", error.message);
    throw error;
  }

  console.log(`[Stripe Webhook] Invoice paid for customer ${customerId}`);
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const supabase = getSupabaseAdmin();
  const customerId = invoice.customer as string;

  const { error } = await supabase
    .from("rk_subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);

  if (error) {
    console.error("[Stripe Webhook] Failed to update after payment failure:", error.message);
    throw error;
  }

  console.log(`[Stripe Webhook] Invoice payment failed for customer ${customerId}`);
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
      { error: "Webhook signature verification failed" },
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
        await handleSubscriptionDeleted(subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentSucceeded(invoice);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
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
