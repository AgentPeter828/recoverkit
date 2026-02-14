import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "How to Switch to RecoverKit — Migration Guide | RecoverKit",
  description:
    "Switch from Churnkey, Baremetrics, or any dunning tool to RecoverKit in under 5 minutes. Step-by-step migration guide with zero downtime.",
  openGraph: {
    title: "Switch to RecoverKit in Under 5 Minutes",
    description: "Step-by-step guide to migrating from any payment recovery tool to RecoverKit.",
  },
};

const steps = [
  {
    step: "1",
    title: "Sign up for RecoverKit",
    description: "Create your free account at recoverkit.dev. No credit card required. Takes 30 seconds.",
    time: "30 seconds",
  },
  {
    step: "2",
    title: "Connect your Stripe account",
    description: "Click 'Connect Stripe' and authorize via Stripe's secure OAuth flow. RecoverKit will immediately start monitoring for failed payments.",
    time: "1 minute",
  },
  {
    step: "3",
    title: "Set up your email sequences",
    description: "Use our AI to generate a complete dunning email sequence, or customize from our proven templates. Set your preferred schedule and branding.",
    time: "2-3 minutes",
  },
  {
    step: "4",
    title: "Run both tools in parallel (optional)",
    description: "Keep your existing tool active for 1-2 weeks while RecoverKit ramps up. Compare recovery rates side by side. Most founders see comparable or better results within the first week.",
    time: "1-2 weeks (optional)",
  },
  {
    step: "5",
    title: "Cancel your old tool",
    description: "Once you're confident in RecoverKit's performance, cancel your previous tool. You're done — and saving money immediately.",
    time: "2 minutes",
  },
];

const migrations = [
  {
    from: "Churnkey",
    notes: [
      "No data migration needed — RecoverKit connects directly to Stripe",
      "Your existing dunning sequences don't transfer, but AI can recreate them in minutes",
      "Cancel after your current billing cycle ends to avoid overlap charges",
      "If you're on an annual contract, check cancellation terms first",
    ],
    savings: "$3,252 - $5,652+/year",
    link: "/alternatives/churnkey",
  },
  {
    from: "Baremetrics Recover",
    notes: [
      "Baremetrics analytics and Recover are separate — you can keep analytics if needed",
      "No data export/import required since RecoverKit reads from Stripe directly",
      "Recovery caps are eliminated — RecoverKit doesn't limit your recoveries",
      "Cancel Recover add-on while keeping Baremetrics analytics if desired",
    ],
    savings: "$348 - $948+/year",
    link: "/alternatives/baremetrics",
  },
  {
    from: "Gravy Solutions",
    notes: [
      "Notify Gravy you're switching — check your contract for notice period",
      "RecoverKit is fully automated, so there's no transition of human agents",
      "You'll immediately start keeping 100% of recovered revenue instead of paying a revenue share",
      "Expect slightly different recovery dynamics (automated vs human-powered)",
    ],
    savings: "Varies — typically $500-5,000+/year",
    link: "/alternatives/gravy",
  },
  {
    from: "Stripe Built-In Retry",
    notes: [
      "This isn't a migration — it's an upgrade. RecoverKit adds on top of Stripe's retry",
      "No configuration changes needed on your Stripe account",
      "RecoverKit will add dunning emails, smart timing, and payment pages that Stripe doesn't provide",
      "Expect your recovery rate to roughly double (from ~30% to ~66%)",
    ],
    savings: "Not applicable (additive)",
    link: "/alternatives/stripe-dunning",
  },
];

export default function SwitchingGuidePage() {
  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ background: "var(--color-brand)", color: "#fff" }}
            >
              Migration Guide
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Switch to RecoverKit in under 5 minutes
            </h1>
            <p
              className="mt-6 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No data migration. No complex setup. No downtime. Just connect
              Stripe, set up your emails, and start saving money.
            </p>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center">
              5 Steps to Switch
            </h2>
            <div className="space-y-6">
              {steps.map((step) => (
                <Card key={step.step} className="p-6 flex gap-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                    style={{ background: "var(--color-brand)" }}
                  >
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold">{step.title}</h3>
                      <span
                        className="text-xs"
                        style={{ color: "var(--color-text-tertiary)" }}
                      >
                        {step.time}
                      </span>
                    </div>
                    <p
                      className="text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {step.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tool-specific guides */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Switching From Your Current Tool
            </h2>
            <div className="space-y-6">
              {migrations.map((migration) => (
                <Card key={migration.from} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Switching from {migration.from}
                    </h3>
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: "var(--color-brand)",
                        color: "#fff",
                      }}
                    >
                      Save {migration.savings}
                    </span>
                  </div>
                  <ul className="space-y-2 mb-4">
                    {migration.notes.map((note) => (
                      <li
                        key={note}
                        className="text-sm flex items-start gap-2"
                      >
                        <span style={{ color: "var(--color-brand)" }}>✓</span>
                        <span style={{ color: "var(--color-text-secondary)" }}>
                          {note}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link href={migration.link}>
                    <Button variant="outline" size="sm">
                      Full Comparison →
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold mb-8 text-center">
              Common Questions About Switching
            </h2>
            <div className="space-y-4">
              {[
                {
                  q: "Will I lose any data during the switch?",
                  a: "No. RecoverKit connects directly to your Stripe account and reads payment data from Stripe. There's nothing to migrate or export from your old tool.",
                },
                {
                  q: "Can I run both tools at the same time?",
                  a: "Yes — we recommend running both tools in parallel for 1-2 weeks during your transition. Just be mindful that both tools may send dunning emails, so you may want to disable emails on your old tool during the overlap period.",
                },
                {
                  q: "What if RecoverKit doesn't work as well?",
                  a: "RecoverKit has a free tier — try it with no financial risk. If it's not right for you, simply disconnect Stripe and continue with your current tool. No contracts, no commitments.",
                },
                {
                  q: "Do I need to change anything in my Stripe configuration?",
                  a: "No. RecoverKit connects via Stripe OAuth and works alongside your existing Stripe settings. You don't need to modify webhooks, retry settings, or any other Stripe configuration.",
                },
              ].map((faq) => (
                <Card key={faq.q} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p
                    className="text-sm"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        className="py-20"
        style={{ background: "var(--color-bg-secondary)" }}
      >
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Ready to switch?</h2>
            <p
              className="mt-4 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Start free. Set up in 5 minutes. No credit card required.
            </p>
            <div className="mt-8">
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
