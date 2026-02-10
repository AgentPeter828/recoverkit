import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

const features = [
  {
    title: "Lightning Fast",
    description:
      "Built on Next.js 15 with server components and edge runtime for blazing-fast performance.",
    icon: "⚡",
  },
  {
    title: "Secure by Default",
    description:
      "Supabase Auth with Row Level Security, magic links, and OAuth providers built in.",
    icon: "🔒",
  },
  {
    title: "Payments Ready",
    description:
      "Stripe integration with subscription management, webhooks, and customer portal.",
    icon: "💳",
  },
];

const pricingTiers = [
  {
    name: "Starter",
    price: "$9",
    period: "/month",
    description: "Perfect for getting started",
    features: [
      "Up to 1,000 requests",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For growing businesses",
    features: [
      "Up to 50,000 requests",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "Custom integrations",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$99",
    period: "/month",
    description: "For large-scale operations",
    features: [
      "Unlimited requests",
      "Full analytics suite",
      "Dedicated support",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantee",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Build your next great idea with{" "}
              <span style={{ color: "var(--color-brand)" }}>{appName}</span>
            </h1>
            <p
              className="mt-6 text-lg leading-8"
              style={{ color: "var(--color-text-secondary)" }}
            >
              The modern SaaS platform that helps you ship faster. Authentication,
              payments, and analytics — all pre-configured and ready to go.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to launch
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Stop reinventing the wheel. Start with a solid foundation.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p style={{ color: "var(--color-text-secondary)" }}>
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" id="pricing">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Choose the plan that works for you. Upgrade or downgrade at any time.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-8 flex flex-col ${
                  tier.highlighted
                    ? "ring-2 scale-105"
                    : ""
                }`}
                style={
                  tier.highlighted
                    ? { borderColor: "var(--color-brand)" }
                    : undefined
                }
              >
                {tier.highlighted && (
                  <span
                    className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start"
                    style={{ background: "var(--color-brand)" }}
                  >
                    Most Popular
                  </span>
                )}
                <h3 className="text-xl font-semibold">{tier.name}</h3>
                <p
                  className="mt-1 text-sm"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>
                    {tier.period}
                  </span>
                </div>
                <ul className="mt-8 space-y-3 flex-1">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span style={{ color: "var(--color-brand)" }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/auth/signup" className="block">
                    <Button
                      variant={tier.highlighted ? "primary" : "outline"}
                      className="w-full"
                    >
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to get started?
            </h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Join thousands of teams building with {appName}. Start your free
              trial today — no credit card required.
            </p>
            <div className="mt-10">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Building for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
