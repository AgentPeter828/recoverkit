"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DEMO_COMPANIES, type DemoCompany } from "./companies";

const JOURNEY_STEPS = [
  { id: "discovery", label: "1. Discovery", icon: "🔍" },
  { id: "signup", label: "2. Signup", icon: "📝" },
  { id: "setup", label: "3. Setup", icon: "⚙️" },
  { id: "emails", label: "4. Emails", icon: "📧" },
  { id: "recovery", label: "5. Recovery", icon: "💰" },
  { id: "customer", label: "6. Customer View", icon: "👤" },
];

const STEP_LABELS = ["Friendly reminder", "Follow up", "Escalation", "Urgent", "Final notice"];

export default function DemoPage() {
  const [companyId, setCompanyId] = useState(DEMO_COMPANIES[0].id);
  const [activeStep, setActiveStep] = useState("discovery");

  const co = DEMO_COMPANIES.find((c) => c.id === companyId) || DEMO_COMPANIES[0];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">See RecoverKit in Action</h1>
        <p className="mt-2 text-lg" style={{ color: "var(--color-text-secondary)" }}>
          Follow a real business as they set up RecoverKit and recover their first failed payment.
        </p>
      </div>

      {/* Industry selector */}
      <div className="flex flex-col items-center gap-2 mb-8">
        <label className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
          Choose an industry to see a tailored demo:
        </label>
        <div className="flex flex-wrap gap-2 justify-center">
          {DEMO_COMPANIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setCompanyId(c.id)}
              className="text-sm px-4 py-2 rounded-lg border transition-all"
              style={{
                borderColor: companyId === c.id ? co.brandColor : "var(--color-border)",
                background: companyId === c.id ? co.brandColor + "10" : "transparent",
                color: companyId === c.id ? co.brandColor : "var(--color-text-secondary)",
                fontWeight: companyId === c.id ? 600 : 400,
              }}
            >
              {c.icon} {c.industry}
            </button>
          ))}
        </div>
      </div>

      {/* Company pill */}
      <div className="flex items-center justify-center gap-3 mb-8 p-3 rounded-xl" style={{ background: co.brandColor + "08" }}>
        <span className="text-2xl">{co.icon}</span>
        <div>
          <p className="font-semibold" style={{ color: co.brandColor }}>{co.name}</p>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            {co.tagline} · {co.plans.map((p) => `$${p.price}`).join(" / ")} USD/mo
          </p>
        </div>
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
        {activeStep === "discovery" && <DiscoveryStep co={co} />}
        {activeStep === "signup" && <SignupStep co={co} />}
        {activeStep === "setup" && <SetupStep co={co} />}
        {activeStep === "emails" && <EmailsStep co={co} />}
        {activeStep === "recovery" && <RecoveryStep co={co} />}
        {activeStep === "customer" && <CustomerViewStep co={co} />}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Ready to try it with your own business?
        </p>
        <Link href="/auth/signup">
          <Button variant="primary" size="lg">Start Trial — $5</Button>
        </Link>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════ */

function StepCard({ co, icon, title, subtitle, children }: {
  co: DemoCompany; icon: string; title: string; subtitle: string; children: React.ReactNode;
}) {
  return (
    <Card className="p-8">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ background: co.brandColor + "15" }}>
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </Card>
  );
}

/* ─── Step 1 ─── */
function DiscoveryStep({ co }: { co: DemoCompany }) {
  return (
    <StepCard co={co} icon="🔍" title={`${co.founderName} runs ${co.name}`} subtitle={`${co.tagline} — ${co.plans.length} plans from $${co.plans[0].price} to $${co.plans[co.plans.length - 1].price}/mo`}>
      <div className="space-y-4 text-sm" style={{ color: "var(--color-text-secondary)" }}>
        <div className="p-4 rounded-lg" style={{ background: "#fef2f2" }}>
          <p className="font-semibold text-red-800 mb-2">😰 The problem</p>
          <p className="text-red-700">{co.discoveryProblem}</p>
        </div>
        <div className="p-4 rounded-lg" style={{ background: "#f0fdf4" }}>
          <p className="font-semibold text-green-800 mb-2">💡 {co.founderName.split(" ")[0]} finds RecoverKit</p>
          <p className="text-green-700">{co.discoveryFind}</p>
        </div>
      </div>
    </StepCard>
  );
}

