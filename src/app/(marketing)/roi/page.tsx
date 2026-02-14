"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const competitors = [
  { name: "None (no tool)", monthlyCost: 0 },
  { name: "Stripe Built-In (free)", monthlyCost: 0 },
  { name: "Churnkey ($300/mo)", monthlyCost: 300 },
  { name: "Churnkey ($500/mo)", monthlyCost: 500 },
  { name: "Baremetrics Recover ($58/mo)", monthlyCost: 58 },
  { name: "Baremetrics Recover ($108/mo)", monthlyCost: 108 },
  { name: "Gravy (15% revenue share)", monthlyCost: -1 },
  { name: "Stunning ($100/mo)", monthlyCost: 100 },
];

const RECOVERKIT_MONTHLY = 29;
const RECOVERKIT_RECOVERY_RATE = 0.66;
const STRIPE_RECOVERY_RATE = 0.3;
const NO_TOOL_RECOVERY_RATE = 0.15;
const COMPETITOR_RECOVERY_RATE = 0.6;
const GRAVY_REVENUE_SHARE = 0.15;

export default function ROICalculatorPage() {
  const [mrr, setMrr] = useState(10000);
  const [churnRate, setChurnRate] = useState(9);
  const [currentToolIndex, setCurrentToolIndex] = useState(0);

  const monthlyLost = mrr * (churnRate / 100);
  const currentTool = competitors[currentToolIndex];

  let currentRecoveryRate: number;
  if (currentToolIndex === 0) currentRecoveryRate = NO_TOOL_RECOVERY_RATE;
  else if (currentToolIndex === 1) currentRecoveryRate = STRIPE_RECOVERY_RATE;
  else currentRecoveryRate = COMPETITOR_RECOVERY_RATE;

  const currentRecovered = monthlyLost * currentRecoveryRate;
  const recoverKitRecovered = monthlyLost * RECOVERKIT_RECOVERY_RATE;
  const additionalRecovery = recoverKitRecovered - currentRecovered;

  let currentToolCost = currentTool.monthlyCost;
  if (currentTool.monthlyCost === -1) {
    // Gravy: 15% of recovered revenue
    currentToolCost = currentRecovered * GRAVY_REVENUE_SHARE;
  }

  const monthlySavingsOnTool = currentToolCost - RECOVERKIT_MONTHLY;
  const totalMonthlyBenefit = additionalRecovery + Math.max(0, monthlySavingsOnTool);
  const annualBenefit = totalMonthlyBenefit * 12;
  const roi = RECOVERKIT_MONTHLY > 0 ? ((recoverKitRecovered - RECOVERKIT_MONTHLY) / RECOVERKIT_MONTHLY) * 100 : 0;

  const fmt = (n: number) =>
    "$" + Math.round(n).toLocaleString("en-US");

  return (
    <div>
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div
              className="inline-block text-sm font-semibold px-4 py-1.5 rounded-full mb-6"
              style={{ background: "var(--color-brand)", color: "#fff" }}
            >
              ROI Calculator
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              How much revenue are you losing to failed payments?
            </h1>
            <p
              className="mt-6 text-lg"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Enter your numbers below to see how much RecoverKit could save you
              — and how fast it pays for itself.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-[var(--max-width)] px-6 lg:px-8">
          <div className="mx-auto max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Inputs */}
            <Card className="p-8">
              <h2 className="text-xl font-semibold mb-6">Your Numbers</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Monthly Recurring Revenue (MRR)
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold" style={{ color: "var(--color-brand)" }}>
                      {fmt(mrr)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1000}
                    max={500000}
                    step={1000}
                    value={mrr}
                    onChange={(e) => setMrr(Number(e.target.value))}
                    className="w-full mt-2 accent-[var(--color-brand)]"
                  />
                  <div
                    className="flex justify-between text-xs mt-1"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    <span>$1K</span>
                    <span>$500K</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Estimated Failed Payment Rate
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold" style={{ color: "var(--color-brand)" }}>
                      {churnRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={20}
                    step={0.5}
                    value={churnRate}
                    onChange={(e) => setChurnRate(Number(e.target.value))}
                    className="w-full mt-2 accent-[var(--color-brand)]"
                  />
                  <div
                    className="flex justify-between text-xs mt-1"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    <span>1%</span>
                    <span>20%</span>
                  </div>
                  <p
                    className="text-xs mt-1"
                    style={{ color: "var(--color-text-tertiary)" }}
                  >
                    Industry average: 9% of MRR lost to failed payments
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Current Recovery Tool
                  </label>
                  <select
                    value={currentToolIndex}
                    onChange={(e) => setCurrentToolIndex(Number(e.target.value))}
                    className="w-full rounded-lg border px-3 py-2 text-sm"
                    style={{
                      background: "var(--color-bg)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    {competitors.map((comp, i) => (
                      <option key={comp.name} value={i}>
                        {comp.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </Card>

            {/* Results */}
            <div className="space-y-6">
              <Card
                className="p-8"
                style={{ background: "#fef2f2", borderColor: "#fecaca" }}
              >
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  💸 Revenue You&apos;re Losing
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Monthly revenue at risk</span>
                    <span className="font-bold text-red-800">{fmt(monthlyLost)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-red-700">Annual revenue at risk</span>
                    <span className="font-bold text-red-800">{fmt(monthlyLost * 12)}/yr</span>
                  </div>
                  {currentToolCost > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-red-700">Current tool cost</span>
                      <span className="font-bold text-red-800">{fmt(currentToolCost)}/mo</span>
                    </div>
                  )}
                </div>
              </Card>

              <Card
                className="p-8"
                style={{ background: "#f0fdf4", borderColor: "#bbf7d0" }}
              >
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  ✅ With RecoverKit
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">Revenue recovered/mo</span>
                    <span className="font-bold text-green-800">{fmt(recoverKitRecovered)}/mo</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">RecoverKit cost</span>
                    <span className="font-bold text-green-800">{fmt(RECOVERKIT_MONTHLY)}/mo</span>
                  </div>
                  {additionalRecovery > 0 && (
                    <div className="flex justify-between">
                      <span className="text-sm text-green-700">Additional recovery vs current</span>
                      <span className="font-bold text-green-800">+{fmt(additionalRecovery)}/mo</span>
                    </div>
                  )}
                  <div
                    className="flex justify-between pt-3 border-t"
                    style={{ borderColor: "#bbf7d0" }}
                  >
                    <span className="text-sm font-semibold text-green-800">Total annual benefit</span>
                    <span className="text-xl font-bold text-green-800">{fmt(annualBenefit)}/yr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-green-700">ROI</span>
                    <span className="font-bold text-green-800">{Math.round(roi)}x return</span>
                  </div>
                </div>
              </Card>

              <Card
                className="p-6 text-center"
                style={{ borderColor: "var(--color-brand)" }}
              >
                <p className="text-lg font-semibold mb-2">
                  💡 RecoverKit pays for itself after recovering just{" "}
                  <span style={{ color: "var(--color-brand)" }}>1 failed payment</span>
                </p>
                <p
                  className="text-sm mb-4"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  At $29/mo, you only need to recover one $29+ subscription payment to
                  break even. Everything else is pure profit.
                </p>
                <Link href="/auth/signup">
                  <Button variant="primary" size="lg">
                    Start Recovering Revenue Free →
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
