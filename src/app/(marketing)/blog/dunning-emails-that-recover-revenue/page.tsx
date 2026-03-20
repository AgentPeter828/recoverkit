import type { Metadata } from "next";
import Link from "next/link";
import { BlogPost } from "@/components/marketing/BlogPost";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "How to Write Dunning Emails That Actually Recover Revenue | RecoverKit",
  description:
    "Copy-paste dunning email templates that work. Learn the psychology behind effective payment recovery emails and the optimal send schedule.",
  openGraph: {
    title: "How to Write Dunning Emails That Actually Recover Revenue",
    description: "Dunning email templates with subject lines, timing, and copy you can use today.",
  },
};

export default function DunningEmailsPost() {
  return (
    <BlogPost
      title="How to Write Dunning Emails That Actually Recover Revenue (With Templates)"
      date="February 11, 2026"
      readTime="10 min read"
      category="Email Templates"
    >
      <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: "1.75" }}>
        Your dunning emails are the difference between recovering a failed payment and losing a customer forever. Most SaaS companies either don&apos;t send dunning emails at all, or send generic, robotic messages that customers ignore. Here&apos;s how to write emails that actually work — with templates you can copy today.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Psychology of Effective Dunning Emails</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Before we get to templates, let&apos;s understand why most dunning emails fail. The typical dunning email reads like a debt collection notice: cold, impersonal, and slightly threatening. But your customers aren&apos;t deadbeats — they&apos;re people who already chose to pay you. Their payment just didn&apos;t go through.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        The most effective dunning emails are built on three psychological principles:
      </p>
      <p className="mb-2" style={{ color: "var(--color-text-secondary)" }}>
        <strong>1. Empathy over blame.</strong> Never imply the customer did something wrong. &quot;We noticed a problem with your payment&quot; is better than &quot;Your payment was rejected.&quot; Frame it as something that happened <em>to</em> them, not something they caused.
      </p>
      <p className="mb-2" style={{ color: "var(--color-text-secondary)" }}>
        <strong>2. Clarity over cleverness.</strong> Tell the customer exactly what happened, what it means for their account, and what they need to do — in plain language. Don&apos;t bury the CTA. Don&apos;t use jargon. Don&apos;t be vague.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <strong>3. Progressive urgency.</strong> Start gentle and escalate. Your first email should feel like a helpful heads-up from a friend. Your final email should create genuine urgency — not through threats, but by clearly communicating what the customer will lose.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">The Optimal Dunning Email Schedule</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Timing matters as much as copy. Here&apos;s the schedule that consistently performs best across thousands of SaaS businesses:
      </p>
      <ul className="mb-4 space-y-2" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <strong>Email 1:</strong> Day 0-1 after failure (within 24 hours) — <Link href="/templates" className="underline" style={{ color: "var(--color-brand)" }}>free template below</Link></li>
        <li>• <strong>Email 2:</strong> Day 3-4 (first follow-up) — <Link href="/templates" className="underline" style={{ color: "var(--color-brand)" }}>free template below</Link></li>
        <li>• <strong>Email 3:</strong> Day 7 (mid-cycle urgency)</li>
        <li>• <strong>Email 4:</strong> Day 10-12 (final warning)</li>
        <li>• <strong>Email 5:</strong> Day 14+ (post-cancellation win-back)</li>
      </ul>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Send dunning emails between 9-11am in the customer&apos;s local time zone. Avoid weekends — Tuesday through Thursday see the highest email engagement rates. We provide 2 free templates to get you started — grab them from our <Link href="/templates" className="underline" style={{ color: "var(--color-brand)" }}>template gallery</Link>. For the full personalised sequence, RecoverKit&apos;s AI generates it for you.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Template 1: The Friendly First Notice</h2>
      <p className="mb-2" style={{ color: "var(--color-text-secondary)" }}>
        <strong>Send timing:</strong> Within 24 hours of payment failure<br />
        <strong>Tone:</strong> Warm, helpful, zero urgency<br />
        <strong>Subject line:</strong> &quot;Quick heads up about your [Product] account&quot;
      </p>
      <Card className="p-6 my-4" style={{ background: "var(--color-bg-secondary)" }}>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Hi [First Name],<br /><br />
          Just a quick heads up — we tried to process your [Product] subscription payment of [Amount], but it didn&apos;t go through. This happens sometimes with expired cards or temporary bank holds, so no worries.<br /><br />
          To keep your account active, just update your payment method here:<br /><br />
          <strong>[Update Payment Method →]</strong><br /><br />
          It only takes 30 seconds. If the payment goes through on the next automatic retry, you can ignore this email entirely.<br /><br />
          Thanks for being a [Product] customer!<br /><br />
          — The [Product] Team
        </p>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Template 2: The Gentle Reminder</h2>
      <p className="mb-2" style={{ color: "var(--color-text-secondary)" }}>
        <strong>Send timing:</strong> Day 3-4<br />
        <strong>Tone:</strong> Friendly, slightly more direct<br />
        <strong>Subject line:</strong> &quot;Your [Product] payment still needs attention&quot;
      </p>
      <Card className="p-6 my-4" style={{ background: "var(--color-bg-secondary)" }}>
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          Hi [First Name],<br /><br />
          Following up on our earlier note — your [Product] subscription payment of [Amount] is still pending. We want to make sure you don&apos;t lose access to your account.<br /><br />
          The most common reason for this is an expired credit card. You can update your payment method in about 30 seconds:<br /><br />
          <strong>[Update Payment Method →]</strong><br /><br />
          Your data and settings are all safe — we just need a valid payment method to keep things running.<br /><br />
          Questions? Just reply to this email.<br /><br />
          — The [Product] Team
        </p>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Templates 3-5: Urgency, Final Warning &amp; Win-Back</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        The remaining emails in your dunning sequence — the urgency builder (day 7), the final cancellation warning (day 10-12), and the post-cancellation win-back (day 14+) — are where the real revenue recovery happens. These emails need to be highly personalised to your product, your customer relationship, and the specific value at stake.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Generic templates fall short here because urgency and loss-aversion messaging needs to reference <em>your</em> features, <em>your</em> customer&apos;s usage history, and <em>your</em> brand voice. That&apos;s why <Link href="/" className="underline" style={{ color: "var(--color-brand)" }}>RecoverKit</Link> uses AI to generate the full sequence — personalised to each customer and optimised for recovery.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <Link href="/auth/signup" className="underline font-semibold" style={{ color: "var(--color-brand)" }}>Start trial →</Link> and generate your complete dunning sequence with one click.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Key Metrics to Track</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        Once your dunning sequence is live, monitor these metrics for each email:
      </p>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <strong>Open rate:</strong> Target 50%+ for dunning emails (they typically outperform marketing emails because they&apos;re transactional)</li>
        <li>• <strong>Click-through rate:</strong> Target 15-25% on the payment update link</li>
        <li>• <strong>Recovery rate per email:</strong> What percentage of recipients update their card after each email in the sequence?</li>
        <li>• <strong>Unsubscribe rate:</strong> If people are unsubscribing from dunning emails, your tone may be off</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Using AI to Write Better Dunning Emails</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        In 2026, the best dunning tools use AI to generate personalized email copy. Instead of sending the same template to every customer, AI can adjust tone, emphasis, and messaging based on the customer&apos;s relationship with your product.
      </p>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        <Link href="/" className="underline" style={{ color: "var(--color-brand)" }}>RecoverKit</Link> includes AI-generated dunning emails that are personalized for each customer and optimized for recovery. You can generate an entire email sequence with one click, then customize it to match your brand voice. Start your trial at <Link href="/auth/signup" className="underline" style={{ color: "var(--color-brand)" }}>recoverkit.dev</Link>.
      </p>
    </BlogPost>
  );
}
