"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isMockMode } from "@/lib/mock/config";
import { mockDunningSequences, mockDunningEmails } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";

const TONES = [
  { id: "friendly", label: "Friendly", emoji: "🤝", desc: "Casual, reassuring, human", preview: "Hey! Looks like your payment didn't go through. No worries — it happens to everyone. Could you update your card?" },
  { id: "professional", label: "Professional", emoji: "💼", desc: "Clean, business-like", preview: "We noticed your recent payment was unsuccessful. Please update your billing information to continue your service." },
  { id: "direct", label: "Direct", emoji: "⚡", desc: "Short, action-oriented", preview: "Your payment failed. Update your card now to keep your subscription active." },
  { id: "empathetic", label: "Empathetic", emoji: "😊", desc: "Warm, understanding", preview: "We understand things happen! Your last payment didn't go through, and we want to help you sort it out easily." },
  { id: "formal", label: "Formal", emoji: "🏢", desc: "Corporate, polished", preview: "We wish to inform you that your most recent payment was not processed successfully. Kindly review your payment details." },
];

interface DunningEmail {
  id: string;
  step_number: number;
  subject: string;
  body_text: string | null;
  body_html: string;
  delay_hours: number;
}

interface DunningSequence {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  rk_dunning_emails: { count: number }[];
}

function delayLabel(hours: number): string {
  if (hours < 24) return `${hours}h after failure`;
  const days = Math.round(hours / 24);
  return `Day ${days}`;
}

