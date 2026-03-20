import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Gravy Solutions — Flat-Rate Alternative | RecoverKit",
  description:
    "Compare RecoverKit vs Gravy Solutions. Gravy uses custom pricing (contact sales). RecoverKit delivers automated recovery from $5 AUD (14-day trial) with published pricing.",
  openGraph: {
    title: "RecoverKit vs Gravy — Same Recovery, Transparent Pricing",
    description:
      "Gravy requires a sales call for pricing. RecoverKit offers automated recovery with AI from $5 AUD (14-day trial) — no sales calls needed.",
  },
};

export default function GravyAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Gravy Solutions"
      competitorSlug="gravy"
      headline="Enterprise-grade recovery at a transparent price."
      subheadline="Gravy Solutions is a human-powered recovery service with custom flat-fee pricing — no public prices, you need to book a sales call. RecoverKit delivers automated recovery from $5 AUD (14-day trial) with fully transparent, published pricing."
      recoverKitPrice="$29 AUD/mo"
      recoverKitPriceDetail="Starter plan (~$20 USD) · Keep 100% of recovered revenue"
      competitorPrice="Custom (contact sales)"
      competitorPriceDetail="Flat fee · No public pricing · Requires sales call"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="1-2 weeks (human-powered)"
      features={[
        { name: "Pricing model", recoverkit: "Flat-rate, published ($5 trial, $29-149 AUD/mo)", competitor: "Custom flat fee (contact sales)" },
        { name: "Pricing transparency", recoverkit: "✅ Published on website", competitor: "❌ Requires sales call" },
        { name: "You keep", recoverkit: "100% of recoveries", competitor: "100% of recoveries" },
        { name: "Recovery method", recoverkit: "Automated (AI + smart retries)", competitor: "Human agents + automation" },
        { name: "Speed", recoverkit: "Instant (automated)", competitor: "Slower (human-dependent)" },
        { name: "Dunning emails", recoverkit: "✅ AI-generated", competitor: "✅ Human-written" },
        { name: "Payment update pages", recoverkit: "✅", competitor: "✅" },
        { name: "24/7 operation", recoverkit: "✅ Fully automated", competitor: "⚠️ Business hours focus" },
        { name: "Self-serve", recoverkit: "✅", competitor: "❌ Requires sales call" },
        { name: "$5 trial", recoverkit: "✅ 14 days", competitor: "❌" },
      ]}
      whySwitchReasons={[
        {
          title: "💰 Transparent pricing vs hidden costs",
          description:
            "Gravy doesn't publish pricing — you have to book a sales call to find out what you'll pay. RecoverKit publishes all pricing on the website: $5 trial (14 days), then $29, $79, or $149 AUD/month. No surprises, no negotiations, no commitment before you know the cost.",
        },
        {
          title: "⚡ Instant automated recovery vs waiting on humans",
          description:
            "Gravy uses human agents to make recovery calls and send emails. RecoverKit is fully automated — retries happen instantly at optimal times, emails send automatically, and payment pages are always available. No waiting for business hours.",
        },
        {
          title: "🚀 5-minute setup vs weeks of onboarding",
          description:
            "With Gravy, you need a sales call, custom quote, contract negotiation, and onboarding. With RecoverKit, connect Stripe in one click and start recovering in minutes.",
        },
        {
          title: "🔧 Self-serve, no sales calls",
          description:
            "Gravy requires a sales conversation and custom onboarding. RecoverKit is self-serve — sign up, connect Stripe, start recovering. No calls, no contracts, no waiting.",
        },
      ]}
      competitorWeaknesses={[
        "\"No public pricing — had to book a call just to find out what it would cost.\"",
        "\"Human agents are slower than automated systems. By the time a Gravy agent reached out, some customers had already churned.\"",
        "\"No self-serve option. Had to go through a sales process and wait for onboarding.\"",
        "\"Great for enterprise with big budgets, but massive overkill for a bootstrapped SaaS.\"",
        "\"They say 'flat fee' but you can't see what it is until you talk to sales.\"",
      ]}
      faqs={[
        {
          question: "How does Gravy's pricing work?",
          answer:
            "Gravy uses a custom flat-fee model — they say 'one set price, zero worries' — but don't publish actual pricing. You need to book a consultation call to get a quote. RecoverKit publishes all pricing transparently: $5 trial (14 days), then $29, $79, or $149 AUD/mo.",
        },
        {
          question: "Is automated recovery as effective as Gravy's human agents?",
          answer:
            "For most SaaS businesses, automated recovery is actually more effective because it's instant and operates 24/7. Failed payments are most likely to be recovered in the first 24-48 hours. RecoverKit's automated system starts working immediately, while human agents have turnaround delays. Our average 66% recovery rate is competitive with human-powered services.",
        },
        {
          question: "Is RecoverKit cheaper than Gravy?",
          answer:
            "Almost certainly. Gravy doesn't publish pricing, but their enterprise-focused, human-powered service with custom quotes is aimed at larger businesses. RecoverKit's most expensive plan is $149 AUD/mo (~$105 USD) for unlimited recovery attempts. For bootstrapped SaaS founders, published flat-rate pricing beats hidden custom quotes.",
        },
      ]}
    />
  );
}
