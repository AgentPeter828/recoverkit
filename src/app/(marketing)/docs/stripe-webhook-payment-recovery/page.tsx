import type { Metadata } from "next";
import Link from "next/link";
import { BlogPost } from "@/components/marketing/BlogPost";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "How to Set Up Stripe Webhook for Payment Recovery | RecoverKit",
  description:
    "Step-by-step guide to configuring Stripe webhooks for real-time failed payment detection. Includes code examples for Node.js and Next.js.",
};

export default function StripeWebhookGuidePage() {
  return (
    <BlogPost
      title="How to Set Up Stripe Webhook for Payment Recovery"
      date="February 14, 2026"
      readTime="8 min read"
      category="Setup Guide"
    >
      <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: "1.75" }}>
        Stripe webhooks are the backbone of any payment recovery system. They let your application react to failed payments in real-time — triggering retry logic, dunning emails, and payment update flows automatically. Here&apos;s how to set them up correctly.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">What Are Stripe Webhooks?</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Webhooks are HTTP callbacks that Stripe sends to your server when events occur on your account. Instead of polling Stripe&apos;s API to check for failed payments, Stripe proactively notifies you the moment a payment fails.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        For payment recovery, the key webhook events are:
      </p>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code> — A subscription payment attempt failed</li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_action_required</code> — Payment requires customer action (3D Secure)</li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.updated</code> — Subscription status changed (e.g., to past_due)</li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.paid</code> — A previously-failed invoice was successfully paid</li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.deleted</code> — Subscription was cancelled</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Step 1: Create a Webhook Endpoint</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        First, create an API route in your application to receive webhook events. Here&apos;s a Next.js example:
      </p>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body, signature, webhookSecret
    );
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "invoice.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;
    case "invoice.paid":
      await handlePaymentSucceeded(event.data.object);
      break;
  }

  return NextResponse.json({ received: true });
}`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Step 2: Register in Stripe Dashboard</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Go to your <strong>Stripe Dashboard → Developers → Webhooks</strong> and click &quot;Add endpoint.&quot; Enter your endpoint URL (e.g., <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>https://yourapp.com/api/stripe/webhook</code>) and select the events you want to receive.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        For payment recovery, select at minimum:
      </p>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code></li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.paid</code></li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.updated</code></li>
        <li>• <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.deleted</code></li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Step 3: Handle Failed Payments</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        When you receive an <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code> event, you need to:
      </p>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const amount = invoice.amount_due / 100;
  const attemptCount = invoice.attempt_count;

  // 1. Log the failure
  await db.recoveryAttempts.create({
    stripeCustomerId: customerId,
    invoiceId: invoice.id,
    amount,
    attemptCount,
    failureReason: invoice.last_finalization_error?.message,
    status: "pending",
  });

  // 2. Schedule smart retry
  const optimalRetryTime = calculateOptimalRetryTime(
    invoice.last_finalization_error?.code
  );
  await scheduleRetry(invoice.id, optimalRetryTime);

  // 3. Send dunning email (if first failure)
  if (attemptCount === 1) {
    await sendDunningEmail(customerId, "friendly_reminder", {
      amount,
      updateUrl: generatePaymentUpdateUrl(customerId),
    });
  }
}`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Step 4: Verify Webhook Signatures</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Always verify webhook signatures to ensure requests actually come from Stripe. Never skip this step — it prevents attackers from sending fake webhook events to your endpoint. The <code className="text-sm px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>stripe.webhooks.constructEvent()</code> method handles this automatically.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Step 5: Handle Idempotency</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Stripe may send the same webhook event multiple times. Your handler should be idempotent — processing the same event twice should produce the same result. Use the event ID or invoice ID as a deduplication key:
      </p>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`// Check if we've already processed this event
const existing = await db.webhookEvents.findUnique({
  where: { stripeEventId: event.id }
});
if (existing) {
  return NextResponse.json({ received: true });
}

// Process the event
await processEvent(event);

// Mark as processed
await db.webhookEvents.create({
  data: { stripeEventId: event.id, processedAt: new Date() }
});`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Easier Way: Use RecoverKit</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Building your own payment recovery system from scratch is doable but time-consuming. You need to handle webhook events, build retry logic, create email sequences, design payment update pages, and build a recovery dashboard.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <Link href="/" className="underline" style={{ color: "var(--color-brand)" }}>RecoverKit</Link> handles all of this out of the box. Connect your Stripe account with one click, and RecoverKit automatically sets up webhook listeners, configures smart retry logic, sends AI-generated dunning emails, and provides branded payment update pages. Setup takes under 5 minutes.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <Link href="/auth/signup" className="underline" style={{ color: "var(--color-brand)" }}>Start free →</Link>
      </p>
    </BlogPost>
  );
}
