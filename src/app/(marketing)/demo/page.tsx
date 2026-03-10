"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockDunningEmails, mockCampaigns, mockRecoveryStats, DEMO_COMPANY } from "@/lib/mock/data";

const JOURNEY_STEPS = [
  { id: "discovery", label: "1. Discovery", icon: "🔍" },
  { id: "signup", label: "2. Signup", icon: "📝" },
  { id: "setup", label: "3. Setup", icon: "⚙️" },
  { id: "emails", label: "4. Emails", icon: "📧" },
  { id: "recovery", label: "5. Recovery", icon: "💰" },
  { id: "customer", label: "6. Customer View", icon: "👤" },
];

export default function DemoPage() {
  const [activeStep, setActiveStep] = useState("discovery");

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">See RecoverKit in Action</h1>
        <p className="mt-2 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Follow <strong>{DEMO_COMPANY.name}</strong> — a SaaS monitoring tool — as they set up
          RecoverKit and recover their first failed payment.
        </p>
      </div>

      {/* Step nav */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {JOURNEY_STEPS.map((step) => (
          <button
            key={step.id}
            onClick={() => setActiveStep(step.id)}
            className="text-sm px-4 py-2 rounded-lg border transition-all"
            style={{
              borderColor: activeStep === step.id ? "var(--color-brand)" : "var(--color-border)",
              background: activeStep === step.id ? "color-mix(in srgb, var(--color-brand) 8%, transparent)" : "transparent",
              color: activeStep === step.id ? "var(--color-brand)" : "var(--color-text-secondary)",
              fontWeight: activeStep === step.id ? 600 : 400,
            }}
          >
            {step.icon} {step.label}
          </button>
        ))}
      </div>

      {/* Step content */}
      <div className="space-y-6">
        {activeStep === "discovery" && <DiscoveryStep />}
        {activeStep === "signup" && <SignupStep />}
        {activeStep === "setup" && <SetupStep />}
        {activeStep === "emails" && <EmailsStep />}
        {activeStep === "recovery" && <RecoveryStep />}
        {activeStep === "customer" && <CustomerViewStep />}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Ready to try it with your own SaaS?
        </p>
        <Link href="/auth/signup">
          <Button variant="primary" size="lg">Start Free — No Credit Card Required</Button>
        </Link>
      </div>
    </div>
  );
}

/* ─── Step 1: Discovery ─── */
function DiscoveryStep() {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          🔍
        </div>
        <div>
          <h2 className="text-xl font-bold">Sarah runs {DEMO_COMPANY.name}</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {DEMO_COMPANY.tagline} — {DEMO_COMPANY.plans.length} plans from ${DEMO_COMPANY.plans[0].price} to ${DEMO_COMPANY.plans[2].price}/mo
          </p>
        </div>
      </div>

      <div className="space-y-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        <div className="p-4 rounded-lg" style={{ background: "#fef2f2" }}>
          <p className="font-semibold text-red-800 mb-2">😰 The problem</p>
          <p className="text-red-700">
            Sarah notices she's losing about $2,700/mo to failed payments. Cards expire, banks flag charges,
            customers don't even know their payment failed. Stripe's built-in retry recovers some, but she's
            still losing 7% of her MRR every month.
          </p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: "#f0fdf4" }}>
          <p className="font-semibold text-green-800 mb-2">💡 She finds RecoverKit</p>
          <p className="text-green-700">
            Sarah searches for "Churnkey alternatives" and finds RecoverKit. At $79 AUD/mo (~$56 USD) for the Growth plan,
            it's a fraction of what Churnkey charges ($250+ USD/mo). She signs up in 2 minutes.
          </p>
        </div>
      </div>
    </Card>
  );
}

/* ─── Step 2: Signup ─── */
function SignupStep() {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          📝
        </div>
        <div>
          <h2 className="text-xl font-bold">Sarah signs up</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>Account created in under a minute</p>
        </div>
      </div>

      <div className="max-w-sm mx-auto">
        <div className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-center font-semibold mb-4">Create your account</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Email</label>
              <div className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}>
                sarah@cloudpulse.io
              </div>
            </div>
            <div>
              <label className="text-xs font-medium block mb-1">Password</label>
              <div className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}>
                ••••••••••••
              </div>
            </div>
            <div className="rounded-lg px-4 py-2.5 text-center text-sm font-semibold text-white" style={{ background: "var(--color-brand)" }}>
              Create Account
            </div>
          </div>
          <p className="text-xs text-center mt-3" style={{ color: "var(--color-text-secondary)" }}>No credit card required</p>
        </div>
      </div>
    </Card>
  );
}