/* ─── Step 2 ─── */
function SignupStep({ co }: { co: DemoCompany }) {
  return (
    <StepCard co={co} icon="📝" title={`${co.founderName.split(" ")[0]} signs up`} subtitle="Account created in under a minute">
      <div className="max-w-sm mx-auto">
        <div className="rounded-xl border p-6" style={{ borderColor: "var(--color-border)" }}>
          <h3 className="text-center font-semibold mb-4">Create your account</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium block mb-1">Email</label>
              <div className="rounded-lg border px-3 py-2 text-sm" style={{ background: "var(--color-bg-secondary)", borderColor: "var(--color-border)" }}>
                {co.founderEmail}
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
          <p className="text-xs text-center mt-3" style={{ color: "var(--color-text-secondary)" }}>14-day trial for $5</p>
        </div>
      </div>
    </StepCard>
  );
}

/* ─── Step 3 ─── */
function SetupStep({ co }: { co: DemoCompany }) {
  return (
    <StepCard co={co} icon="⚙️" title="3-step setup checklist" subtitle={`${co.founderName.split(" ")[0]} sees exactly what to do — no guessing`}>
      <div className="space-y-3 max-w-lg mx-auto">
        {[
          { num: 1, title: "Connect Stripe", done: true, result: `Connected: ${co.name}`, desc: "One-click OAuth — RecoverKit starts monitoring failed payments instantly" },
          { num: 2, title: "Review email sequence", done: true, result: "5 emails configured (Friendly tone)", desc: "5 emails already created — just pick your tone and confirm" },
          { num: 3, title: "Verify email domain", done: false, result: "", desc: `So emails come from ${co.billingEmail} instead of noreply@mail.recoverkit.dev` },
        ].map((step) => (
          <div
            key={step.num}
            className="flex items-start gap-3 p-4 rounded-lg"
            style={{ background: step.done ? "color-mix(in srgb, #22c55e 6%, transparent)" : `${co.brandColor}10` }}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style={{ background: step.done ? "#22c55e" : co.brandColor }}>
              {step.done ? "✓" : step.num}
            </div>
            <div>
              <p className={`text-sm font-semibold ${step.done ? "line-through opacity-60" : ""}`}>{step.title}</p>
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
        ⚠️ {co.founderName.split(" ")[0]} skipped email domain verification for now — emails will still send, just from noreply@mail.recoverkit.dev instead of {co.billingEmail}.
      </div>
    </StepCard>
  );
}

/* ─── Step 4 ─── */
function EmailsStep({ co }: { co: DemoCompany }) {
  const [expanded, setExpanded] = useState<number | null>(1);

  return (
    <StepCard co={co} icon="📧" title={`${co.name}'s dunning emails`} subtitle={`Auto-created in "Friendly" tone. Click to preview each.`}>
      <div className="space-y-2">
        {co.emails.map((email) => {
          const isExpanded = expanded === email.step;
          const delayLabel = email.delayHours < 24 ? `${email.delayHours}h after failure` : `Day ${Math.round(email.delayHours / 24)}`;
          return (
            <div key={email.step} className="rounded-lg border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
              <button
                className="w-full p-3 flex items-center gap-3 text-left hover:bg-black/[0.02] transition-colors"
                onClick={() => setExpanded(isExpanded ? null : email.step)}
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white" style={{ background: co.brandColor }}>
                  {email.step}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    <span className="px-1.5 py-0.5 rounded" style={{ background: "var(--color-bg-secondary)" }}>{delayLabel}</span>
                    <span>{STEP_LABELS[email.step - 1]}</span>
                  </div>
                  <p className="text-sm font-medium mt-0.5 truncate">{email.subject}</p>
                </div>
                <svg className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 border-t" style={{ borderColor: "var(--color-border)" }}>
                  <pre className="mt-3 p-4 rounded-lg text-sm whitespace-pre-wrap" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)", fontFamily: "inherit" }}>
                    {email.body}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-xs mt-4 text-center" style={{ color: "var(--color-text-secondary)" }}>
        Each email includes a button linking to {co.name}&apos;s branded payment update page
      </p>
    </StepCard>
  );
}

/* ─── Step 5 ─── */
function RecoveryStep({ co }: { co: DemoCompany }) {
  const recovered = co.campaigns.filter((c) => c.status === "recovered");
  const active = co.campaigns.filter((c) => c.status === "active");
  const roiWeeks = Math.ceil((79 / co.stats.recovered) * 6); // rough weeks to ROI at $79 AUD/mo

  return (
    <StepCard co={co} icon="💰" title="Recovery dashboard" subtitle={`After 6 weeks, here's what ${co.founderName.split(" ")[0]}'s dashboard looks like`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Revenue Recovered", value: `$${co.stats.recovered.toLocaleString()}`, color: "#22c55e" },
          { label: "Recovery Rate", value: `${co.stats.rate}%`, color: co.brandColor },
          { label: "Active Campaigns", value: co.stats.active.toString(), color: "#f59e0b" },
          { label: "Emails Sent", value: co.stats.emailsSent.toString(), color: "var(--color-text-secondary)" },
        ].map((stat) => (
          <div key={stat.label} className="rounded-lg border p-4 text-center" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <h3 className="font-semibold text-sm mb-2">Recent campaigns</h3>
      <div className="space-y-2">
        {[...recovered, ...active].map((camp, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: "var(--color-bg-secondary)" }}>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${camp.status === "recovered" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
              {camp.status === "recovered" ? "✅ Recovered" : "🔄 Active"}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{camp.name}</p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{camp.email}</p>
            </div>
            <p className="text-sm font-semibold">${camp.amount}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ background: "#f0fdf4", color: "#065f46" }}>
        💰 At $79 AUD/mo, RecoverKit paid for itself in <strong>{roiWeeks <= 1 ? "the first week" : `${roiWeeks} weeks`}</strong> by recovering a single ${co.campaigns.find((c) => c.status === "recovered")?.amount || co.plans[co.plans.length - 1].price} {co.plans[co.plans.length - 1].name} plan payment.
      </div>
    </StepCard>
  );
}

/* ─── Step 6 ─── */
function CustomerViewStep({ co }: { co: DemoCompany }) {
  const firstActive = co.campaigns.find((c) => c.status === "active") || co.campaigns[0];
  const firstEmail = co.emails[0];

  return (
    <StepCard co={co} icon="👤" title={`What ${firstActive.name.split(" ")[0]} (the customer) sees`} subtitle={`${firstActive.name} has their $${firstActive.amount}/mo ${co.name} subscription fail`}>
      {/* Email preview */}
      <div className="mb-6">
        <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
          📩 Email {firstActive.name.split(" ")[0]} receives ({firstEmail.delayHours} hours after failure):
        </p>
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
          <div className="p-3 text-xs flex items-center gap-2" style={{ background: "var(--color-bg-secondary)" }}>
            <span className="font-semibold">From:</span>
            <span>{co.name} &lt;{co.billingEmail}&gt;</span>
          </div>
          <div className="p-3 text-xs border-t flex items-center gap-2" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-secondary)" }}>
            <span className="font-semibold">Subject:</span>
            <span>{firstEmail.subject}</span>
          </div>
          <div className="p-6 text-sm space-y-3" style={{ color: "var(--color-text-secondary)" }}>
            {firstEmail.body.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <div className="pt-2">
              <div className="inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white" style={{ background: co.brandColor }}>
                Update Payment Method →
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment page preview */}
      <p className="text-xs font-semibold mb-2" style={{ color: "var(--color-text-secondary)" }}>
        💳 Payment update page {firstActive.name.split(" ")[0]} lands on:
      </p>
      <div className="rounded-xl overflow-hidden" style={{ background: "#f9fafb" }}>
        <div className="p-8">
          <div className="max-w-sm mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: co.brandColor + "20" }}>
              <span className="text-2xl">💳</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Update Your Payment Method</h3>
            <p className="text-sm text-gray-500 mt-2">{co.paymentPageMessage}</p>
            <div className="mt-6 space-y-3 text-left">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Card number</label>
                <div className="rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-400 bg-gray-50">4242 •••• •••• ••••</div>
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
              <div className="rounded-lg px-4 py-3 text-center text-sm font-semibold text-white" style={{ background: co.brandColor }}>
                Update Payment Method
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-4">Secured by Stripe. Your payment information is encrypted and never stored on our servers.</p>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Powered by <strong>RecoverKit</strong></p>
        </div>
      </div>

      <div className="mt-4 p-3 rounded-lg text-sm text-center" style={{ background: "#f0fdf4", color: "#065f46" }}>
        ✅ {firstActive.name.split(" ")[0]} updates their card in 30 seconds. Their ${firstActive.amount}/mo payment goes through. {co.name} keeps the customer. RecoverKit made that happen automatically.
      </div>
    </StepCard>
  );
}
