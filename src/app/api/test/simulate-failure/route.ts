import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const runtime = "nodejs";

/**
 * TEST ONLY — Creates real Stripe test objects and triggers RecoverKit recovery.
 *
 * 1. Creates a real Stripe test customer
 * 2. Creates an invoice with a line item (visible in Stripe Dashboard)
 * 3. Finalizes the invoice (marks it as open/unpaid)
 * 4. Sends the invoice data to the recovery webhook
 *
 * POST /api/test/simulate-failure
 * Body: { count?: number, amount?: number }
 */

const CUSTOMER_NAMES = [
  "Sarah Chen", "Marcus Williams", "Priya Patel", "Jake Morrison",
  "Emily Rodriguez", "David Kim", "Rachel Thompson", "Omar Hassan",
  "Lisa Nakamura", "Tom Anderson",
];

const FAILURE_REASONS = [
  { code: "card_declined", message: "Your card was declined." },
  { code: "insufficient_funds", message: "Your card has insufficient funds." },
  { code: "expired_card", message: "Your card has expired." },
  { code: "processing_error", message: "An error occurred while processing your card." },
  { code: "authentication_required", message: "This transaction requires authentication." },
];

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_MOCK_MODE !== "true") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey || !stripeKey.startsWith("sk_test_")) {
    return NextResponse.json({
      error: "Stripe test key required. Set STRIPE_SECRET_KEY=sk_test_... in .env.local",
    }, { status: 400 });
  }

  const stripe = new Stripe(stripeKey);
  const body = await request.json().catch(() => ({}));
  const count = Math.min(body.count ?? 1, 10);
  const amountCents = body.amount ? Math.round(body.amount) : undefined;
  const connectedAccount = process.env.STRIPE_TEST_CONNECTED_ACCOUNT ?? "acct_1T8zKS3UN0NwfdvM";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const results: Array<{
    customer_name: string;
    customer_id: string;
    invoice_id: string;
    failure_type: string;
    amount: number;
    status: string;
    campaign_created: boolean;
    error?: string;
  }> = [];

  for (let i = 0; i < count; i++) {
    const name = CUSTOMER_NAMES[Math.floor(Math.random() * CUSTOMER_NAMES.length)];
    const email = `${name.toLowerCase().replace(" ", ".")}+${Date.now()}@example.com`;
    const failure = FAILURE_REASONS[Math.floor(Math.random() * FAILURE_REASONS.length)];
    const amount = amountCents ?? Math.floor(Math.random() * 45000) + 500;

    try {
      // 1. Create real Stripe customer
      const customer = await stripe.customers.create({
        name,
        email,
        metadata: { recoverkit_test: "true", failure_reason: failure.code },
      });

      // 2. Create invoice with line item (use account default currency)
      const invoice = await stripe.invoices.create({
        customer: customer.id,
        currency: "aud",
        auto_advance: false,
        metadata: { recoverkit_test: "true" },
      });

      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        amount,
        currency: "aud",
        description: `Subscription payment — ${failure.message}`,
      });

      // 3. Finalize the invoice (makes it visible as unpaid in Stripe Dashboard)
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

      // 4. Send to recovery webhook with failure details
      const webhookEvent = {
        id: `evt_test_${Date.now()}_${i}`,
        object: "event",
        type: "invoice.payment_failed",
        account: connectedAccount,
        data: {
          object: {
            id: finalizedInvoice.id,
            object: "invoice",
            customer: customer.id,
            subscription: null,
            customer_email: email,
            customer_name: name,
            amount_due: finalizedInvoice.amount_due,
            currency: finalizedInvoice.currency,
            status: finalizedInvoice.status,
            last_finalization_error: {
              code: failure.code,
              message: failure.message,
            },
          },
        },
      };

      const webhookRes = await fetch(`${appUrl}/api/recovery/webhook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(webhookEvent),
      });
      const webhookData = await webhookRes.json().catch(() => ({}));

      results.push({
        customer_name: name,
        customer_id: customer.id,
        invoice_id: finalizedInvoice.id,
        failure_type: failure.message,
        amount: finalizedInvoice.amount_due,
        status: "created",
        campaign_created: webhookData.campaign_created === true,
      });
    } catch (err) {
      results.push({
        customer_name: name,
        customer_id: "error",
        invoice_id: "error",
        failure_type: failure.message,
        amount: 0,
        status: "error",
        campaign_created: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return NextResponse.json({
    simulated: count,
    campaigns_created: results.filter((r) => r.campaign_created).length,
    results,
  });
}
