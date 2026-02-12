import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getNextRetryTime } from "@/lib/services/retry-scheduler";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Webhook endpoint for connected Stripe accounts.
 * Listens for invoice.payment_failed events to create recovery campaigns.
 * This is separate from the main Stripe webhook (which handles our own billing).
 */
export async function POST(request: NextRequest) {
  const body = await request.text();

  // In production, verify the webhook signature using the connected account's webhook secret.
  // For MVP, we parse the event directly.
  let event: Stripe.Event;
  try {
    event = JSON.parse(body) as Stripe.Event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (event.type !== "invoice.payment_failed") {
    return NextResponse.json({ received: true, skipped: true });
  }

  const invoice = event.data.object as Stripe.Invoice;
  const connectedAccountId = event.account;

  if (!connectedAccountId) {
    return NextResponse.json({ error: "No connected account" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Find the user who connected this Stripe account
  const { data: connection } = await supabase
    .from("stripe_connections")
    .select("user_id")
    .eq("stripe_account_id", connectedAccountId)
    .single();

  if (!connection) {
    console.warn("[recovery/webhook] No connection found for account:", connectedAccountId);
    return NextResponse.json({ error: "Unknown connected account" }, { status: 404 });
  }

  // Check if campaign already exists for this invoice
  const { data: existing } = await supabase
    .from("recovery_campaigns")
    .select("id")
    .eq("stripe_invoice_id", invoice.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, existing: true });
  }

  // Create recovery campaign
  const nextRetry = getNextRetryTime(1);
  const { error } = await supabase.from("recovery_campaigns").insert({
    user_id: connection.user_id,
    stripe_invoice_id: invoice.id,
    stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? "",
    stripe_subscription_id: typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id ?? null,
    customer_email: invoice.customer_email ?? null,
    customer_name: invoice.customer_name ?? null,
    amount_due: invoice.amount_due,
    currency: invoice.currency,
    status: "active",
    failure_code: invoice.last_finalization_error?.code ?? null,
    failure_message: invoice.last_finalization_error?.message ?? null,
    retry_count: 0,
    max_retries: 5,
    next_retry_at: nextRetry.toISOString(),
  });

  if (error) {
    console.error("[recovery/webhook] Failed to create campaign:", error.message);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }

  console.log(`[recovery/webhook] Created recovery campaign for invoice ${invoice.id}`);
  return NextResponse.json({ received: true, campaign_created: true });
}
