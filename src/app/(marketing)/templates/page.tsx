import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Dunning Email Templates — Free Payment Recovery Emails | RecoverKit",
  description:
    "Free dunning email templates for SaaS payment recovery. Copy-paste subject lines, email body, and timing for your recovery sequence.",
  openGraph: {
    title: "Free Dunning Email Templates for SaaS",
    description: "2 dunning email templates with subject lines, send timing, and copy you can use today.",
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

Just a quick heads up. We tried to process your {{product}} subscription payment of {{amount}}, but it didn't go through. This happens sometimes with expired cards or temporary bank holds, so no worries at all.

To keep your account active and avoid any interruption, you can update your payment method here:

[Update Payment Method →]

It only takes about 30 seconds. If the payment goes through on our next automatic retry, you can ignore this email entirely.

Thanks for being a {{product}} customer. We appreciate you!

Cheers,
The {{product}} Team`,
    tips: [
      "Keep the tone warm and non-threatening",
      "Don't use words like 'failed', 'declined', or 'rejected'",
      "Provide a direct link to update payment. Don't make them search for it",
      "Mention that it might resolve automatically to reduce anxiety",
    ],
  },
  {
    id: "follow-up-reminder",
    title: "Follow-Up Reminder",
    timing: "Send on day 3-5 after payment failure",
    urgency: "Medium",
    urgencyColor: "#f59e0b",
    subjectLine: "Your {{product}} payment still needs attention",
    preheader: "Your subscription payment is still pending — update now to keep access",
    body: `Hi {{first_name}},

Following up on our earlier note — your {{product}} subscription payment of {{amount}} is still pending. We want to make sure you don't lose access to your account.

The most common reason is an expired credit card. You can update your payment method in about 30 seconds:

[Update Payment Method →]

Your data and settings are all safe — we just need a valid payment method to keep things running.

If you're having trouble or have any questions, just reply to this email and we'll help sort it out.

The {{product}} Team`,
    tips: [
      "Reference the earlier email to create continuity",
      "Keep the tone helpful, not pushy",
      "Offer help in case they're having trouble (builds trust)",
      "Reassure them their data is safe to reduce anxiety",
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
          text: "Most effective dunning sequences include 3-5 emails sent over 14 days, starting with a friendly reminder and escalating in urgency. RecoverKit's AI generates a full personalized sequence for you — these two free templates are a starting point.",
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
              Skip the manual work. Let AI write your dunning emails
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
                  Try AI-Generated Emails →
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
