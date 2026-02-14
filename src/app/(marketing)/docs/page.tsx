import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Developer Documentation — Stripe Payment Recovery | RecoverKit",
  description:
    "Developer guides for Stripe payment recovery: webhook setup, failed payment events, dunning email sequences, and RecoverKit API quickstart.",
};

const guides = [
  {
    slug: "stripe-webhook-payment-recovery",
    title: "How to Set Up Stripe Webhook for Payment Recovery",
    description: "Step-by-step guide to configuring Stripe webhooks to detect and respond to failed payments in real-time.",
    category: "Setup",
  },
  {
    slug: "stripe-failed-payment-events",
    title: "Stripe Failed Payment Events: Complete Guide",
    description: "Every Stripe webhook event related to failed payments — what they mean, when they fire, and how to handle them.",
    category: "Reference",
  },
  {
    slug: "build-dunning-email-sequence",
    title: "How to Build a Dunning Email Sequence",
    description: "Architecture guide for building automated dunning email sequences that recover revenue from failed subscription payments.",
    category: "Guide",
  },
  {
    slug: "api-quickstart",
    title: "RecoverKit API Quick Start",
    description: "Get started with the RecoverKit API in 5 minutes. Authentication, key endpoints, and code examples.",
    category: "API",
  },
];

export default function DocsPage() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Developer Documentation</h1>
            <p className="mt-6 text-lg" style={{ color: "var(--color-text-secondary)" }}>
              Guides for setting up Stripe payment recovery, handling webhook events, and integrating with the RecoverKit API.
            </p>
          </div>
        </div>
      </section>
      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-6">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/docs/${guide.slug}`} className="block">
                <Card className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--color-brand)", color: "#fff" }}>
                      {guide.category}
                    </span>
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{guide.title}</h2>
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{guide.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
