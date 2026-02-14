import type { Metadata } from "next";
import { ComparisonPage } from "@/components/marketing/ComparisonPage";

export const metadata: Metadata = {
  title: "RecoverKit vs Stripe Built-In Dunning — Why You Need More | RecoverKit",
  description:
    "Stripe's built-in retry only recovers ~30% of failed payments. RecoverKit adds AI-powered dunning emails, smart retry timing, and payment update pages to recover 66%+.",
  openGraph: {
    title: "RecoverKit vs Stripe's Built-In Retry — Recover 2x More Revenue",
    description:
      "Stripe's basic retry schedule isn't enough. RecoverKit adds AI dunning emails, optimized retry timing, and branded payment update pages.",
  },
};

export default function StripeDunningAlternativePage() {
  return (
    <ComparisonPage
      competitorName="Stripe Built-In Retry"
      competitorSlug="stripe-dunning"
      headline="Stripe's built-in retry isn't enough. Here's why."
      subheadline="Stripe's automatic retry schedule is basic — fixed intervals, no email sequences, no customer outreach. It recovers roughly 30% of failed payments. RecoverKit adds AI-powered dunning emails, smart retry timing, and payment update pages to recover 66%+ on average."
      recoverKitPrice="$29/mo"
      recoverKitPriceDetail="Starter plan · Free plan at $0/mo"
      competitorPrice="Free"
      competitorPriceDetail="Built into Stripe · Very basic functionality"
      setupTimeRecoverKit="Under 5 minutes"
      setupTimeCompetitor="Already active (default)"
      features={[
        { name: "Price", recoverkit: "From $0/mo", competitor: "Free (built-in)" },
        { name: "Retry scheduling", recoverkit: "✅ AI-optimized timing", competitor: "⚠️ Fixed schedule (1, 3, 5, 7 days)" },
        { name: "Dunning emails", recoverkit: "✅ AI-generated sequences", competitor: "❌ None" },
        { name: "Payment update pages", recoverkit: "✅ Branded, one-click", competitor: "❌" },
        { name: "Customer notification", recoverkit: "✅ Multi-step sequences", competitor: "⚠️ Single generic email" },
        { name: "Recovery analytics", recoverkit: "✅ Detailed dashboard", competitor: "⚠️ Basic in Stripe Dashboard" },
        { name: "Custom branding", recoverkit: "✅", competitor: "❌" },
        { name: "Average recovery rate", recoverkit: "66%", competitor: "~30%" },
        { name: "Email personalization", recoverkit: "✅ AI-powered", competitor: "❌" },
        { name: "Escalation sequences", recoverkit: "✅ Multi-step", competitor: "❌ Single attempt" },
      ]}
      whySwitchReasons={[
        {
          title: "📈 Recover 2x more failed payments",
          description:
            "Stripe's built-in retry recovers about 30% of failed payments using a simple fixed schedule. RecoverKit's combination of smart retry timing, AI dunning emails, and payment update pages achieves a 66% average recovery rate — more than double.",
        },
        {
          title: "📧 Customers don't know their payment failed",
          description:
            "Stripe sends one generic failed payment email at best. Most customers never see it. RecoverKit sends a carefully timed sequence of 3-5 emails that escalate naturally — friendly reminder, urgent notice, final warning — so customers actually take action.",
        },
        {
          title: "💳 One-click payment updates",
          description:
            "When a customer's card is declined, they need an easy way to fix it. RecoverKit creates branded payment update pages where customers can enter a new card in seconds. Stripe doesn't offer this.",
        },
        {
          title: "🧠 Smart timing, not fixed schedules",
          description:
            "Stripe retries at fixed intervals regardless of context. RecoverKit uses AI to retry at the optimal time — factoring in day of week, time of day, and payment patterns to maximize success rates.",
        },
      ]}
      competitorWeaknesses={[
        "Stripe's retry schedule is fixed at 1, 3, 5, and 7 days after failure — no optimization for the best time to retry.",
        "No dunning email sequences. Stripe sends at most one generic notification that most customers miss.",
        "No payment update pages. Customers have to navigate to your billing settings to fix their card.",
        "No recovery analytics beyond basic failed payment events in the Stripe Dashboard.",
        "No customization. You can't adjust retry timing, email content, or recovery flow.",
        "Stripe marks subscriptions as unpaid or cancels them after a few retries — with no customer outreach in between.",
      ]}
      faqs={[
        {
          question: "Does RecoverKit replace Stripe's built-in retry?",
          answer:
            "RecoverKit works alongside Stripe's retry system, adding AI-powered dunning emails, smart retry timing, and payment update pages on top. You can configure Stripe's built-in retries or let RecoverKit handle the full recovery flow for maximum effectiveness.",
        },
        {
          question: "Why isn't Stripe's built-in dunning enough?",
          answer:
            "Stripe's retry uses a fixed schedule (typically 1, 3, 5, 7 days) with no optimization. It doesn't send dunning email sequences to customers, doesn't offer payment update pages, and recovers only about 30% of failed payments. Most failed payments need customer action (updating their card), which Stripe's retry alone can't facilitate.",
        },
        {
          question: "Is it worth paying for RecoverKit when Stripe's retry is free?",
          answer:
            "Absolutely. If your SaaS has $10K MRR, you're likely losing ~$900/month to failed payments. Stripe recovers ~$270 of that. RecoverKit recovers ~$594 — that's $324/month more in recovered revenue for a $29/month tool. RecoverKit pays for itself after recovering just one failed payment.",
        },
      ]}
    />
  );
}
