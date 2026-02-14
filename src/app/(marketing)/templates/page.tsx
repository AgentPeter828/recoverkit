import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Dunning Email Templates — Free Payment Recovery Emails | RecoverKit",
  description:
    "Free dunning email templates for SaaS payment recovery. Copy-paste subject lines, email body, and timing for each step of your recovery sequence.",
  openGraph: {
    title: "Free Dunning Email Templates for SaaS",
    description: "5 proven dunning email templates with subject lines, send timing, and copy you can use today.",
  },
};

const templates = [
  {
    id: "friendly-first-reminder",
    title: "Friendly First Reminder",
    timing: "Send within 24 hours of payment failure",
    urgency: "Low",
    urgencyColor: "#22c55e",
    subjectLine: "Quick heads up about your {{product}} account",
    preheader: "We noticed a small issue with your latest payment",
    body: `Hi {{first_name}},

Just a quick heads up — we tried to process your {{product}} subscription payment of {{amount}}, but it didn't go through. This happens sometimes with expired cards or temporary bank holds, so no worries at all.

To keep your account active and avoid any interruption, you can update your payment method here:

[Update Payment Method →]

It only takes about 30 seconds. If the payment goes through on our next automatic retry, you can ignore this email entirely.

Thanks for being a {{product}} customer — we appreciate you!

Cheers,
The {{product}} Team`,
    tips: [
      "Keep the tone warm and non-threatening",
      "Don't use words like 'failed', 'declined', or 'rejected'",
      "Provide a direct link to update payment — don't make them search for it",
      "Mention that it might resolve automatically to reduce anxiety",
    ],
  },
  {
    id: "urgent-payment-required",
    title: "Urgent Payment Required",
    timing: "Send on day 7 after payment failure",
    urgency: "High",
    urgencyColor: "#f59e0b",
    subjectLine: "Action needed: Your {{product}} account is at risk",
    preheader: "Your subscription payment is still pending — update now to keep access",
    body: `Hi {{first_name}},

We've been trying to process your {{product}} subscription payment of {{amount}} for the past week, but haven't been able to charge your card on file.

Your account is now at risk of being deactivated. Here's what you'd lose access to:

• {{feature_1}}
• {{feature_2}}
• {{feature_3}}
• All your saved data and configurations

Update your payment method now to keep your account active:

[Update Payment Method — Keep My Account →]

This takes less than a minute and will prevent any disruption to your service. If you're having trouble, just reply to this email and we'll help sort it out.

— The {{product}} Team`,
    tips: [
      "List specific features/data the customer will lose — make it tangible",
      "Create urgency without being aggressive or threatening",
      "Offer help in case they're having trouble (builds trust)",
      "Use a more action-oriented CTA button",
    ],
  },
  {
    id: "final-notice",
    title: "Final Notice Before Cancellation",
    timing: "Send on day 10-12 after payment failure",
    urgency: "Critical",
    urgencyColor: "#ef4444",
    subjectLine: "Last chance to save your {{product}} account",
    preheader: "Your subscription will be cancelled on {{cancellation_date}} unless you act now",
    body: `Hi {{first_name}},

This is our final notice before we have to cancel your {{product}} subscription. We've been unable to process your payment of {{amount}} despite multiple attempts over the past {{days}} days.

Your account will be cancelled on {{cancellation_date}} unless you update your payment method.

We'd genuinely hate to see you go — you've been using {{product}} for {{customer_duration}} and we know it's been valuable to your workflow.

[Update Payment Method — This Is My Last Chance →]

If there's anything going on that we can help with — billing questions, a temporary pause, or anything else — please just reply to this email. We're real people and we want to help.

— The {{product}} Team`,
    tips: [
      "Be empathetic — acknowledge the customer relationship",
      "State the specific cancellation date to create real urgency",
      "Mention how long they've been a customer (loss aversion)",
      "Offer alternatives like pausing the subscription",
    ],
  },
  {
    id: "win-back",
    title: "Win-Back After Failed Payment",
    timing: "Send 2-3 days after cancellation (day 14-17)",
    urgency: "Recovery",
    urgencyColor: "#8b5cf6",
    subjectLine: "We miss you at {{product}} — come back anytime",
    preheader: "Your data is safe and your account is ready to reactivate",
    body: `Hi {{first_name}},

Your {{product}} subscription was cancelled due to a payment issue. We completely understand — these things happen and it's nobody's fault.

The good news: we've saved all your data, settings, and configurations. Everything is exactly as you left it.

If you'd like to come back, you can reactivate your account instantly:

[Reactivate My Account →]

No setup needed — just enter a new payment method and you're back in business. Everything will be right where you left it.

No hard feelings either way. We're just glad you gave {{product}} a try, and the door is always open.

Warmly,
The {{product}} Team`,
    tips: [
      "Never guilt the customer — they didn't choose to leave",
      "Emphasize that their data is safe (reduces reactivation anxiety)",
      "Make reactivation sound effortless — 'instantly', 'one click'",
      "This email often has a 10-15% reactivation rate — don't skip it",
    ],
  },
  {
    id: "card-expiring",
    title: "Payment Method Expiring Soon",
    timing: "Send 14 days before card expiration",
    urgency: "Preventive",
    urgencyColor: "#06b6d4",
    subjectLine: "Your card ending in {{last4}} expires soon",
    preheader: "Update your payment method to avoid any interruption to your {{product}} subscription",
    body: `Hi {{first_name}},

Just a friendly heads up — the credit card you have on file for your {{product}} subscription (ending in {{last4}}) expires on {{expiry_date}}.

To avoid any interruption to your service, you can update your payment method now:

[Update Payment Method →]

This takes about 30 seconds and will ensure your subscription continues smoothly. If you've already received a replacement card with a new number, this is a great time to add it.

Thanks for being a {{product}} customer!

— The {{product}} Team`,
    tips: [
      "This is a PROACTIVE email — send it BEFORE the payment fails",
      "Proactive card-update emails prevent 30-40% of expiration-related failures",
      "Reference the specific card (last 4 digits) so the customer knows exactly what to update",
      "Keep it brief and action-oriented — no urgency needed yet",
    ],
  },
];