function delayLabelShort(hours: number): string {
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""}`;
  const days = Math.round(hours / 24);
  return `${days} day${days !== 1 ? "s" : ""}`;
}

function stepLabel(step: number): string {
  const labels = ["Friendly reminder", "Follow up", "Escalation", "Urgent notice", "Final notice"];
  return labels[step - 1] || `Step ${step}`;
}

/* ─── Inline SVG Illustrations ─── */

function PaymentFailIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="10" width="28" height="18" rx="4" stroke="#ef4444" strokeWidth="1.5" fill="#fef2f2" />
      <rect x="4" y="15" width="28" height="4" fill="#fca5a5" />
      <path d="M22 25 L26 21 M26 25 L22 21" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailSentIcon({ step }: { step: number }) {
  const colors = ["#6366f1", "#8b5cf6", "#a855f7", "#d946ef", "#ec4899"];
  const color = colors[step - 1] || colors[0];
  const bgColor = color + "15";
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="10" width="24" height="16" rx="3" stroke={color} strokeWidth="1.5" fill={bgColor} />
      <path d="M6 14 L18 22 L30 14" stroke={color} strokeWidth="1.5" fill="none" />
      <circle cx="28" cy="10" r="5" fill={color} />
      <text x="28" y="13" fontSize="7" fill="#fff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">{step}</text>
    </svg>
  );
}

function RecoveredIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="13" stroke="#22c55e" strokeWidth="1.5" fill="#d1fae5" />
      <path d="M12 18 L16 22 L24 14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimelineConnector() {
  return (
    <div
      className="hidden sm:block w-8 h-0.5 shrink-0"
      style={{ background: "var(--color-border)" }}
    />
  );
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<DunningSequence[]>([]);
  const [emails, setEmails] = useState<DunningEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [changingTone, setChangingTone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [showDunningExplainer, setShowDunningExplainer] = useState(false);
  const [hoveredTone, setHoveredTone] = useState<string | null>(null);

  useEffect(() => {
    initSequences();
  }, []);

  async function initSequences() {
    if (isMockMode()) {
      setSequences(mockDunningSequences as DunningSequence[]);
      setEmails(mockDunningEmails as DunningEmail[]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/dunning-sequences");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      const seqs = data.sequences || [];

      if (seqs.length === 0) {
        setSeeding(true);
        const seedRes = await fetch("/api/dunning-sequences/seed-default", { method: "POST" });
        if (seedRes.ok) {
          const res2 = await fetch("/api/dunning-sequences");
          if (res2.ok) {
            const data2 = await res2.json();
            setSequences(data2.sequences || []);
            if (data2.sequences?.[0]?.id) {
              await fetchEmails(data2.sequences[0].id);
            }
          }
        }
        setSeeding(false);
      } else {
        setSequences(seqs);
        const defaultSeq = seqs.find((s: DunningSequence) => s.is_default) || seqs[0];
        if (defaultSeq) {
          await fetchEmails(defaultSeq.id);
        }
      }
    } catch (err) {
      console.error("Failed to init sequences:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchEmails(sequenceId: string) {
    try {
      const res = await fetch(`/api/dunning-sequences/${sequenceId}/emails`);
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch {
      // Silent
    }
  }

  async function handleChangeTone(tone: string) {
    const defaultSeq = sequences.find((s) => s.is_default) || sequences[0];
    if (!defaultSeq) return;

    setChangingTone(true);
    setError(null);

    try {
      const res = await fetch(`/api/dunning-sequences/${defaultSeq.id}/restyle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tone }),
      });

      if (res.ok) {
        await fetchEmails(defaultSeq.id);
        setExpandedStep(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to change tone. Try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setChangingTone(false);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
    setError(null);
    analytics.featureUsed("sequence_created", { name: newName });
    try {
      const res = await fetch("/api/dunning-sequences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewName("");
        setNewDesc("");
        initSequences();
      } else {
        setError("Failed to create sequence. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  const defaultSeq = sequences.find((s) => s.is_default) || sequences[0];
  const sortedEmails = [...emails].sort((a, b) => a.step_number - b.step_number);

  if (loading || seeding) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <h1 className="text-2xl font-bold mb-6">Email Sequences</h1>
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3 animate-pulse">📧</p>
          <p className="font-semibold">{seeding ? "Setting up your emails..." : "Loading..."}</p>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {seeding ? "Creating your 5-step dunning email sequence" : "Loading your email sequences"}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Sequences</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Automatic emails that help you recover failed payments
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
        </div>
      </div>

      {/* ─── VISUAL TIMELINE EXPLAINER ─── */}
      <Card className="p-8 mb-8">
        <h2 className="text-lg font-bold mb-2">When a payment fails, here&apos;s what happens:</h2>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
          RecoverKit automatically sends a series of friendly emails to help your customer fix their payment
        </p>

        {/* Timeline */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-0 mb-6">
          {/* Payment fails */}
          <div className="flex flex-col items-center gap-1.5 text-center" style={{ minWidth: 72 }}>
            <PaymentFailIcon />
            <p className="text-xs font-semibold" style={{ color: "#ef4444" }}>Payment fails</p>
          </div>

          <TimelineConnector />

          {/* Email nodes */}
          {(sortedEmails.length > 0 ? sortedEmails : [
            { step_number: 1, delay_hours: 1 },
            { step_number: 2, delay_hours: 24 },
            { step_number: 3, delay_hours: 72 },
            { step_number: 4, delay_hours: 120 },
            { step_number: 5, delay_hours: 168 },
          ]).map((email, i) => (
            <div key={i} className="contents">
              <div className="flex flex-col items-center gap-1.5 text-center" style={{ minWidth: 72 }}>
                <EmailSentIcon step={email.step_number} />
                <p className="text-xs font-semibold">Email {email.step_number}</p>
                <p className="text-[10px]" style={{ color: "var(--color-text-secondary)" }}>
                  {delayLabelShort(email.delay_hours)}
                </p>
              </div>
              {i < 4 && <TimelineConnector />}
            </div>
          ))}

          <TimelineConnector />

          {/* Recovered */}
          <div className="flex flex-col items-center gap-1.5 text-center" style={{ minWidth: 72 }}>
            <RecoveredIcon />
            <p className="text-xs font-semibold" style={{ color: "#22c55e" }}>Recovered!</p>
          </div>
        </div>

        <div
          className="rounded-lg px-4 py-3 text-sm text-center"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-dark)" }}
        >
          Most customers fix their payment after the first or second email. The later emails are just in case!
        </div>

        {/* What are dunning emails? */}
        <div className="mt-4">
          <button
            onClick={() => setShowDunningExplainer(!showDunningExplainer)}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-brand)" }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" stroke="var(--color-brand-light)" strokeWidth="1.5" fill="var(--color-brand-50)" />
              <text x="9" y="13" fontSize="11" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="700" textAnchor="middle">?</text>
            </svg>
            What are dunning emails?
            <svg
              className={`h-4 w-4 transition-transform ${showDunningExplainer ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDunningExplainer && (
            <div
              className="mt-3 rounded-lg p-4 text-sm"
              style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
            >
              <p className="mb-2">
                <strong>Sometimes when someone buys something online, their credit card doesn&apos;t work.</strong> Maybe the card expired, or there wasn&apos;t enough money on it.
              </p>
              <p className="mb-2">
                &quot;Dunning emails&quot; are friendly reminder emails that say: &quot;Hey, your payment didn&apos;t go through — here&apos;s how to fix it.&quot;
              </p>
              <p>
                This helps you keep your customers and recover money that would otherwise be lost. Most people want to pay — they just need a reminder!
              </p>
            </div>
          )}
        </div>
      </Card>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* ─── EMAIL PREVIEW ─── */}
      {emails.length > 0 && (
        <div className="space-y-3 mb-6">
          <h3 className="font-semibold text-lg">Your email sequence</h3>
          {sortedEmails.map((email) => {
              const isExpanded = expandedStep === email.step_number;
              return (
                <Card key={email.id} className="overflow-hidden">
                  <button
                    className="w-full p-4 flex items-center gap-4 text-left hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedStep(isExpanded ? null : email.step_number)}
                  >
                    {/* Step badge */}
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                      style={{ background: "var(--color-brand)" }}
                    >
                      {email.step_number}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}>
                          {delayLabel(email.delay_hours)}
                        </span>
                        <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          {stepLabel(email.step_number)}
                        </span>
                      </div>
                      <p className="text-sm font-medium mt-1 truncate">{email.subject}</p>
                    </div>

                    <svg
                      className={`h-5 w-5 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      style={{ color: "var(--color-text-secondary)" }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 pt-0">
                      <div className="border-t pt-4" style={{ borderColor: "var(--color-border)" }}>
                        <p className="text-xs font-semibold mb-1" style={{ color: "var(--color-text-secondary)" }}>
                          Subject: {email.subject}
                        </p>
                        <pre
                          className="whitespace-pre-wrap text-sm p-4 rounded-lg mt-2"
                          style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
                        >
                          {email.body_text || "(No plain text version)"}
                        </pre>
                        <div className="mt-3">
                          <Link href={`/dashboard/sequences/${defaultSeq?.id}`}>
                            <Button variant="ghost" size="sm">Edit this email</Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
        </div>
      )}

      {/* ─── TONE SELECTOR ─── */}
      {emails.length > 0 && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-1">Want a different tone?</h3>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Pick a style below and we&apos;ll rewrite all 5 emails to match. Hover to preview.
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => handleChangeTone(tone.id)}
                onMouseEnter={() => setHoveredTone(tone.id)}
                onMouseLeave={() => setHoveredTone(null)}
                disabled={changingTone}
                className="text-sm px-4 py-3 rounded-lg border transition-all hover:border-current disabled:opacity-50"
                style={{
                  borderColor: hoveredTone === tone.id ? "var(--color-brand)" : "var(--color-border)",
                  background: hoveredTone === tone.id ? "var(--color-brand-50)" : "transparent",
                  color: "var(--color-text-secondary)",
                }}
              >
                <span className="block text-lg mb-0.5">{tone.emoji}</span>
                <span className="block font-medium text-xs">{tone.label}</span>
                <span className="block text-[10px] opacity-70">{tone.desc}</span>
              </button>
            ))}
          </div>

          {/* Tone preview */}
          {hoveredTone && (
            <div
              className="rounded-lg p-3 text-xs"
              style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
            >
              <p className="font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                Preview ({TONES.find(t => t.id === hoveredTone)?.label} tone):
              </p>
              <p className="italic">&quot;{TONES.find(t => t.id === hoveredTone)?.preview}&quot;</p>
            </div>
          )}

          {changingTone && (
            <p className="text-sm mt-3 animate-pulse" style={{ color: "var(--color-brand)" }}>
              Regenerating emails in your chosen tone...
            </p>
          )}
        </Card>
      )}

      {/* ─── CONFIRM ─── */}
      {emails.length > 0 && !confirmed && (
        <Card className="p-6 mb-6 text-center" style={{ background: "color-mix(in srgb, var(--color-brand) 4%, transparent)" }}>
          <p className="font-semibold">Happy with these emails?</p>
          <p className="text-sm mt-1 mb-4" style={{ color: "var(--color-text-secondary)" }}>
            You can always edit individual emails later
          </p>
          <div className="flex justify-center gap-3">
            <Button variant="primary" size="sm" onClick={() => setConfirmed(true)}>
              Looks good, activate
            </Button>
            <Link href={`/dashboard/sequences/${defaultSeq?.id}`}>
              <Button variant="outline" size="sm">Edit individually</Button>
            </Link>
          </div>
        </Card>
      )}

      {confirmed && (
        <Card className="p-4 mb-6 text-center" style={{ background: "#d1fae5" }}>
          <div className="flex items-center justify-center gap-2">
            <RecoveredIcon />
            <p className="text-sm font-medium" style={{ color: "#065f46" }}>
              Email sequence activated! Emails will send automatically when a payment fails.
            </p>
          </div>
        </Card>
      )}

      {/* ─── ADDITIONAL SEQUENCES ─── */}
      {sequences.length > 1 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-3">Additional sequences</h3>
          <div className="space-y-2">
            {sequences.filter((s) => s.id !== defaultSeq?.id).map((seq) => (
              <Card key={seq.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-sm">{seq.name}</h4>
                    <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      {seq.rk_dunning_emails?.[0]?.count || 0} emails
                    </p>
                  </div>
                  <Link href={`/dashboard/sequences/${seq.id}`}>
                    <Button variant="ghost" size="sm">Edit →</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* + New sequence */}
      <div className="mt-6">
        {!showCreate ? (
          <button
            onClick={() => setShowCreate(true)}
            className="text-sm hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-text-secondary)" }}
          >
            + Create additional sequence
          </button>
        ) : (
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Create New Sequence</h3>
            <div className="space-y-3">
              <Input placeholder="Sequence name" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
              <div className="flex gap-2">
                <Button variant="primary" size="sm" onClick={handleCreate} disabled={creating || !newName.trim()}>
                  {creating ? "Creating..." : "Create"}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