/* ─── Step 3: Setup ─── */
function SetupStep() {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          ⚙️
        </div>
        <div>
          <h2 className="text-xl font-bold">3-step setup checklist</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Sarah sees exactly what to do — no guessing
          </p>
        </div>
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        {[
          {
            num: 1,
            title: "Connect Stripe",
            desc: "One-click OAuth — RecoverKit starts monitoring failed payments instantly",
            done: true,
            result: "Connected: CloudPulse",
          },
          {
            num: 2,
            title: "Review email sequence",
            desc: "5 emails already created — just pick your tone and confirm",
            done: true,
            result: "5 emails configured (Friendly tone)",
          },
          {
            num: 3,
            title: "Verify email domain",
            desc: "So emails come from billing@cloudpulse.io instead of noreply@mail.recoverkit.dev",
            done: false,
            result: "",
          },
        ].map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{
              background: step.done
                ? "color-mix(in srgb, #22c55e 6%, transparent)"
                : "color-mix(in srgb, var(--color-brand) 6%, transparent)",
            }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
              style={{ background: step.done ? "#22c55e" : "var(--color-brand)" }}
            >
              {step.done ? "✓" : step.num}
            </div>
            <div>
              <p className={`text-sm font-semibold ${step.done ? "line-through opacity-60" : ""}`}>
                {step.title}
              </p>
              {step.done ? (
                <p className="text-xs" style={{ color: "#16a34a" }}>✅ {step.result}</p>
              ) : (
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{step.desc}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ background: "#fef3c7", color: "#92400e" }}>
        ⚠️ Sarah skipped email domain verification for now — her emails will still send, just from noreply@mail.recoverkit.dev instead of her own domain.
      </div>
    </Card>
  );
}