export default function TemplatesPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are dunning emails?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Dunning emails are automated messages sent to customers when their subscription payment fails. They notify the customer about the issue and provide a way to update their payment method to avoid account cancellation.",
        },
      },
      {
        "@type": "Question",
        name: "How many dunning emails should I send?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Most effective dunning sequences include 4-5 emails sent over 14 days, starting with a friendly reminder and escalating to a final cancellation warning, followed by a win-back email after cancellation.",
        },
      },
      {
        "@type": "Question",
        name: "When should I send dunning emails?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Send dunning emails between 9-11am in the customer's time zone, Tuesday through Thursday. The first email should go out within 24 hours of the payment failure.",
        },
      },
    ],
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ background: "var(--color-brand)", color: "#fff" }}
            >
              Free Templates
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Dunning Email Templates That Actually Work
            </h1>
            <p
              className="mt-6 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Copy-paste these proven email templates into your payment recovery
              workflow. Each includes subject lines, send timing, and copy
              optimized for maximum recovery rates.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-12">
            {templates.map((template, index) => (
              <Card key={template.id} className="overflow-hidden" id={template.id}>
                <div
                  className="px-6 py-4 flex items-center justify-between"
                  style={{ background: "var(--color-bg-secondary)" }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold" style={{ color: "var(--color-text-tertiary)" }}>
                      #{index + 1}
                    </span>
                    <h2 className="text-lg font-semibold">{template.title}</h2>
                  </div>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      background: template.urgencyColor + "20",
                      color: template.urgencyColor,
                    }}
                  >
                    {template.urgency}
                  </span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Timing:</span>
                      <p style={{ color: "var(--color-text-secondary)" }}>
                        {template.timing}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Subject Line:</span>
                      <p style={{ color: "var(--color-text-secondary)" }}>
                        {template.subjectLine}
                      </p>
                    </div>
                    <div>
                      <span className="font-medium">Preheader:</span>
                      <p style={{ color: "var(--color-text-secondary)" }}>
                        {template.preheader}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Email Body:</h3>
                    <pre
                      className="whitespace-pre-wrap text-sm p-4 rounded-lg overflow-x-auto"
                      style={{
                        background: "var(--color-bg-secondary)",
                        color: "var(--color-text-secondary)",
                      }}
                    >
                      {template.body}
                    </pre>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">💡 Pro Tips:</h3>
                    <ul className="space-y-1">
                      {template.tips.map((tip) => (
                        <li
                          key={tip}
                          className="text-sm flex items-start gap-2"
                        >
                          <span style={{ color: "var(--color-brand)" }}>•</span>
                          <span style={{ color: "var(--color-text-secondary)" }}>
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link href="/auth/signup">
                      <Button variant="primary" size="sm">
                        Use This Template in RecoverKit →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">
              Skip the manual work — let AI write your dunning emails
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              RecoverKit uses AI to generate personalized dunning email sequences
              that match your brand voice. Set up your entire recovery flow in
              under 5 minutes.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Try AI-Generated Emails Free →
                </Button>
              </Link>
              <Link href="/blog/dunning-emails-that-recover-revenue">
                <Button variant="outline" size="lg">
                  Read the Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
