import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe/client";
import { getNextRetryTime } from "@/lib/services/retry-scheduler";
import { trackServerEvent } from "@/lib/mixpanel-server";
import { rateLimitWebhook } from "@/lib/rate-limit";
import { checkPlanLimit, getUserPlan } from "@/lib/plan-limits";
import { logAudit } from "@/lib/audit";
import { sendLimitReachedEmail } from "@/lib/services/limit-notifications";
import type Stripe from "stripe";

export const runtime = "nodejs";

/**
 * Webhook endpoint for connected Stripe accounts.
 * Listens for invoice.payment_failed events to create recovery campaigns.
 * This is separate from the main Stripe webhook (which handles our own billing).
 */
export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const limit = rateLimitWebhook(ip);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  const webhookSecret = process.env.RECOVERY_WEBHOOK_SECRET;
  const isMock = !webhookSecret || process.env.NEXT_PUBLIC_MOCK_MODE === "true";

  if (isMock) {
    // Mock mode bypass for development
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
  } else {
    // Production: verify webhook signature
    const signature = request.headers.get("stripe-signature");
    if (!signature) {
      return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(`[recovery/webhook] Signature verification failed: ${message}`);
      return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
    }
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
    .from("rk_stripe_connections")
    .select("user_id")
    .eq("stripe_account_id", connectedAccountId)
    .single();

  if (!connection) {
    console.warn("[recovery/webhook] No connection found for account:", connectedAccountId);
    return NextResponse.json({ error: "Unknown connected account" }, { status: 404 });
  }

  // Check if campaign already exists for this invoice
  const { data: existing } = await supabase
    .from("rk_recovery_campaigns")
    .select("id")
    .eq("stripe_invoice_id", invoice.id)
    .single();

  if (existing) {
    return NextResponse.json({ received: true, existing: true });
  }

  // Check plan limits — queue instead of rejecting
  const planLimit = await checkPlanLimit(connection.user_id);
  const isQueued = !planLimit.allowed;

  if (isQueued) {
    console.warn(`[recovery/webhook] Plan limit reached for user ${connection.user_id}: ${planLimit.current}/${planLimit.limit} (${planLimit.planName}) — queuing campaign`);
  }

  // Check if user has priority retry timing
  const { features } = await getUserPlan(connection.user_id);
  // Create recovery campaign (active or queued)
  const nextRetry = getNextRetryTime(1, new Date(), undefined, features.priorityRetryTiming);
  const { error } = await supabase.from("rk_recovery_campaigns").insert({
    user_id: connection.user_id,
    stripe_invoice_id: invoice.id,
    stripe_customer_id: typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id ?? "",
    stripe_subscription_id: typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id ?? null,
    customer_email: invoice.customer_email ?? null,
    customer_name: invoice.customer_name ?? null,
    amount_due: invoice.amount_due,
    currency: invoice.currency,
    status: isQueued ? "queued" : "active",
    failure_code: invoice.last_finalization_error?.code ?? null,
    failure_message: invoice.last_finalization_error?.message ?? null,
    retry_count: 0,
    max_retries: 5,
    next_retry_at: isQueued ? null : nextRetry.toISOString(),
  });

  if (error) {
    console.error("[recovery/webhook] Failed to create campaign:", error.message);
    return NextResponse.json({ error: "Failed to create campaign" }, { status: 500 });
  }

  // Audit log
  await logAudit(connection.user_id, isQueued ? "campaign_queued" : "campaign_created", {
    stripe_invoice_id: invoice.id,
    amount_due: invoice.amount_due,
    currency: invoice.currency,
    customer_email: invoice.customer_email,
  });

  // Track campaign start (only for active campaigns, not queued)
  if (!isQueued) {
    await trackServerEvent("campaign_started", {
      amount: invoice.amount_due,
      currency: invoice.currency,
      customer_email: invoice.customer_email,
      stripe_invoice_id: invoice.id,
    }, connection.user_id);
  }

  // Track in Mixpanel
  await trackServerEvent(isQueued ? "payment_queued" : "payment_failed_detected", {
    amount: invoice.amount_due,
    currency: invoice.currency,
    customer_email: invoice.customer_email,
    failure_code: invoice.last_finalization_error?.code,
    queued: isQueued,
  }, connection.user_id);

  // Send limit-reached email (only once per billing period)
  if (isQueued) {
    // Count queued campaigns to include in the email
    const { count: queuedCount } = await supabase
      .from("rk_recovery_campaigns")
      .select("id", { count: "exact", head: true })
      .eq("user_id", connection.user_id)
      .eq("status", "queued");

    await sendLimitReachedEmail(
      connection.user_id,
      planLimit.planName,
      planLimit.limit,
      queuedCount ?? 1
    );
  }

  console.log(`[recovery/webhook] ${isQueued ? "Queued" : "Created"} recovery campaign for invoice ${invoice.id}`);
  return NextResponse.json({ received: true, campaign_created: !isQueued, queued: isQueued });
}
