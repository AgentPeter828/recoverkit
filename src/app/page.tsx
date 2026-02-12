import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const features = [
  {
    title: "Smart Retry Logic",
    description: "Exponential backoff with AI-optimized timing. Retries at the moments most likely to succeed — Tuesdays at 10am, not 3am on Sunday.",
    icon: "🔄",
  },
  {
    title: "AI-Written Dunning Emails",
    description: "Generate compelling, empathetic email sequences with AI. Each step escalates urgency naturally — from friendly reminder to last chance.",
    icon: "✨",
  },
  {
    title: "Payment Update Pages",
    description: "Branded, hosted pages where your customers can update their card in seconds. Include links in your dunning emails automatically.",
    icon: "💳",
  },
  {
    title: "Recovery Dashboard",
    description: "Track revenue recovered, active campaigns, success rates, and more. Know exactly how much RecoverKit is saving you.",
    icon: "📊",
  },
  {
    title: "Stripe Integration",
    description: "One-click Stripe Connect. We monitor your account for failed payments and start recovering them automatically.",
    icon: "⚡",
  },
  {
    title: "Works While You Sleep",
    description: "Set it and forget it. RecoverKit automatically retries payments, sends emails, and updates you on recoveries.",
    icon: "🌙",
  },
];

const pricingTiers = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Try it out",
    features: [
      "Up to 10 recovery attempts/month",
      "Basic retry scheduling",
      "Default email templates",
      "Recovery dashboard",
    ],
    cta: "Get Started Free",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    description: "For indie SaaS founders",
    features: [
      "100 recovery attempts/month",
      "Smart retry scheduling",
      "Email sequence builder",
      "Recovery dashboard",
      "Email support",
    ],
    cta: "Start Recovering",
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$79",
    period: "/month",
    description: "For growing SaaS businesses",
    features: [
      "500 recovery attempts/month",
      "AI-generated email templates",
      "Custom branding",
      "Priority retry timing",
      "Email sequence builder",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$149",
    period: "/month",
    description: "For serious SaaS operations",
    features: [
      "Unlimited recovery attempts",
      "Priority retry scheduling",
      "Advanced analytics",
      "Custom payment pages",
      "API access",
      "Priority support",
    ],
    cta: "Contact Us",
    highlighted: false,
  },
];

