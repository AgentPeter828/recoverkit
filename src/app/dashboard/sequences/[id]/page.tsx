"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { analytics } from "@/lib/mixpanel";

interface DunningEmail {
  id: string;
  sequence_id: string;
  step_number: number;
  subject: string;
  body_html: string;
  body_text: string | null;
  delay_hours: number;
  is_ai_generated: boolean;
  created_at: string;
}

interface Sequence {
  id: string;
  name: string;
  description: string | null;
}

export default function SequenceDetailPage() {
  const params = useParams();
  const sequenceId = params.id as string;
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [emails, setEmails] = useState<DunningEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    fetchSequence();
  }, [sequenceId]);

  async function fetchSequence() {
    try {
      const res = await fetch(`/api/dunning-sequences/${sequenceId}`);
      if (res.ok) {
        const data = await res.json();
        setSequence(data.sequence);
        setEmails(data.emails || []);
      }
    } catch (err) {
      console.error("Failed to fetch sequence:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleGenerateEmail() {
    setGenerating(true);
    const stepNumber = emails.length + 1;
    analytics.featureUsed("ai_email_generated", { step: stepNumber, sequence_id: sequenceId });
    try {
      const res = await fetch("/api/dunning-emails/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_number: stepNumber,
          amount: "49.00",
          currency: "usd",
          business_name: "Your SaaS",
          customer_name: "Customer",
          sequence_id: sequenceId,
          delay_hours: stepNumber === 1 ? 4 : stepNumber === 2 ? 24 : stepNumber === 3 ? 72 : 120,
        }),
      });
      if (res.ok) {
        fetchSequence();
      }
    } catch (err) {
      console.error("Failed to generate email:", err);
    } finally {
      setGenerating(false);
    }
  }

  async function handleSaveEdit(emailId: string) {
    try {
      const res = await fetch(`/api/dunning-emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: editSubject, body_html: editBody }),
      });
      if (res.ok) {
        setEditingId(null);
        fetchSequence();
      }
    } catch (err) {
      console.error("Failed to save email:", err);
    }
  }

  async function handleDeleteEmail(emailId: string) {
    if (!confirm("Delete this email step?")) return;
    try {
      const res = await fetch(`/api/dunning-emails/${emailId}`, { method: "DELETE" });
      if (res.ok) {
        setEmails((prev) => prev.filter((e) => e.id !== emailId));
      }
    } catch (err) {
      console.error("Failed to delete email:", err);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12">
        <Card className="p-8 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-gray-100 rounded" />)}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{sequence?.name || "Email Sequence"}</h1>
          {sequence?.description && (
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{sequence.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/sequences">
            <Button variant="ghost" size="sm">← Back</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={handleGenerateEmail} disabled={generating}>
            {generating ? "Generating..." : "✨ AI Generate Next Email"}
          </Button>
        </div>
      </div>

      {emails.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-semibold">No emails in this sequence yet</p>
          <p className="text-sm mt-1 mb-4" style={{ color: "var(--color-text-secondary)" }}>
            Click &quot;AI Generate Next Email&quot; to create your first dunning email with AI.
          </p>
          <Button variant="primary" onClick={handleGenerateEmail} disabled={generating}>
            {generating ? "Generating..." : "Generate First Email"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {emails.map((email) => (
            <Card key={email.id} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold text-white" style={{ background: "var(--color-brand)" }}>
                    {email.step_number}
                  </span>
                  <span className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
                    Step {email.step_number} · {email.delay_hours}h delay
                  </span>
                  {email.is_ai_generated && (
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#ede9fe", color: "#6d28d9" }}>✨ AI</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => {
                    setEditingId(editingId === email.id ? null : email.id);
                    setEditSubject(email.subject);
                    setEditBody(email.body_html);
                  }}>
                    {editingId === email.id ? "Cancel" : "Edit"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteEmail(email.id)} style={{ color: "#ef4444" }}>
                    Delete
                  </Button>
                </div>
              </div>

              {editingId === email.id ? (
                <div className="space-y-3">
                  <Input value={editSubject} onChange={(e) => setEditSubject(e.target.value)} placeholder="Subject line" />
                  <textarea
                    className="w-full rounded-lg border px-3 py-2 text-sm min-h-[120px]"
                    style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    placeholder="Email body (HTML)"
                  />
                  <Button variant="primary" size="sm" onClick={() => handleSaveEdit(email.id)}>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div>
                  <h3 className="font-semibold mb-2">Subject: {email.subject}</h3>
                  <div className="text-sm p-3 rounded-lg" style={{ background: "var(--color-bg-secondary)" }}
                    dangerouslySetInnerHTML={{ __html: email.body_html }} />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
