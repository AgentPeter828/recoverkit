import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { plans } from "@/lib/stripe/config";

export const metadata: Metadata = {
  title: "Pricing",
};

const pricingFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is there a free plan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — RecoverKit offers a free plan with up to 10 recovery attempts per month. No credit card required. It includes basic retry scheduling, default email templates, and the recovery dashboard.",
      },
    },
    {
      "@type": "Question",
      name: "What counts as a recovery attempt?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A recovery attempt is counted each time RecoverKit initiates a recovery campaign for a failed payment — including retry scheduling and dunning email sequences. One failed invoice = one recovery attempt, regardless of how many retries or emails are sent.",
      },
    },
    {
      "@type": "Question",
      name: "Can I cancel anytime?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — all RecoverKit plans are month-to-month with no contracts. You can cancel, upgrade, or downgrade at any time from your dashboard. No cancellation fees.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly does RecoverKit pay for itself?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RecoverKit pays for itself after recovering just one failed payment. At $29/month for the Starter plan, you only need to recover one $29+ subscription payment to break even. The average RecoverKit user recovers $2,800/month.",
      },
    },
    {
      "@type": "Question",
      name: "How does RecoverKit pricing compare to Churnkey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RecoverKit is significantly more affordable. Churnkey starts at $300-500+/month with annual contracts. RecoverKit starts at $0/month (free tier) with paid plans from $29/month. That's a 90%+ cost savings for the same core payment recovery features.",
      },
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-20 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingFaqSchema) }}
      />
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing plans for every stage
        </h1>
        <p
          className="mt-4 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Start free, then scale as you grow. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3" data-testid="pricing-cards">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-8 flex flex-col ${
              plan.highlighted ? "ring-2 scale-105" : ""
            }`}
            style={
              plan.highlighted
                ? { borderColor: "var(--color-brand)" }
                : undefined
            }
          >
            {plan.highlighted && (
              <span
                className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start"
                style={{ background: "var(--color-brand)" }}
              >
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {plan.description}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                /month
              </span>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--color-brand)" }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/auth/signup" className="block">
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