const socialProof = [
  { stat: "9%", label: "of MRR lost to failed payments on average" },
  { stat: "$2.8K", label: "recovered per month by the average RecoverKit user" },
  { stat: "66%", label: "average recovery rate across all customers" },
  { stat: "< 5min", label: "to set up — just connect your Stripe account" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6" style={{ background: "var(--color-brand)", color: "#fff", opacity: 0.9 }}>
              Stop losing 9% of your MRR to failed payments
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
              Recover failed payments{" "}
              <span style={{ color: "var(--color-brand)" }}>automatically</span>
            </h1>
            <p className="mt-6 text-lg leading-8" style={{ color: "var(--color-text-secondary)" }}>
              RecoverKit uses smart retry logic and AI-written dunning emails to recover
              the revenue your SaaS is losing to failed subscription payments. Set it up in
              under 5 minutes.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-4">
              <Link href="/auth/signup">
                <Button variant="primary" size="lg">
                  Start Recovering Revenue →
                </Button>
              </Link>
              <Link href="/pricing">
                <Button variant="outline" size="lg">
                  View Pricing
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Free plan available · No credit card required · 5-minute setup
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Stats */}
      <section className="py-12 border-y" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {socialProof.map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-3xl font-bold" style={{ color: "var(--color-brand)" }}>{item.stat}</p>
                <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem / Solution */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
              Failed payments are silently killing your MRR
            </h2>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              <Card className="p-8" style={{ background: "#fef2f2", borderColor: "#fecaca" }}>
                <h3 className="text-lg font-semibold text-red-800 mb-3">❌ Without RecoverKit</h3>
                <ul className="space-y-2 text-sm text-red-700">
                  <li>• Stripe&apos;s basic retry fails 70% of the time</li>
                  <li>• Customers churn without knowing their card failed</li>
                  <li>• You lose ~$900/month per $10K MRR</li>
                  <li>• Competitors charge $300+/mo or take a revenue cut</li>
                </ul>
              </Card>
              <Card className="p-8" style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}>
                <h3 className="text-lg font-semibold text-green-800 mb-3">✅ With RecoverKit</h3>
                <ul className="space-y-2 text-sm text-green-700">
                  <li>• Smart retries at optimal times (66% recovery rate)</li>
                  <li>• AI emails that feel personal, not robotic</li>
                  <li>• Customers fix their payment in one click</li>
                  <li>• Starts at $29/mo — pays for itself in days</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{ background: "var(--color-bg-secondary)" }} id="features">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to recover lost revenue
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Smart retry logic, AI-powered emails, and branded payment pages — all working together automatically.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center p-8">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p style={{ color: "var(--color-text-secondary)" }}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Set up in 3 steps
            </h2>
          </div>
          <div className="mx-auto max-w-3xl grid grid-cols-1 gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Connect Stripe", desc: "One-click OAuth. RecoverKit starts monitoring your account instantly." },
              { step: "2", title: "Customize Emails", desc: "Use our AI to generate dunning emails, or write your own sequences." },
              { step: "3", title: "Recover Revenue", desc: "RecoverKit automatically retries payments and emails customers." },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-lg" style={{ background: "var(--color-brand)" }}>
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" style={{ background: "var(--color-bg-secondary)" }} id="pricing">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center" data-testid="pricing-cards">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Pricing that pays for itself
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Recover just one failed payment and RecoverKit has paid for itself. Choose the plan that matches your volume.
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pricingTiers.map((tier) => (
              <Card
                key={tier.name}
                className={`p-6 flex flex-col ${tier.highlighted ? "ring-2 sm:scale-105" : ""}`}
                style={tier.highlighted ? { borderColor: "var(--color-brand)" } : undefined}
              >
                {tier.highlighted && (
                  <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start" style={{ background: "var(--color-brand)" }}>
                    Most Popular
                  </span>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>{tier.description}</p>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  <span style={{ color: "var(--color-text-secondary)" }}>{tier.period}</span>
                </div>
                <ul className="mt-6 space-y-2 flex-1">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <span style={{ color: "var(--color-brand)" }}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-6">
                  <Link href="/auth/signup" className="block">
                    <Button variant={tier.highlighted ? "primary" : "outline"} className="w-full">
                      {tier.cta}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Competitor Comparison */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Why RecoverKit over alternatives?
            </h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Card className="overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "var(--color-bg-secondary)" }}>
                    <th className="px-4 py-3 text-left"></th>
                    <th className="px-4 py-3 text-center font-semibold" style={{ color: "var(--color-brand)" }}>RecoverKit</th>
                    <th className="px-4 py-3 text-center" style={{ color: "var(--color-text-secondary)" }}>Churn Buster</th>
                    <th className="px-4 py-3 text-center" style={{ color: "var(--color-text-secondary)" }}>Stripe Built-in</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Starting price", "$0/mo", "$300/mo", "Free (basic)"],
                    ["AI email generation", "✅", "❌", "❌"],
                    ["Smart retry timing", "✅", "✅", "⚠️ Basic"],
                    ["Custom email sequences", "✅", "✅", "❌"],
                    ["Payment update pages", "✅", "✅", "❌"],
                    ["Setup time", "5 minutes", "1+ hours", "N/A"],
                  ].map(([feature, rk, cb, stripe]) => (
                    <tr key={feature} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                      <td className="px-4 py-3 font-medium">{feature}</td>
                      <td className="px-4 py-3 text-center font-semibold">{rk}</td>
                      <td className="px-4 py-3 text-center" style={{ color: "var(--color-text-secondary)" }}>{cb}</td>
                      <td className="px-4 py-3 text-center" style={{ color: "var(--color-text-secondary)" }}>{stripe}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: "var(--color-bg-secondary)" }}>
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Stop losing revenue to failed payments
            </h2>
            <p className="mt-4 text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Join hundreds of SaaS founders who are recovering thousands in lost MRR
              every month with RecoverKit. Start free — no credit card required.
            </p>
            <div className="mt-10">
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
