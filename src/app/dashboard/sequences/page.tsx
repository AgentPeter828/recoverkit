"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isMockMode } from "@/lib/mock/config";
import { mockDunningSequences } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";

const TONES = [
  { id: "friendly", label: "🤝 Friendly", desc: "Casual, reassuring, human" },
  { id: "professional", label: "💼 Professional", desc: "Clean, business-like" },
  { id: "direct", label: "⚡ Direct", desc: "Short, action-oriented" },
  { id: "empathetic", label: "😊 Empathetic", desc: "Warm, understanding" },
  { id: "formal", label: "🏢 Formal", desc: "Corporate, polished" },
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

function stepLabel(step: number): string {
  const labels = ["Friendly reminder", "Follow up", "Escalation", "Urgent notice", "Final notice"];
  return labels[step - 1] || `Step ${step}`;
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

  useEffect(() => {
    initSequences();
  }, []);

  async function initSequences() {
    if (isMockMode()) {
      setSequences(mockDunningSequences as DunningSequence[]);
      setLoading(false);
      return;
    }

    try {
      // Fetch sequences
      const res = await fetch("/api/dunning-sequences");
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const data = await res.json();
      const seqs = data.sequences || [];

      if (seqs.length === 0) {
        // Auto-seed the default sequence
        setSeeding(true);
        const seedRes = await fetch("/api/dunning-sequences/seed-default", { method: "POST" });
        if (seedRes.ok) {
          // Re-fetch after seeding
          const res2 = await fetch("/api/dunning-sequences");
          if (res2.ok) {
            const data2 = await res2.json();
            setSequences(data2.sequences || []);
            // Fetch emails for the default sequence
            if (data2.sequences?.[0]?.id) {
              await fetchEmails(data2.sequences[0].id);
            }
          }
        }
        setSeeding(false);
      } else {
        setSequences(seqs);
        // Fetch emails for the default/first sequence
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
            These emails are sent automatically when a customer's payment fails
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* ─── EMAIL PREVIEW ─── */}
      {emails.length > 0 && (
        <div className="space-y-3 mb-6">
          {emails
            .sort((a, b) => a.step_number - b.step_number)
            .map((email) => {
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
                            <Button variant="ghost" size="sm">✏️ Edit this email</Button>
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
            Click a style below to regenerate all 5 emails in that tone
          </p>
          <div className="flex flex-wrap gap-2">
            {TONES.map((tone) => (
              <button
                key={tone.id}
                onClick={() => handleChangeTone(tone.id)}
                disabled={changingTone}
                className="text-sm px-4 py-2 rounded-lg border transition-colors hover:border-current disabled:opacity-50"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
              >
                <span className="block font-medium">{tone.label}</span>
                <span className="block text-xs opacity-70">{tone.desc}</span>
              </button>
            ))}
          </div>
          {changingTone && (
            <p className="text-sm mt-3 animate-pulse" style={{ color: "var(--color-brand)" }}>
              ✨ Regenerating emails in your chosen tone...
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
              ✅ Looks good, activate
            </Button>
            <Link href={`/dashboard/sequences/${defaultSeq?.id}`}>
              <Button variant="outline" size="sm">✏️ Edit individually</Button>
            </Link>
          </div>
        </Card>
      )}

      {confirmed && (
        <Card className="p-4 mb-6 text-center" style={{ background: "#d1fae5" }}>
          <p className="text-sm font-medium" style={{ color: "#065f46" }}>
            ✅ Email sequence activated! Emails will send automatically when a payment fails.
          </p>
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
