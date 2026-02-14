import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "RecoverKit Alternatives & Comparisons | RecoverKit",
  description:
    "Compare RecoverKit to Churnkey, Baremetrics Recover, Stripe dunning, Gravy Solutions, and Stunning. See why SaaS founders choose RecoverKit for affordable payment recovery.",
};

const competitors = [
  {
    name: "Churnkey",
    slug: "churnkey",
    price: "$300-500+/mo",
    recoverKitSavings: "Save 90%+",
    description:
      "Full churn suite with enterprise pricing. Great for large SaaS, overkill and overpriced for most founders.",
    keyDifference: "Same core recovery features at 10% of the cost",
  },
  {
    name: "Baremetrics Recover",
    slug: "baremetrics",
    price: "$58+/mo",
    recoverKitSavings: "Save 50%+",
    description:
      "Analytics-first platform with recovery as an add-on. Caps your recoveries based on plan tier.",
    keyDifference: "No recovery caps, purpose-built for payment recovery",
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
    price: "10-25% of recovered revenue",
    recoverKitSavings: "Keep 100%",
    description:
      "Human-powered recovery with revenue share pricing. Costs grow as you recover more.",
    keyDifference: "Flat-rate pricing — keep 100% of recovered revenue",
  },
  {
    name: "Stunning",
    slug: "stunning",
    price: "$100+/mo (legacy)",
    recoverKitSavings: "Modern alternative",
    description:
      "One of the original Stripe dunning tools, now discontinued/stagnant with dated features.",
    keyDifference: "Active development, AI-powered, modern UX",
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
              tools. Spoiler: you get the same core features at a fraction of the
              cost.
            </p>
          </div>
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
                          from $0/mo
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
              Start free. Set up in 5 minutes. No credit card required.
            </p>
            <div className="mt-8">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Recovering Revenue Free →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
