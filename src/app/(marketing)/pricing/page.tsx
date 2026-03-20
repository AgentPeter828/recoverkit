import type { Metadata } from "next";
import { Fragment } from "react";
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
      name: "Is there a free trial?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes — RecoverKit offers a $5 AUD 14-day trial with up to 10 recovery attempts per month. It includes basic retry scheduling, default email templates, and the recovery dashboard. After 14 days, your trial automatically upgrades to the Starter plan ($29 AUD/mo) unless you cancel.",
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
        text: "Yes — all RecoverKit plans are month-to-month with no contracts. You can cancel or upgrade at any time from your dashboard. No cancellation fees.",
      },
    },
    {
      "@type": "Question",
      name: "How quickly does RecoverKit pay for itself?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RecoverKit pays for itself after recovering just one failed payment. At $29/month for the Starter plan, you only need to recover one $29+ subscription payment to break even. Results vary by business.",
      },
    },
    {
      "@type": "Question",
      name: "Is RecoverKit tax deductible?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. RecoverKit is a business software subscription and is typically 100% tax deductible as an operating expense. Depending on your tax bracket, your effective cost could be as low as $19/month for the Starter plan. Consult your accountant for details specific to your situation.",
      },
    },
    {
      "@type": "Question",
      name: "How does RecoverKit pricing compare to Churnkey?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "RecoverKit is significantly more affordable. Churnkey starts at $250 USD/month (~$355 AUD). RecoverKit starts at $5 AUD for a 14-day trial, with paid plans from $29 AUD/month (~$20 USD). That's a 92% cost savings for the same core payment recovery features.",
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
          Start your trial, then scale as you grow. No hidden fees. Cancel anytime.
        </p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm" style={{ borderColor: "var(--color-brand)", background: "rgba(79, 70, 229, 0.05)" }}>
          <span style={{ color: "var(--color-brand)" }}>💰</span>
          <span>100% tax deductible as a business expense. Your effective cost is even lower.</span>
        </div>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4" data-testid="pricing-cards">
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
            {plan.name === "Trial" ? (
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                for 14 days · auto-upgrades to Starter
              </p>
            ) : plan.price > 0 ? (
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-tertiary)" }}>
                As low as ~${Math.round(plan.price * 0.68)}/mo after tax deductions*
              </p>
            ) : null}
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
                  {plan.name === "Trial" ? "Start Trial — $5" : "Get Started"}
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>

      {/* ─── TAX FOOTNOTE ─── */}
      <p className="mx-auto mt-6 max-w-2xl text-center text-xs" style={{ color: "var(--color-text-tertiary)" }}>
        *Effective cost based on a 32% marginal tax rate. RecoverKit is typically tax deductible as a business operating expense. Actual savings depend on your tax situation. Consult your accountant for specifics.
      </p>

      {/* ─── FEATURE COMPARISON TABLE ─── */}
      <div className="mx-auto mt-24 max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-2">Compare all features</h2>
        <p className="text-center mb-12" style={{ color: "var(--color-text-secondary)" }}>
          See exactly what you get with each plan
        </p>

        <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--color-border)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "var(--color-bg-secondary)" }}>
                <th className="text-left px-6 py-4 font-semibold" style={{ width: "40%" }}>Feature</th>
                {plans.map((plan) => (
                  <th key={plan.name} className="px-4 py-4 text-center font-semibold" style={{ width: "15%" }}>
                    <div>{plan.name}</div>
                    <div className="text-xs font-normal mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                      {plan.name === "Trial" ? "$5 trial" : `$${plan.price}/mo`}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {COMPARISON_FEATURES.map((section, si) => (
                <Fragment key={`section-${si}`}>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-3 text-xs font-bold uppercase tracking-wider"
                      style={{ background: "var(--color-bg-tertiary)", color: "var(--color-text-secondary)" }}
                    >
                      {section.category}
                    </td>
                  </tr>
                  {section.features.map((feature, fi) => (
                    <tr
                      key={`feature-${si}-${fi}`}
                      className="border-t"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="px-6 py-3.5">
                        <span className="font-medium">{feature.name}</span>
                        {feature.tooltip && (
                          <span className="block text-xs mt-0.5" style={{ color: "var(--color-text-tertiary)" }}>
                            {feature.tooltip}
                          </span>
                        )}
                      </td>
                      {feature.values.map((val, vi) => (
                        <td key={vi} className="px-4 py-3.5 text-center">
                          {val === true ? (
                            <span style={{ color: "#22c55e", fontSize: 18 }}>✓</span>
                          ) : val === false ? (
                            <span style={{ color: "var(--color-text-tertiary)", fontSize: 18 }}>—</span>
                          ) : (
                            <span className="font-medium">{val}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── Comparison data ─── */

interface ComparisonFeature {
  name: string;
  tooltip?: string;
  values: (boolean | string)[];  // [Free, Starter, Growth, Scale]
}

interface ComparisonSection {
  category: string;
  features: ComparisonFeature[];
}

const COMPARISON_FEATURES: ComparisonSection[] = [
  {
    category: "Recovery",
    features: [
      { name: "Recovery attempts/month", values: ["10", "100", "500", "Unlimited"] },
      { name: "Smart retry scheduling", tooltip: "Automatic retries with exponential backoff", values: [true, true, true, true] },
      { name: "Priority retry timing", tooltip: "Retries sent at optimal times for higher success", values: [false, false, true, true] },
      { name: "Failed payment webhooks", values: [true, true, true, true] },
      { name: "Recovery dashboard", tooltip: "Revenue recovered, success rate, active campaigns", values: [true, true, true, true] },
      { name: "Advanced analytics", tooltip: "Detailed recovery trends, cohort analysis", values: [false, false, false, true] },
    ],
  },
  {
    category: "Emails",
    features: [
      { name: "Default email templates", tooltip: "Pre-written 5-step dunning sequence", values: [true, true, true, true] },
      { name: "Email sequence builder", tooltip: "Create and edit custom email sequences", values: [false, true, true, true] },
      { name: "AI-generated emails", tooltip: "Emails tailored to your industry and tone", values: [false, false, true, true] },
      { name: "Custom email domain", tooltip: "Send from billing@yourdomain.com", values: [false, true, true, true] },
      { name: "Email sequences", tooltip: "Number of different sequences you can create", values: ["1", "3", "10", "Unlimited"] },
    ],
  },
  {
    category: "Branding & Pages",
    features: [
      { name: "Custom branding", tooltip: "Your logo and colors on payment pages and emails", values: [false, false, true, true] },
      { name: "Custom payment pages", tooltip: "Branded pages for customers to update their card", values: [false, false, false, true] },
    ],
  },
  {
    category: "Developer",
    features: [
      { name: "API access", tooltip: "REST API for custom integrations", values: [false, false, false, true] },
      { name: "Priority support", values: [false, false, false, true] },
    ],
  },
];
