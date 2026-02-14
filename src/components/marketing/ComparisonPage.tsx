import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface Feature {
  name: string;
  recoverkit: string;
  competitor: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface ComparisonPageProps {
  competitorName: string;
  competitorSlug: string;
  headline: string;
  subheadline: string;
  competitorPrice: string;
  competitorPriceDetail: string;
  recoverKitPrice: string;
  recoverKitPriceDetail: string;
  setupTimeRecoverKit: string;
  setupTimeCompetitor: string;
  features: Feature[];
  whySwitchReasons: { title: string; description: string }[];
  faqs: FAQ[];
  competitorWeaknesses: string[];
}

export function ComparisonPage({
  competitorName,
  competitorSlug,
  headline,
  subheadline,
  competitorPrice,
  competitorPriceDetail,
  recoverKitPrice,
  recoverKitPriceDetail,
  setupTimeRecoverKit,
  setupTimeCompetitor,
  features,
  whySwitchReasons,
  faqs,
  competitorWeaknesses,
}: ComparisonPageProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ background: "var(--color-brand)", color: "#fff" }}
            >
              RecoverKit vs {competitorName}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {headline}
            </h1>
            <p
              className="mt-6 text-lg leading-8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {subheadline}
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Try RecoverKit Free →
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Comparison */}
      <section
        className="py-16 border-y"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-bg-secondary)",
        }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Pricing Comparison
          </h2>
          <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card
              className="p-8 text-center ring-2"
              style={{ borderColor: "var(--color-brand)" }}
            >
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--color-brand)" }}
              >
                RecoverKit
              </h3>
              <p className="text-4xl font-bold">{recoverKitPrice}</p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {recoverKitPriceDetail}
              </p>
              <p className="text-sm mt-4">
                Setup time: <strong>{setupTimeRecoverKit}</strong>
              </p>
            </Card>
            <Card className="p-8 text-center opacity-75">
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {competitorName}
              </h3>
              <p className="text-4xl font-bold">{competitorPrice}</p>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                {competitorPriceDetail}
              </p>
              <p className="text-sm mt-4">
                Setup time: <strong>{setupTimeCompetitor}</strong>
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Feature-by-Feature Comparison
          </h2>
          <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr
                    style={{ background: "var(--color-bg-secondary)" }}
                  >
                    <th className="px-4 py-3 text-left font-semibold">
                      Feature
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold"
                      style={{ color: "var(--color-brand)" }}
                    >
                      RecoverKit
                    </th>
                    <th
                      className="px-4 py-3 text-center font-semibold"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {competitorName}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature) => (
                    <tr
                      key={feature.name}
                      className="border-t"
                      style={{ borderColor: "var(--color-border)" }}
                    >
                      <td className="px-4 py-3 font-medium">
                        {feature.name}
                      </td>
                      <td className="px-4 py-3 text-center font-semibold">
                        {feature.recoverkit}
                      </td>
                      <td
                        className="px-4 py-3 text-center"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {feature.competitor}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Switch */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-4">
            Why Switch from {competitorName} to RecoverKit?
          </h2>
          <p
            className="text-center mb-12 max-w-2xl mx-auto"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {competitorName} has its merits, but here&apos;s why SaaS founders are
            making the switch:
          </p>
          <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-6">
            {whySwitchReasons.map((reason) => (
              <Card key={reason.title} className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  {reason.title}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {reason.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Weaknesses */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-center mb-8">
              Common {competitorName} Complaints
            </h2>
            <div className="space-y-4">
              {competitorWeaknesses.map((weakness, i) => (
                <Card key={i} className="p-4 flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">⚠️</span>
                  <p className="text-sm">{weakness}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="mx-auto max-w-3xl space-y-6">
            {faqs.map((faq) => (
              <Card key={faq.question} className="p-6">
                <h3 className="font-semibold mb-2">{faq.question}</h3>
                <p
                  className="text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {faq.answer}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Ready to switch from {competitorName}?
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Set up RecoverKit in under 5 minutes. Start recovering failed
              payments today — from $0/month.
            </p>
            <div className="mt-8 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Free →
                </Button>
              </Link>
              <Link href="/guides/switching">
                <Button variant="outline" size="lg">
                  Migration Guide
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