/* ─── Step 4: Emails ─── */
function EmailsStep() {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          📧
        </div>
        <div>
          <h2 className="text-xl font-bold">Her dunning emails</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            These were auto-created. Sarah chose "Friendly" tone. Click to preview each.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {mockDunningEmails.map((email) => {
          const isExpanded = expanded === email.step_number;
          const delayLabel = email.delay_hours < 24
            ? `${email.delay_hours}h after failure`
            : `Day ${Math.round(email.delay_hours / 24)}`;
          const stepLabels = ["Friendly reminder", "Follow up", "Escalation", "Urgent", "Final notice"];

          return (
            <div key={email.id} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <button
                className="w-full p-3 flex items-center gap-3 text-left hover:bg-black/[0.02] transition-colors"
                onClick={() => setExpanded(isExpanded ? null : email.step_number)}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: "var(--color-brand)" }}>
                  {email.step_number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="px-1.5 py-0.5 rounded" style={{ background: "var(--color-bg-secondary)" }}>{delayLabel}</span>
                    <span>{stepLabels[email.step_number - 1]}</span>
                  </div>
                  <p className="text-sm font-medium mt-0.5 truncate">{email.subject}</p>
                </div>
                <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <div className="mt-3 p-4 rounded-lg text-sm whitespace-pre-wrap" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}>
                    {email.body_text}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs mt-4 text-center" style={{ color: "var(--color-text-secondary)" }}>
        Each email includes a button linking to CloudPulse's branded payment update page
      </p>
    </Card>
  );
}

/* ─── Step 5: Recovery in Action ─── */
function RecoveryStep() {
  const stats = mockRecoveryStats;
  const activeCampaigns = mockCampaigns.filter((c) => c.status === "active");
  const recoveredCampaigns = mockCampaigns.filter((c) => c.status === "recovered");

  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          💰
        </div>
        <div>
          <h2 className="text-xl font-bold">Recovery dashboard</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            After 6 weeks, here's what Sarah's dashboard looks like
          </p>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Revenue Recovered", value: `$${(stats.recovered_revenue_cents / 100).toLocaleString()}`, color: "#22c55e" },
          { label: "Recovery Rate", value: `${stats.success_rate}%`, color: "var(--color-brand)" },
          { label: "Active Campaigns", value: stats.active_campaigns.toString(), color: "#f59e0b" },
          { label: "Emails Sent", value: stats.emails_sent.toString(), color: "var(--color-text-secondary)" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Campaign examples */}
      <h3 className="font-semibold text-sm mb-2">Recent campaigns</h3>
      <div className="space-y-2">
        {[...recoveredCampaigns.slice(0, 2), ...activeCampaigns.slice(0, 2)].map((camp) => (
          <div key={camp.id} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--color-bg-secondary)" }}>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              camp.status === "recovered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
            }`}>
              {camp.status === "recovered" ? "✅ Recovered" : "🔄 Active"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{camp.customer_name}</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{camp.customer_email}</p>
            </div>
            <p className="text-sm font-semibold">${(camp.amount_due / 100).toFixed(0)}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ background: "#f0fdf4", color: "#065f46" }}>
        💰 At $79 AUD/mo, RecoverKit paid for itself in <strong>the first week</strong> by recovering a single $249 Business plan payment.
      </div>
    </Card>
  );
}

/* ─── Step 6: What the Customer Sees ─── */
function CustomerViewStep() {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: DEMO_COMPANY.brandColor + "15" }}>
          👤
        </div>
        <div>
          <h2 className="text-xl font-bold">What James (the customer) sees</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            James Rivera from NorthStar Ops has his $99/mo CloudPulse Team plan fail
          </p>
        </div>
      </div>

      {/* Email preview */}
      <div className="mb-6">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
          📩 Email James receives (4 hours after failure):
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <div className="p-3 text-xs flex items-center gap-2" style={{ background: "var(--color-bg-secondary)" }}>
            <span className="font-semibold">From:</span>
            <span>CloudPulse &lt;billing@cloudpulse.io&gt;</span>
          </div>
          <div className="p-3 text-xs border-t flex items-center gap-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
            <span className="font-semibold">Subject:</span>
            <span>Quick heads up about your CloudPulse payment</span>
          </div>
          <div className="p-6 text-sm space-y-3" style={{ color: "var(--color-text-secondary)" }}>
            <p>Hi there,</p>
            <p>
              We just tried to process your CloudPulse subscription payment, but it didn't go through.
              This usually happens when a card expires or your bank flags an unusual charge.
            </p>
            <p>
              The good news: it takes less than a minute to fix. Just click the button below to update
              your payment details and you'll be all set.
            </p>
            <p>
              Your monitoring dashboards and alerts are still active, so nothing to worry about right now.
            </p>
            <div className="pt-2">
              <div
                className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white"
                style={{ background: DEMO_COMPANY.brandColor }}
              >
                Update Payment Method →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment update page preview */}
      <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
        💳 Payment update page James lands on:
      </p>
      <div className="rounded-xl overflow-hidden" style={{ background: "#f9fafb" }}>
        <div className="p-8">
          <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: DEMO_COMPANY.brandColor + "20" }}>
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Update Your Payment Method</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your recent CloudPulse payment didn't go through. Please update your card details below to keep your monitoring active. It only takes a moment.
            </p>
            <div className="mt-6 space-y-3 text-left">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Card number</label>
                <div className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-400 bg-gray-50">
                  4242 •••• •••• ••••
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Expiry</label>
                  <div className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-400 bg-gray-50">MM/YY</div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">CVC</label>
                  <div className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-400 bg-gray-50">•••</div>
                </div>
              </div>
              <div className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-white" style={{ background: DEMO_COMPANY.brandColor }}>
                Update Payment Method
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Secured by Stripe. Your payment information is encrypted and never stored on our servers.
            </p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Powered by <strong>RecoverKit</strong></p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ background: "#f0fdf4", color: "#065f46" }}>
        ✅ James updates his card in 30 seconds. His $99/mo payment goes through. CloudPulse keeps the customer. RecoverKit made that happen automatically.
      </div>
    </Card>
  );
}
