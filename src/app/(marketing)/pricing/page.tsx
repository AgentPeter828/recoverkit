import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { plans } from "@/lib/stripe/config";

export const metadata: Metadata = {
  title: "Pricing",
};

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Pricing plans for every stage
        </h1>
        <p
          className="mt-4 text-lg"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Start free, then scale as you grow. No hidden fees. Cancel anytime.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={`p-8 flex flex-col ${
              plan.highlighted ? "ring-2 scale-105" : ""
            }`}
            style={
              plan.highlighted
                ? { borderColor: "var(--color-brand)" }
                : undefined
            }
          >
            {plan.highlighted && (
              <span
                className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full mb-4 self-start"
                style={{ background: "var(--color-brand)" }}
              >
                Most Popular
              </span>
            )}
            <h3 className="text-xl font-semibold">{plan.name}</h3>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {plan.description}
            </p>
            <div className="mt-6 flex items-baseline gap-1">
              <span className="text-4xl font-bold">${plan.price}</span>
              <span style={{ color: "var(--color-text-secondary)" }}>
                /month
              </span>
            </div>
            <ul className="mt-8 space-y-3 flex-1">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <span style={{ color: "var(--color-brand)" }}>✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href="/auth/signup" className="block">
                <Button
                  variant={plan.highlighted ? "primary" : "outline"}
                  className="w-full"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
