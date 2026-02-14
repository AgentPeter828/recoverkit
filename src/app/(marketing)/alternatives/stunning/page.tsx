import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Stunning — Modern Alternative | RecoverKit",
  description:
    "Looking for a Stunning alternative? Stunning has been discontinued/stagnant. RecoverKit is the modern, actively developed alternative with AI-powered recovery from $0/mo.",
  openGraph: {
    title: "RecoverKit — The Modern Stunning Alternative",
    description:
      "Stunning is no longer actively developed. RecoverKit offers AI-powered payment recovery with modern features, starting at $0/mo.",
  },
};

export default function StunningAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Stunning"
      competitorSlug="stunning"
      headline="Looking for a Stunning alternative? You've found it."
      subheadline="Stunning was one of the first Stripe dunning tools, but it's no longer actively maintained. RecoverKit is a modern, AI-powered alternative that's actively developed, affordably priced, and built for today's SaaS landscape."
      recoverKitPrice="$29/mo"
      recoverKitPriceDetail="Starter plan · Free plan at $0/mo · Actively developed"
      competitorPrice="$100+/mo"
      competitorPriceDetail="Legacy pricing · Limited updates"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="15-30 minutes"
      features={[
        { name: "Status", recoverkit: "✅ Actively developed", competitor: "⚠️ Discontinued/stagnant" },
        { name: "Starting price", recoverkit: "$0/mo", competitor: "$100+/mo" },
        { name: "AI email generation", recoverkit: "✅", competitor: "❌" },
        { name: "Smart retry logic", recoverkit: "✅ AI-optimized", competitor: "✅ Basic scheduling" },
        { name: "Payment update pages", recoverkit: "✅ Modern, branded", competitor: "✅ Dated design" },
        { name: "Dunning sequences", recoverkit: "✅ Multi-step builder", competitor: "✅ Basic" },
        { name: "Modern UI/UX", recoverkit: "✅ 2025 design", competitor: "❌ Dated interface" },
        { name: "API access", recoverkit: "✅ Scale plan", competitor: "⚠️ Limited" },
        { name: "Active support", recoverkit: "✅ Email + priority", competitor: "⚠️ Minimal" },
        { name: "Free tier", recoverkit: "✅", competitor: "❌" },
      ]}
      whySwitchReasons={[
        {
          title: "🔄 Active development vs abandoned product",
          description:
            "Stunning is no longer receiving meaningful updates. RecoverKit is actively developed with new features shipping regularly — AI email generation, smart retry optimization, and more on the roadmap.",
        },
        {
          title: "🤖 AI-powered recovery",
          description:
            "Stunning predates the AI era. RecoverKit leverages AI for email generation, retry timing optimization, and personalization — modern capabilities that significantly improve recovery rates.",
        },
        {
          title: "💰 More affordable",
          description:
            "Stunning's legacy pricing was $100+/month. RecoverKit starts at $0/month with a free tier and offers its full-featured Starter plan at just $29/month — a significant cost savings.",
        },
        {
          title: "🎨 Modern experience",
          description:
            "RecoverKit features a modern, intuitive dashboard built with current web standards. Your payment update pages look professional and contemporary — not like they were designed in 2015.",
        },
      ]}
      competitorWeaknesses={[
        "Stunning hasn't shipped meaningful updates in recent years. The product feels abandoned.",
        "The UI and payment pages look dated compared to modern alternatives.",
        "No AI-powered features — everything is manual template-based.",
        "Pricing was expensive for what you got, especially compared to modern tools.",
        "Support response times degraded as the product lost focus.",
        "Integration and webhook handling hasn't kept up with Stripe's latest API changes.",
      ]}
      faqs={[
        {
          question: "Is Stunning discontinued?",
          answer:
            "Stunning appears to no longer be actively developed or maintained. While the service may still technically function for existing users, it hasn't received meaningful updates. RecoverKit is a modern, actively developed alternative with AI-powered features and regular updates.",
        },
        {
          question: "Can I migrate from Stunning to RecoverKit?",
          answer:
            "Yes — migration is simple. Connect your Stripe account to RecoverKit (takes under 5 minutes), and RecoverKit will immediately start monitoring for failed payments. There's no data to migrate since RecoverKit connects directly to your Stripe account. Cancel Stunning when you're ready.",
        },
        {
          question: "How is RecoverKit different from Stunning?",
          answer:
            "RecoverKit is a modern, AI-powered payment recovery tool built for today's SaaS landscape. Key differences include: AI-generated dunning emails, AI-optimized retry timing, a modern dashboard and payment pages, active development with regular updates, and pricing starting at $0/mo (vs Stunning's $100+/mo).",
        },
      ]}
    />
  );
}
