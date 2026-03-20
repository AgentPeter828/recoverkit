import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Baremetrics Recover — Better Value | RecoverKit",
  description:
    "Compare RecoverKit vs Baremetrics Recover for failed payment recovery. RecoverKit starts at $5 AUD (14-day trial) vs Baremetrics Recover at $69 USD/mo (~$98 AUD). No recovery caps, AI-powered emails.",
  openGraph: {
    title: "RecoverKit vs Baremetrics Recover — No Caps, Better Pricing",
    description:
      "Baremetrics Recover starts at $69 USD/mo (~$98 AUD) and scales with MRR. RecoverKit offers AI-powered dunning from $5 AUD (14-day trial) with flat-rate pricing.",
  },
};

export default function BaremetricsAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Baremetrics Recover"
      competitorSlug="baremetrics"
      headline="RecoverKit vs Baremetrics Recover: Better features, better price"
      subheadline="Baremetrics Recover starts at $69 USD/mo (~$98 AUD) for up to $10K MRR and scales with your revenue — reaching $249 USD/mo at $100K MRR. RecoverKit offers flat-rate pricing in AUD, AI-powered emails, and no MRR-based scaling."
      recoverKitPrice="$29 AUD/mo"
      recoverKitPriceDetail="Starter plan (~$20 USD) · $5 trial (14 days)"
      competitorPrice="$69 USD/mo"
      competitorPriceDetail="~$98 AUD/mo · Up to $10K MRR · Scales with revenue"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="15-30 minutes"
      features={[
        { name: "Starting price", recoverkit: "$5 AUD trial (14 days)", competitor: "$69 USD/mo (~$98 AUD)" },
        { name: "Pricing model", recoverkit: "Flat-rate (doesn't scale with MRR)", competitor: "MRR-based (scales as you grow)" },
        { name: "Smart retry logic", recoverkit: "✅ AI-optimized timing", competitor: "✅ Automatic scheduling" },
        { name: "Dunning emails", recoverkit: "✅ AI-generated sequences", competitor: "✅ Template-based" },
        { name: "AI email generation", recoverkit: "✅", competitor: "❌" },
        { name: "Payment update pages", recoverkit: "✅ Branded", competitor: "✅" },
        { name: "Pre-dunning emails", recoverkit: "❌", competitor: "❌" },
        { name: "SMS recovery", recoverkit: "❌", competitor: "❌" },
        { name: "Analytics dashboard", recoverkit: "✅ Recovery focused", competitor: "✅ Part of Baremetrics suite" },
        { name: "Standalone product", recoverkit: "✅ Purpose-built", competitor: "⚠️ Add-on to analytics platform" },
        { name: "$5 trial", recoverkit: "✅ 14 days, 10 attempts/mo", competitor: "❌" },
        { name: "Self-serve setup", recoverkit: "✅ One-click Stripe", competitor: "✅" },
      ]}
      whySwitchReasons={[
        {
          title: "💰 Flat-rate pricing vs MRR scaling",
          description:
            "Baremetrics Recover costs $69 USD/mo at $10K MRR, $129 USD/mo at $25K MRR, $189 USD/mo at $50K MRR, and $249 USD/mo at $100K MRR — it keeps climbing. RecoverKit stays at the same flat rate regardless of your MRR. At $100K MRR, you'd save over $200 USD/mo.",
        },
        {
          title: "🤖 AI-generated dunning emails",
          description:
            "RecoverKit uses AI to create compelling, empathetic dunning email sequences that escalate naturally. Baremetrics Recover offers template-based emails. Our AI-written emails consistently outperform generic templates.",
        },
        {
          title: "🎯 Purpose-built for recovery",
          description:
            "Baremetrics Recover is an add-on to their analytics platform. RecoverKit is built from the ground up for one thing: recovering your failed payments. Every feature is optimized for maximum recovery rates.",
        },
        {
          title: "🇦🇺 AUD pricing — no currency surprises",
          description:
            "RecoverKit prices in AUD. Baremetrics charges in USD, which means Australian founders pay more due to exchange rates. RecoverKit's $29 AUD/mo is ~$20 USD — making it even more affordable than it looks.",
        },
      ]}
      competitorWeaknesses={[
        "\"Pricing scales with MRR, so as we grew past $50K MRR, our Recover bill hit $189 USD/month for just dunning.\"",
        "\"I only needed the Recover tool but had to understand the whole Baremetrics ecosystem.\"",
        "\"No AI features — the email templates are pretty basic. Newer tools do more with less effort.\"",
        "\"Good analytics platform, but Recover feels like a bolt-on rather than a core product.\"",
        "\"Being charged in USD adds up when you're an Australian business.\"",
      ]}
      faqs={[
        {
          question: "Is Baremetrics Recover the same as Baremetrics?",
          answer:
            "Baremetrics Recover is a separate product/add-on from the main Baremetrics analytics platform. The main Baremetrics Metrics platform starts at $75 USD/mo (with a 35% annual discount available). Recover has its own pricing starting at $69 USD/mo for up to $10K MRR.",
        },
        {
          question: "How does RecoverKit's pricing compare as my SaaS grows?",
          answer:
            "RecoverKit uses flat-rate AUD pricing: $5 trial, then $29, $79, or $149 AUD/mo depending on your volume needs. Baremetrics Recover scales with your MRR — at $100K MRR you're paying $249 USD/mo (~$354 AUD). With RecoverKit, a $100K MRR SaaS pays the same $149 AUD/mo as a $500K MRR SaaS.",
        },
        {
          question: "Does Baremetrics Recover have AI features?",
          answer:
            "No — Baremetrics Recover uses automatic retry scheduling and template-based dunning emails. It doesn't offer AI email generation or AI-optimized retry timing. RecoverKit includes AI-generated dunning emails on all paid plans.",
        },
      ]}
    />
  );
}
