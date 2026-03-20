import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Churnkey — Affordable Alternative | RecoverKit",
  description:
    "Compare RecoverKit vs Churnkey for failed payment recovery. RecoverKit starts at $5 AUD (14-day trial) vs Churnkey's $250 USD/mo (~$355 AUD). Same core features, 92% less.",
  openGraph: {
    title: "RecoverKit vs Churnkey — Save $325+ AUD/mo on Payment Recovery",
    description:
      "Why pay $250 USD/month (~$355 AUD) for Churnkey when RecoverKit offers smart retry logic, AI dunning emails, and payment update pages starting at $5 AUD (14-day trial)?",
  },
};

export default function ChurnkeyAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Churnkey"
      competitorSlug="churnkey"
      headline="The affordable Churnkey alternative that doesn't compromise on features"
      subheadline="Churnkey charges $250 USD/month (~$355 AUD) for payment recovery — and their best features require $700+ USD/mo plans. RecoverKit gives you the same core recovery features — smart retries, dunning emails, payment update pages — starting at $5 AUD (14-day trial)."
      recoverKitPrice="$29 AUD/mo"
      recoverKitPriceDetail="Starter plan (~$20 USD) · $5 trial (14 days)"
      competitorPrice="$250 USD/mo"
      competitorPriceDetail="~$355 AUD/mo · Starter plan, billed yearly"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="1-2 weeks with onboarding calls"
      features={[
        { name: "Starting price", recoverkit: "$5 AUD trial (14 days)", competitor: "$250 USD/mo (~$355 AUD)" },
        { name: "Smart retry logic", recoverkit: "✅ AI-optimized timing", competitor: "✅ Rules-based (Core $700+/mo)" },
        { name: "Dunning email sequences", recoverkit: "✅ AI-generated", competitor: "✅ Manual templates" },
        { name: "Payment update pages", recoverkit: "✅ Branded", competitor: "✅ Branded" },
        { name: "Recovery analytics", recoverkit: "✅", competitor: "✅ Customer Timelines" },
        { name: "A/B testing", recoverkit: "❌", competitor: "✅ (Core $700+ USD/mo)" },
        { name: "Cancel flows", recoverkit: "❌ Payment recovery focus", competitor: "✅ All plans" },
        { name: "AI email generation", recoverkit: "✅", competitor: "❌" },
        { name: "Self-serve setup", recoverkit: "✅ 5-minute setup", competitor: "⚠️ 14-day trial available" },
        { name: "$5 trial", recoverkit: "✅ 14 days, 10 attempts/mo", competitor: "❌ 14-day trial only" },
        { name: "Monthly billing", recoverkit: "✅ No contracts", competitor: "⚠️ Billed yearly" },
        { name: "Failed Payment Wall", recoverkit: "❌", competitor: "✅ Blocks access until payment updated" },
      ]}
      whySwitchReasons={[
        {
          title: "💰 Save $3,900+ AUD per year",
          description:
            "Churnkey's Starter plan is $250 USD/mo (~$355 AUD/mo) — that's $4,260 AUD/year. RecoverKit's Starter plan is $29 AUD/mo ($348 AUD/year). That's a 92% savings for core payment recovery features. Churnkey's advanced retry features require their $700 USD/mo Core plan.",
        },
        {
          title: "🤖 AI-powered dunning emails included",
          description:
            "RecoverKit uses AI to generate compelling, personalized dunning email sequences on every paid plan. Churnkey relies on manual template building. Our AI creates emails that feel human and convert at higher rates — no extra cost.",
        },
        {
          title: "⚡ 5-minute setup vs weeks of onboarding",
          description:
            "Connect your Stripe account with one click and start recovering payments immediately. Churnkey offers a 14-day trial for Starter/Core, but full setup often involves their retention specialists.",
        },
        {
          title: "🎯 Pay only for what you need",
          description:
            "Churnkey bundles cancel flows, customer timelines, and other retention tools into every plan. If your primary need is recovering failed payments, you're paying for features you don't use. RecoverKit focuses exclusively on payment recovery — and does it well.",
        },
      ]}
      competitorWeaknesses={[
        "\"At $250 USD/month for just the Starter plan, Churnkey was hard to justify for our early-stage SaaS.\"",
        "\"The best features — A/B testing, advanced retries, segmentation — are locked behind the $700/mo Core plan.\"",
        "\"We only needed payment recovery but had to pay for cancel flows and other features we didn't use.\"",
        "\"Billed yearly means you're committing $3,000+ USD upfront before seeing results.\"",
        "\"The platform is powerful but complex. For a small SaaS team, it was more than we needed.\"",
      ]}
      faqs={[
        {
          question: "Is RecoverKit really as effective as Churnkey for payment recovery?",
          answer:
            "For core payment recovery — smart retries, dunning emails, and payment update pages — RecoverKit delivers comparable results. Our average recovery rate is 66% across all customers. Churnkey offers additional retention tools (cancel flows, customer health scoring), but if your primary need is recovering failed payments, RecoverKit delivers at a fraction of the cost.",
        },
        {
          question: "How much can I save by switching from Churnkey to RecoverKit?",
          answer:
            "Significantly. Churnkey Starter is $250 USD/mo (~$355 AUD/mo, billed yearly). RecoverKit's Starter plan is $29 AUD/mo (~$20 USD/mo). That's a saving of over $3,900 AUD per year for core payment recovery features. If you were on Churnkey's Core plan at $700 USD/mo, the savings are even larger.",
        },
        {
          question: "What does Churnkey offer that RecoverKit doesn't?",
          answer:
            "Churnkey includes cancel flows, A/B testing (Core plan+), a Failed Payment Wall, and customer health scoring. These are retention features beyond payment recovery. If you need a full churn prevention suite, Churnkey may be worth the premium. But if your main goal is recovering failed payments, RecoverKit covers that with AI-powered features at 92% less cost.",
        },
        {
          question: "Can I migrate from Churnkey to RecoverKit easily?",
          answer:
            "Yes — migration takes under 5 minutes. Connect your Stripe account to RecoverKit via one-click OAuth. RecoverKit will start monitoring for failed payments immediately. You can run both tools in parallel during your transition.",
        },
      ]}
    />
  );
}
