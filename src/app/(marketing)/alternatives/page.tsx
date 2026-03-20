import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PricingComparisonChart } from "@/components/marketing/PricingComparisonChart";

export const metadata: Metadata = {
  title: "RecoverKit Alternatives & Comparisons | RecoverKit",
  description:
    "Compare RecoverKit to Churnkey, Baremetrics Recover, Stripe dunning, Gravy Solutions, and Stunning. See why SaaS founders choose RecoverKit for affordable payment recovery.",
};

const competitors = [
  {
    name: "Churnkey",
    slug: "churnkey",
    price: "$250 USD/mo (~$355 AUD)",
    recoverKitSavings: "Save 92%",
    description:
      "Full churn suite with premium pricing. Great for large SaaS, overkill and overpriced for most founders.",
    keyDifference: "Same core recovery features at a fraction of the cost",
  },
  {
    name: "Baremetrics Recover",
    slug: "baremetrics",
    price: "$69 USD/mo (~$98 AUD)",
    recoverKitSavings: "Save 70%+",
    description:
      "Analytics-first platform with recovery as an add-on. Pricing scales with your MRR.",
    keyDifference: "Flat-rate pricing, AI-powered, purpose-built for recovery",
  },
  {
    name: "Stripe Built-In Retry",
    slug: "stripe-dunning",
    price: "Free (basic)",
    recoverKitSavings: "2x recovery rate",
    description:
      "Basic fixed-schedule retry with no emails, no payment pages, and no customization. Recovers ~30%.",
    keyDifference: "AI emails + smart timing = 66% recovery vs 30%",
  },
  {
    name: "Gravy Solutions",
    slug: "gravy",
    price: "Custom (contact sales)",
    recoverKitSavings: "Transparent pricing",
    description:
      "Human-powered recovery with hidden custom pricing. Requires a sales call. Built for enterprise, overkill for most founders.",
    keyDifference: "Automated recovery at a fraction of the cost",
  },
  {
    name: "Stunning",
    slug: "stunning",
    price: "~$120 USD/mo (~$170 AUD)",
    recoverKitSavings: "Save 83%",
    description:
      "One of the original Stripe dunning tools (since 2012). Reliable but uses MRR-based pricing that scales as you grow.",
    keyDifference: "Flat-rate AUD pricing + AI-powered features",
  },
];

export default function AlternativesPage() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              RecoverKit vs the competition
            </h1>
            <p
              className="mt-6 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              See how RecoverKit compares to other payment recovery and dunning
              tools. RecoverKit is priced in AUD — most competitors charge in USD.
              Spoiler: you get the same core features at a fraction of the cost.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-16">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <Card className="mx-auto max-w-3xl p-8 sm:p-10">
            <PricingComparisonChart />
          </Card>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-4xl space-y-6">
            {competitors.map((comp) => (
              <Link
                key={comp.slug}
                href={`/alternatives/${comp.slug}`}
                className="block"
              >
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h2 className="text-xl font-semibold">
                          RecoverKit vs {comp.name}
                        </h2>
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--color-brand)",
                            color: "#fff",
                          }}
                        >
                          {comp.recoverKitSavings}
                        </span>
                      </div>
                      <p
                        className="text-sm mb-2"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        {comp.description}
                      </p>
                      <p className="text-sm">
                        <strong>Their price:</strong>{" "}
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          {comp.price}
                        </span>{" "}
                        → <strong>RecoverKit:</strong>{" "}
                        <span style={{ color: "var(--color-brand)" }}>
                          from $5 AUD trial
                        </span>
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Button variant="outline" size="sm">
                        Compare →
                      </Button>
                    </div>
                  </div>
                </Card>
              </Link>
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
            <h2 className="text-3xl font-bold">Ready to try RecoverKit?</h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Start your 14-day trial for $5. Set up in 5 minutes. All prices in AUD.
            </p>
            <div className="mt-8">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Trial — $5 →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
