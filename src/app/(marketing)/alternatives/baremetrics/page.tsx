import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Baremetrics Recover — Better Value | RecoverKit",
  description:
    "Compare RecoverKit vs Baremetrics Recover for failed payment recovery. No recovery caps, AI-powered emails, and transparent pricing starting at $0/mo.",
  openGraph: {
    title: "RecoverKit vs Baremetrics Recover — No Caps, Better Pricing",
    description:
      "Baremetrics Recover caps your recoveries and charges $58+/mo. RecoverKit offers unlimited potential with AI-powered dunning from $0/mo.",
  },
};

export default function BaremetricsAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Baremetrics Recover"
      competitorSlug="baremetrics"
      headline="RecoverKit vs Baremetrics Recover: No caps, no surprises"
      subheadline="Baremetrics Recover starts at $58/mo with recovery caps that limit how much revenue you can get back. RecoverKit offers transparent pricing, AI-powered emails, and no artificial limits on your recoveries."
      recoverKitPrice="$29/mo"
      recoverKitPriceDetail="Starter plan · Free plan at $0/mo · Scale plan for unlimited"
      competitorPrice="$58+/mo"
      competitorPriceDetail="Scales with MRR · Recovery caps apply"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="15-30 minutes"
      features={[
        { name: "Starting price", recoverkit: "$0/mo", competitor: "$58/mo" },
        { name: "Recovery caps", recoverkit: "❌ No artificial caps", competitor: "⚠️ Caps based on plan" },
        { name: "Smart retry logic", recoverkit: "✅ AI-optimized", competitor: "✅ Basic scheduling" },
        { name: "AI email generation", recoverkit: "✅", competitor: "❌" },
        { name: "Custom dunning sequences", recoverkit: "✅ Multi-step builder", competitor: "✅ Limited templates" },
        { name: "Payment update pages", recoverkit: "✅ Branded", competitor: "✅" },
        { name: "Analytics dashboard", recoverkit: "✅ Recovery focused", competitor: "✅ Part of Baremetrics suite" },
        { name: "Standalone product", recoverkit: "✅ Purpose-built", competitor: "⚠️ Add-on to analytics" },
        { name: "Free tier", recoverkit: "✅", competitor: "❌" },
        { name: "Self-serve setup", recoverkit: "✅ One-click Stripe", competitor: "✅" },
      ]}
      whySwitchReasons={[
        {
          title: "🚫 No recovery caps",
          description:
            "Baremetrics Recover limits how much revenue you can recover based on your plan tier. That means if you're having a bad month with lots of failed payments, you hit a ceiling. RecoverKit doesn't cap your recoveries — every failed payment gets attention.",
        },
        {
          title: "🤖 AI-generated dunning emails",
          description:
            "RecoverKit uses AI to create compelling, empathetic dunning email sequences that escalate naturally. Baremetrics offers basic templates. Our AI-written emails consistently outperform generic templates.",
        },
        {
          title: "🎯 Purpose-built for recovery",
          description:
            "Baremetrics Recover is an add-on to their analytics platform. RecoverKit is built from the ground up for one thing: recovering your failed payments. Every feature is optimized for maximum recovery rates.",
        },
        {
          title: "💰 More affordable at every tier",
          description:
            "Baremetrics Recover starts at $58/mo and scales with your MRR. RecoverKit starts free and offers predictable flat-rate pricing. You always know what you'll pay, regardless of how much you recover.",
        },
      ]}
      competitorWeaknesses={[
        "\"Hit my recovery cap in the middle of the month. Failed payments after that just... went unrecovered.\"",
        "\"I only needed the Recover tool but had to understand the whole Baremetrics ecosystem.\"",
        "\"Pricing scales with MRR, so as we grew, the cost kept climbing even though the tool stayed the same.\"",
        "\"The email templates are pretty basic. Wished I could customize them more or use AI to generate better ones.\"",
        "\"Good analytics platform, but Recover feels like a bolt-on rather than a core product.\"",
      ]}
      faqs={[
        {
          question: "Does Baremetrics Recover really cap recoveries?",
          answer:
            "Yes — Baremetrics Recover plans include limits on the number or value of recoveries per month. Once you hit the cap, additional failed payments aren't actively recovered until the next billing cycle. RecoverKit doesn't impose artificial caps on any plan.",
        },
        {
          question: "Do I need the full Baremetrics suite to use Recover?",
          answer:
            "Baremetrics Recover is available as a standalone add-on, but it's designed to work within their analytics ecosystem. RecoverKit is a standalone, purpose-built payment recovery tool — you get exactly what you need without paying for analytics you might not use.",
        },
        {
          question: "How does RecoverKit's pricing compare as my SaaS grows?",
          answer:
            "RecoverKit uses flat-rate pricing: $0, $29, $79, or $149/mo depending on your volume needs. Baremetrics scales with your MRR, meaning your costs grow as your revenue grows. With RecoverKit, a $100K MRR SaaS pays the same $149/mo as a $500K MRR SaaS on the Scale plan.",
        },
      ]}
    />
  );
}
