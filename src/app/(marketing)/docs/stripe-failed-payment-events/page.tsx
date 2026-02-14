import type { Metadata } from "next";
import Link from "next/link";
import { BlogPost } from "@/components/marketing/BlogPost";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Stripe Failed Payment Events: Complete Guide | RecoverKit",
  description:
    "Complete reference for every Stripe webhook event related to failed payments. Learn what each event means, when it fires, and how to handle it for payment recovery.",
};

export default function StripeFailedPaymentEventsPage() {
  return (
    <BlogPost
      title="Stripe Failed Payment Events: Complete Guide"
      date="February 14, 2026"
      readTime="10 min read"
      category="Reference"
    >
      <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: "1.75" }}>
        Understanding Stripe&apos;s webhook events is crucial for building an effective payment recovery system. This guide covers every event related to failed payments, what triggers them, and how to respond.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Payment Failure Lifecycle</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        When a subscription payment fails on Stripe, it triggers a sequence of events over time. Understanding this lifecycle helps you build recovery logic that responds appropriately at each stage:
      </p>
      <ol className="mb-4 space-y-2 list-decimal list-inside" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Payment attempt fails</strong> → <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code></li>
        <li><strong>Subscription moves to past_due</strong> → <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.updated</code></li>
        <li><strong>Stripe retries (1-4 times)</strong> → Additional <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code> events</li>
        <li><strong>All retries exhausted</strong> → <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.updated</code> (to canceled or unpaid)</li>
        <li><strong>Subscription canceled</strong> → <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>customer.subscription.deleted</code></li>
      </ol>

      <h2 className="text-2xl font-bold mt-12 mb-4">Key Events Reference</h2>

      <h3 className="text-xl font-semibold mt-8 mb-3">invoice.payment_failed</h3>
      <Card className="p-4 my-4">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>When it fires:</strong> Every time a payment attempt on an invoice fails — including initial attempts and retries.
        </p>
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Key fields:</strong>
        </p>
        <ul className="text-sm space-y-1" style={{ color: "var(--color-text-secondary)" }}>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.attempt_count</code> — Which retry this is (1 = first attempt)</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.next_payment_attempt</code> — When Stripe will retry (null if no more retries)</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.last_finalization_error.code</code> — Decline reason (card_declined, expired_card, etc.)</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.amount_due</code> — Amount in cents</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.customer</code> — Customer ID</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>data.object.subscription</code> — Subscription ID</li>
        </ul>
      </Card>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <strong>Recovery action:</strong> On the first failure (attempt_count === 1), trigger your dunning email sequence and schedule smart retries. On subsequent failures, escalate your dunning emails and consider alternative recovery strategies.
      </p>

      <h3 className="text-xl font-semibold mt-8 mb-3">invoice.payment_action_required</h3>
      <Card className="p-4 my-4">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>When it fires:</strong> When a payment requires additional customer authentication (3D Secure / SCA).
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Recovery action:</strong> Send the customer a link to complete authentication. This is different from a standard decline — the payment may succeed if the customer completes the authentication step.
        </p>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">customer.subscription.updated</h3>
      <Card className="p-4 my-4">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>When it fires:</strong> When any subscription field changes — including status transitions caused by failed payments.
        </p>
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Key status transitions for payment recovery:</strong>
        </p>
        <ul className="text-sm space-y-1" style={{ color: "var(--color-text-secondary)" }}>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>active → past_due</code> — First payment failure</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>past_due → active</code> — Payment recovered! 🎉</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>past_due → canceled</code> — All retries exhausted, subscription canceled</li>
          <li>• <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>past_due → unpaid</code> — All retries exhausted, kept as unpaid</li>
        </ul>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">invoice.paid</h3>
      <Card className="p-4 my-4">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>When it fires:</strong> When an invoice is successfully paid — including previously-failed invoices that are recovered.
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Recovery action:</strong> If this invoice was previously in a failed state, mark the recovery as successful. Stop dunning emails. Update your recovery dashboard metrics. Consider sending a &quot;welcome back&quot; acknowledgment.
        </p>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">customer.subscription.deleted</h3>
      <Card className="p-4 my-4">
        <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
          <strong>When it fires:</strong> When a subscription is fully cancelled — either by the customer, your code, or Stripe after exhausting retries.
        </p>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <strong>Recovery action:</strong> If this was due to failed payments (check previous invoice status), trigger your win-back email sequence. The subscription is cancelled, but you can still invite the customer to reactivate with a new payment method.
        </p>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Decline Codes and What They Mean</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        The <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>last_finalization_error.code</code> field tells you why the payment was declined. Here are the most common codes and how to handle each:
      </p>
      <ul className="mb-4 space-y-2" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <code className="text-xs font-mono px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>card_declined</code> — Generic decline. Could be insufficient funds, fraud check, or issuer restriction. <strong>Action:</strong> Retry in 3-5 days + send dunning email.</li>
        <li>• <code className="text-xs font-mono px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>expired_card</code> — Card is expired. <strong>Action:</strong> Don&apos;t retry automatically — send dunning email asking customer to update their card.</li>
        <li>• <code className="text-xs font-mono px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>insufficient_funds</code> — Not enough money in the account. <strong>Action:</strong> Retry on the 1st or 15th of the month (common paydays).</li>
        <li>• <code className="text-xs font-mono px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>processing_error</code> — Temporary processing issue. <strong>Action:</strong> Retry immediately or within a few hours.</li>
        <li>• <code className="text-xs font-mono px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>incorrect_cvc</code> — CVC mismatch. <strong>Action:</strong> Send dunning email asking customer to re-enter their card details.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Skip the Complexity — Use RecoverKit</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Building a production-ready payment recovery system that handles all these events, decline codes, and edge cases takes significant development time. <Link href="/" className="underline" style={{ color: "var(--color-brand)" }}>RecoverKit</Link> handles all of this automatically — smart retries based on decline codes, AI-generated dunning emails, payment update pages, and a recovery dashboard. Connect Stripe in one click and start recovering revenue in under 5 minutes.
      </p>
    </BlogPost>
  );
}
