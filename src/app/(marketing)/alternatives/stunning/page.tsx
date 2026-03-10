import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Stunning — Modern Alternative | RecoverKit",
  description:
    "Looking for a Stunning alternative? RecoverKit is the modern, AI-powered alternative with better pricing starting at $0/mo.",
  openGraph: {
    title: "RecoverKit — The Modern Stunning Alternative",
    description:
      "Stunning charges ~$120/mo and scales with MRR. RecoverKit offers AI-powered payment recovery with modern features, starting at $0/mo.",
  },
};

export default function StunningAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Stunning"
      competitorSlug="stunning"
      headline="Looking for a Stunning alternative? You've found it."
      subheadline="Stunning is one of the original Stripe dunning tools with 14+ years of experience, but its MRR-based pricing (~$120 USD/mo at $40K MRR) adds up fast. RecoverKit is a modern, AI-powered alternative with flat-rate AUD pricing starting at $0/mo."
      recoverKitPrice="$29 AUD/mo"
      recoverKitPriceDetail="Starter plan (~$20 USD) · Free plan at $0/mo"
      competitorPrice="~$120 USD/mo"
      competitorPriceDetail="~$170 AUD/mo · At $40K MRR · Scales with revenue"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="15-30 minutes"
      features={[
        { name: "Starting price", recoverkit: "$0 AUD/mo", competitor: "~$120 USD/mo (~$170 AUD)" },
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
          title: "🤖 AI-powered recovery",
          description:
            "Stunning offers solid traditional dunning features, but RecoverKit leverages AI for email generation, retry timing optimization, and personalization — modern capabilities that significantly improve recovery rates.",
        },
        {
          title: "💰 Flat-rate pricing vs MRR-based scaling",
          description:
            "Stunning's pricing scales with your MRR — at $40K MRR you're paying ~$120/mo, and it keeps climbing as you grow. RecoverKit charges flat rates ($0-149/mo) regardless of your MRR. Your recovery tool shouldn't get more expensive just because your business is growing.",
        },
        {
          title: "🎯 No cancel flows overhead",
          description:
            "Stunning doesn't include cancel flows, and neither does RecoverKit — both focus on payment recovery. But RecoverKit does it at a fraction of the cost with AI-powered features Stunning doesn't offer.",
        },
        {
          title: "🎨 Modern experience",
          description:
            "RecoverKit features a modern, intuitive dashboard built with current web standards. Your payment update pages look professional and contemporary.",
        },
      ]}
      competitorWeaknesses={[
        "\"Pricing scales with MRR. As we grew past $50K MRR, the dunning tool alone was costing us $150+/month.\"",
        "\"No AI features — everything is manual templates. Newer tools do more with less effort.\"",
        "\"Only supports Stripe and Subbly. If you ever want to add another processor, you're stuck.\"",
        "\"The interface works but feels older compared to modern SaaS tools.\"",
        "\"Solid tool but paying MRR-based pricing for dunning emails feels like overpaying.\"",
      ]}
      faqs={[
        {
          question: "Is Stunning still active?",
          answer:
            "Yes — Stunning has been around since 2012 and has recovered over $12 billion for customers. It's a proven, reliable tool. However, it uses MRR-based pricing that scales as you grow, and it doesn't offer AI-powered features. RecoverKit is a modern alternative with flat-rate pricing and AI-powered email generation.",
        },
        {
          question: "Can I migrate from Stunning to RecoverKit?",
          answer:
            "Yes — migration is simple. Connect your Stripe account to RecoverKit (takes under 5 minutes), and RecoverKit will immediately start monitoring for failed payments. There's no data to migrate since RecoverKit connects directly to your Stripe account. Cancel Stunning when you're ready.",
        },
        {
          question: "How is RecoverKit different from Stunning?",
          answer:
            "RecoverKit is a modern, AI-powered payment recovery tool built for today's SaaS landscape. Key differences include: AI-generated dunning emails, AI-optimized retry timing, a modern dashboard and payment pages, and flat-rate pricing starting at $0/mo (vs Stunning's MRR-based pricing starting at ~$120/mo).",
        },
      ]}
    />
  );
}
