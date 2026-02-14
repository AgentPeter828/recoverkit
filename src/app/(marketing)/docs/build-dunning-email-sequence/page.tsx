import type { Metadata } from "next";
import Link from "next/link";
import { BlogPost } from "@/components/marketing/BlogPost";

export const metadata: Metadata = {
  title: "How to Build a Dunning Email Sequence | RecoverKit",
  description:
    "Architecture guide for building automated dunning email sequences. Includes email timing, copy strategies, and technical implementation with Stripe.",
};

export default function BuildDunningSequencePage() {
  return (
    <BlogPost
      title="How to Build a Dunning Email Sequence"
      date="February 14, 2026"
      readTime="9 min read"
      category="Guide"
    >
      <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: "1.75" }}>
        A well-built dunning email sequence can recover 25-35% of failed payments on its own. This guide covers the architecture, timing, and implementation of an effective automated dunning system.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Architecture Overview</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        A dunning email system has four components:
      </p>
      <ol className="mb-4 space-y-2 list-decimal list-inside" style={{ color: "var(--color-text-secondary)" }}>
        <li><strong>Event listener:</strong> Receives <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.payment_failed</code> webhooks from Stripe</li>
        <li><strong>Sequence engine:</strong> Manages the email schedule — which email to send, when, and to whom</li>
        <li><strong>Email sender:</strong> Renders and delivers the actual emails (via SendGrid, Resend, SES, etc.)</li>
        <li><strong>Recovery tracker:</strong> Monitors for <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.paid</code> events to stop the sequence when payment is recovered</li>
      </ol>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Optimal Email Sequence</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Based on data from thousands of SaaS recovery campaigns, the optimal dunning sequence includes 4-5 emails:
      </p>
      <ul className="mb-4 space-y-3" style={{ color: "var(--color-text-secondary)" }}>
        <li>
          <strong>Email 1 — Friendly Notice (Day 0-1):</strong> Inform the customer their payment didn&apos;t go through. Warm, non-threatening tone. Include a direct link to update their payment method. Recovery rate: 15-20% of all recoveries happen from this email alone.
        </li>
        <li>
          <strong>Email 2 — Reminder (Day 3-4):</strong> Follow up for those who missed or ignored the first email. Slightly more direct. Emphasize that their account is still active but needs attention. Recovery rate: 10-15% additional.
        </li>
        <li>
          <strong>Email 3 — Urgency (Day 7):</strong> Create urgency by listing what the customer will lose. Mention that their account is &quot;at risk.&quot; This is where loss aversion kicks in. Recovery rate: 8-12% additional.
        </li>
        <li>
          <strong>Email 4 — Final Warning (Day 10-12):</strong> Last chance before cancellation. State the specific cancellation date. Offer to help if there&apos;s an issue. Recovery rate: 5-8% additional.
        </li>
        <li>
          <strong>Email 5 — Win-Back (Day 14+):</strong> Post-cancellation reactivation email. Emphasize that data is saved and reactivation is instant. Recovery rate: 5-10% of cancelled customers reactivate.
        </li>
      </ul>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        For ready-to-use templates for each of these emails, see our <Link href="/templates" className="underline" style={{ color: "var(--color-brand)" }}>dunning email template gallery</Link>.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Implementation: Database Schema</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        You&apos;ll need to track dunning sequences in your database. At minimum, you need:
      </p>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <strong>recovery_campaigns</strong> — One row per failed invoice. Tracks the overall recovery attempt.</li>
        <li>• <strong>dunning_emails</strong> — One row per email sent. Tracks which emails in the sequence have been sent.</li>
        <li>• <strong>email_templates</strong> — Your email templates for each step in the sequence.</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Critical: Stop on Recovery</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        The most important rule: <strong>stop sending dunning emails the moment the payment is recovered.</strong> Listen for <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>invoice.paid</code> events and immediately cancel any pending dunning emails for that invoice. Nothing annoys a customer more than receiving a &quot;your payment failed&quot; email after they&apos;ve already fixed it.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Email Delivery Best Practices</h2>
      <ul className="mb-4 space-y-2" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <strong>Send from a real person:</strong> &quot;Sarah from [Product]&quot; gets 23% higher open rates than &quot;[Product] Billing&quot;</li>
        <li>• <strong>Use reply-to:</strong> Make it easy for customers to ask for help by responding to the email</li>
        <li>• <strong>Plain text or minimal HTML:</strong> Dunning emails that look like personal emails perform better than heavily designed ones</li>
        <li>• <strong>Mobile-first:</strong> 50%+ of dunning emails are opened on mobile. Test on small screens.</li>
        <li>• <strong>One clear CTA:</strong> Every email should have exactly one button: &quot;Update Payment Method&quot;</li>
        <li>• <strong>Time zone aware:</strong> Send at 9-11am in the customer&apos;s local time zone</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Payment Update Pages</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Every dunning email needs a link to a payment update page. This is a branded, secure page where the customer can enter a new credit card. Build this using Stripe&apos;s <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>SetupIntent</code> API to securely collect card details and update the customer&apos;s default payment method.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Or Just Use RecoverKit</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Building all of this from scratch takes 2-4 weeks of development time. Maintaining it — handling edge cases, updating email templates, monitoring delivery rates — is an ongoing commitment.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <Link href="/" className="underline" style={{ color: "var(--color-brand)" }}>RecoverKit</Link> provides the complete dunning email system out of the box: AI-generated email sequences, automated scheduling, branded payment update pages, and recovery analytics. Setup takes 5 minutes, not weeks. <Link href="/auth/signup" className="underline" style={{ color: "var(--color-brand)" }}>Try it free →</Link>
      </p>
    </BlogPost>
  );
}
