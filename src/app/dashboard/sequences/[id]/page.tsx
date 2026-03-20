"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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

/* ─── Toolbar Button ─── */
function ToolbarButton({
  label,
  title,
  onClick,
  active,
}: {
  label: string;
  title: string;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent stealing focus from contentEditable
        onClick();
      }}
      className="px-2 py-1 rounded text-sm font-medium transition-colors"
      style={{
        background: active ? "var(--color-brand-50)" : "transparent",
        color: active ? "var(--color-brand)" : "var(--color-text-secondary)",
        border: "1px solid",
        borderColor: active ? "var(--color-brand)" : "transparent",
      }}
    >
      {label}
    </button>
  );
}

/* ─── Rich Text Editor ─── */
function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string;
  onChange: (html: string) => void;
}) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  /* Strip browser-inserted <p> wrappers → <br> line breaks */
  function stripParagraphs(html: string): string {
    return html
      .replace(/<p[^>]*><br\s*\/?><\/p>/gi, "<br>")
      .replace(/<p[^>]*>(.*?)<\/p>/gi, "$1<br>")
      .replace(/(<br>\s*)+$/i, ""); // trim trailing <br>
  }

  useEffect(() => {
    if (editorRef.current) {
      // Set default paragraph separator to <br> to prevent <p> wrapping
      document.execCommand("defaultParagraphSeparator", false, "br");
      // Clean any existing <p> tags from stored HTML before rendering
      const cleaned = stripParagraphs(initialHtml);
      if (editorRef.current.innerHTML !== cleaned) {
        editorRef.current.innerHTML = cleaned;
      }
    }
    // Only set initial content on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    if (document.queryCommandState("bold")) formats.add("bold");
    if (document.queryCommandState("italic")) formats.add("italic");
    if (document.queryCommandState("underline")) formats.add("underline");
    setActiveFormats(formats);
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      // Strip any <p> tags the browser may have snuck in
      const raw = editorRef.current.innerHTML;
      const cleaned = stripParagraphs(raw);
      if (raw !== cleaned) {
        // Save cursor position, rewrite, restore
        const sel = window.getSelection();
        const range = sel?.rangeCount ? sel.getRangeAt(0) : null;
        editorRef.current.innerHTML = cleaned;
        if (range && sel) {
          try {
            sel.removeAllRanges();
            sel.addRange(range);
          } catch {
            // If range is invalid after rewrite, move cursor to end
            const newRange = document.createRange();
            newRange.selectNodeContents(editorRef.current);
            newRange.collapse(false);
            sel.removeAllRanges();
            sel.addRange(newRange);
          }
        }
      }
      onChange(cleaned);
    }
    updateActiveFormats();
  }, [onChange, updateActiveFormats]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      // Force Enter to insert <br> instead of <p>/<div>
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        document.execCommand("insertLineBreak");
        if (editorRef.current) {
          onChange(stripParagraphs(editorRef.current.innerHTML));
        }
      }
    },
    [onChange]
  );

  const execCmd = useCallback(
    (command: string, value?: string) => {
      document.execCommand(command, false, value);
      handleInput();
      editorRef.current?.focus();
    },
    [handleInput]
  );

  return (
    <div>
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-t-lg border border-b-0"
        style={{
          background: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        <ToolbarButton
          label="B"
          title="Bold (Ctrl+B)"
          onClick={() => execCmd("bold")}
          active={activeFormats.has("bold")}
        />
        <ToolbarButton
          label="I"
          title="Italic (Ctrl+I)"
          onClick={() => execCmd("italic")}
          active={activeFormats.has("italic")}
        />
        <ToolbarButton
          label="U"
          title="Underline (Ctrl+U)"
          onClick={() => execCmd("underline")}
          active={activeFormats.has("underline")}
        />
        <div
          className="w-px h-5 mx-1"
          style={{ background: "var(--color-border)" }}
        />
        <ToolbarButton
          label="Link"
          title="Insert link"
          onClick={() => {
            const url = prompt("Enter URL:");
            if (url) execCmd("createLink", url);
          }}
        />
        <ToolbarButton
          label="Unlink"
          title="Remove link"
          onClick={() => execCmd("unlink")}
        />
      </div>

      {/* Editable area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        className="min-h-[160px] px-4 py-3 text-sm rounded-b-lg border focus:outline-none focus:ring-2"
        style={{
          borderColor: "var(--color-border)",
          background: "var(--color-bg)",
          color: "var(--color-text)",
          lineHeight: 1.7,
        }}
      />
    </div>
  );
}

/* ─── Email Editor Card ─── */
function EmailEditorCard({
  email,
  onSave,
  onDelete,
}: {
  email: DunningEmail;
  onSave: (id: string, subject: string, bodyHtml: string) => Promise<void>;
  onDelete: (id: string) => void;
}) {
  const [subject, setSubject] = useState(email.subject);
  const [bodyHtml, setBodyHtml] = useState(email.body_html);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const hasChanges =
    subject !== email.subject || bodyHtml !== email.body_html;

  async function handleSave() {
    setSaving(true);
    await onSave(email.id, subject, bodyHtml);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white"
            style={{ background: "var(--color-brand)" }}
          >
            {email.step_number}
          </span>
          <span
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Step {email.step_number} · {email.delay_hours}h delay
          </span>
          {email.is_ai_generated && (
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: "#ede9fe", color: "#6d28d9" }}
            >
              ✨ AI
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(email.id)}
          style={{ color: "#ef4444" }}
        >
          Delete
        </Button>
      </div>

      {/* Subject */}
      <div className="mb-4">
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Subject line
        </label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject line"
        />
      </div>

      {/* Body — rich text editor */}
      <div className="mb-4">
        <label
          className="block text-xs font-semibold mb-1.5"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Email body
        </label>
        <RichTextEditor initialHtml={email.body_html} onChange={setBodyHtml} />
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={handleSave}
          disabled={saving || !hasChanges}
        >
          {saving ? "Saving..." : "Save changes"}
        </Button>
        {saved && (
          <span className="text-sm" style={{ color: "#22c55e" }}>
            ✓ Saved
          </span>
        )}
        {!hasChanges && !saved && (
          <span
            className="text-xs"
            style={{ color: "var(--color-text-secondary)" }}
          >
            No unsaved changes
          </span>
        )}
      </div>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function SequenceDetailPage() {
  const params = useParams();
  const sequenceId = params.id as string;
  const [sequence, setSequence] = useState<Sequence | null>(null);
  const [emails, setEmails] = useState<DunningEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchSequence();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    analytics.featureUsed("ai_email_generated", {
      step: stepNumber,
      sequence_id: sequenceId,
    });
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
          delay_hours:
            stepNumber === 1
              ? 4
              : stepNumber === 2
                ? 24
                : stepNumber === 3
                  ? 72
                  : 120,
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

  async function handleSaveEmail(
    emailId: string,
    subject: string,
    bodyHtml: string
  ) {
    // Also derive plain text from HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = bodyHtml;
    const bodyText = tempDiv.textContent || tempDiv.innerText || "";

    try {
      const res = await fetch(`/api/dunning-emails/${emailId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body_html: bodyHtml,
          body_text: bodyText,
        }),
      });
      if (res.ok) {
        // Update local state
        setEmails((prev) =>
          prev.map((e) =>
            e.id === emailId
              ? { ...e, subject, body_html: bodyHtml, body_text: bodyText }
              : e
          )
        );
      }
    } catch (err) {
      console.error("Failed to save email:", err);
    }
  }

  async function handleDeleteEmail(emailId: string) {
    if (!confirm("Delete this email step?")) return;
    try {
      const res = await fetch(`/api/dunning-emails/${emailId}`, {
        method: "DELETE",
      });
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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 rounded" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  const sortedEmails = [...emails].sort(
    (a, b) => a.step_number - b.step_number
  );

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {sequence?.name || "Email Sequence"}
          </h1>
          {sequence?.description && (
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {sequence.description}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/sequences">
            <Button variant="ghost" size="sm">
              ← Back
            </Button>
          </Link>
          <Button
            variant="primary"
            size="sm"
            onClick={handleGenerateEmail}
            disabled={generating}
          >
            {generating ? "Generating..." : "✨ AI Generate Next Email"}
          </Button>
        </div>
      </div>

      {sortedEmails.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">✨</p>
          <p className="font-semibold">No emails in this sequence yet</p>
          <p
            className="text-sm mt-1 mb-4"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Click &quot;AI Generate Next Email&quot; to create your first
            dunning email with AI.
          </p>
          <Button
            variant="primary"
            onClick={handleGenerateEmail}
            disabled={generating}
          >
            {generating ? "Generating..." : "Generate First Email"}
          </Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {sortedEmails.map((email) => (
            <EmailEditorCard
              key={email.id}
              email={email}
              onSave={handleSaveEmail}
              onDelete={handleDeleteEmail}
            />
          ))}
        </div>
      )}
    </div>
  );
}
