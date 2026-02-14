import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Gravy Solutions — Flat-Rate Alternative | RecoverKit",
  description:
    "Compare RecoverKit vs Gravy Solutions. Gravy takes a percentage of recovered revenue. RecoverKit charges a flat $29/mo — keep 100% of what you recover.",
  openGraph: {
    title: "RecoverKit vs Gravy — Keep 100% of Your Recovered Revenue",
    description:
      "Gravy takes a cut of every dollar they recover. RecoverKit charges flat-rate pricing so you keep all your recovered revenue.",
  },
};

export default function GravyAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Gravy Solutions"
      competitorSlug="gravy"
      headline="Keep 100% of your recovered revenue. Not a percentage."
      subheadline="Gravy Solutions charges a percentage of every dollar they recover — typically 10-25% of recovered revenue. As your SaaS grows, that gets expensive fast. RecoverKit charges a flat monthly fee so you keep every cent you recover."
      recoverKitPrice="$29/mo"
      recoverKitPriceDetail="Flat rate · Keep 100% of recovered revenue"
      competitorPrice="10-25% of recovered revenue"
      competitorPriceDetail="Revenue share model · Costs grow with your success"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="1-2 weeks (human-powered)"
      features={[
        { name: "Pricing model", recoverkit: "Flat monthly fee", competitor: "% of recovered revenue" },
        { name: "You keep", recoverkit: "100% of recoveries", competitor: "75-90% of recoveries" },
        { name: "Recovery method", recoverkit: "Automated (AI + smart retries)", competitor: "Human agents + automation" },
        { name: "Speed", recoverkit: "Instant (automated)", competitor: "Slower (human-dependent)" },
        { name: "Dunning emails", recoverkit: "✅ AI-generated", competitor: "✅ Human-written" },
        { name: "Payment update pages", recoverkit: "✅", competitor: "✅" },
        { name: "24/7 operation", recoverkit: "✅ Fully automated", competitor: "⚠️ Business hours focus" },
        { name: "Self-serve", recoverkit: "✅", competitor: "❌ Requires sales call" },
        { name: "Free tier", recoverkit: "✅", competitor: "❌" },
        { name: "Transparent pricing", recoverkit: "✅ Published pricing", competitor: "❌ Custom quotes" },
      ]}
      whySwitchReasons={[
        {
          title: "💰 Keep 100% of recovered revenue",
          description:
            "Gravy takes 10-25% of every dollar they recover. If they recover $5,000/month for you, that's $500-1,250/month going to Gravy. RecoverKit charges a flat $29-149/month regardless of how much you recover. The more you recover, the better the deal.",
        },
        {
          title: "⚡ Instant automated recovery vs waiting on humans",
          description:
            "Gravy uses human agents to make recovery calls and send emails. RecoverKit is fully automated — retries happen instantly at optimal times, emails send automatically, and payment pages are always available. No waiting for business hours.",
        },
        {
          title: "📊 Predictable costs that don't scale with success",
          description:
            "With Gravy, your costs increase as you recover more revenue. If your SaaS grows from $10K to $100K MRR, your Gravy bill grows proportionally. RecoverKit stays at the same flat rate. Your success shouldn't be penalized.",
        },
        {
          title: "🔧 Self-serve, no sales calls",
          description:
            "Gravy requires a sales conversation and custom onboarding. RecoverKit is self-serve — sign up, connect Stripe, start recovering. No calls, no contracts, no waiting.",
        },
      ]}
      competitorWeaknesses={[
        "\"We were paying Gravy $800/month in revenue share. Switched to a flat-rate tool and saved $750/month.\"",
        "\"The revenue share model means Gravy makes more money when you have MORE failed payments. The incentives feel misaligned.\"",
        "\"Human agents are slower than automated systems. By the time a Gravy agent reached out, some customers had already churned.\"",
        "\"No self-serve option. Had to go through a sales process and wait for onboarding.\"",
        "\"Pricing isn't transparent — you have to get a custom quote. Hard to budget for.\"",
      ]}
      faqs={[
        {
          question: "How does Gravy's revenue share model work?",
          answer:
            "Gravy typically charges 10-25% of the revenue they successfully recover. So if they recover $5,000 in failed payments for you in a month, you pay Gravy $500-1,250. This means the more successful they are, the more you pay. RecoverKit charges a flat monthly fee ($0-149/mo) regardless of recovery volume.",
        },
        {
          question: "Is automated recovery as effective as Gravy's human agents?",
          answer:
            "For most SaaS businesses, automated recovery is actually more effective because it's instant and operates 24/7. Failed payments are most likely to be recovered in the first 24-48 hours. RecoverKit's automated system starts working immediately, while human agents have turnaround delays. Our average 66% recovery rate is competitive with human-powered services.",
        },
        {
          question: "At what point does RecoverKit become cheaper than Gravy?",
          answer:
            "Almost immediately. If Gravy recovers even $300/month for you at a 10% revenue share, that's $30/month — already more than RecoverKit's $29/month Starter plan. And Gravy's typical rates are higher (15-25%). For any SaaS with meaningful recovery volume, RecoverKit's flat rate is significantly cheaper.",
        },
      ]}
    />
  );
}
