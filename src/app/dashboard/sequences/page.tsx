"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isMockMode } from "@/lib/mock/config";
import { mockDunningSequences } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";
import { HowItWorks } from "@/components/dev/HowItWorks";

interface DunningSequence {
  id: string;
  name: string;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  dunning_emails: { count: number }[];
}

export default function SequencesPage() {
  const [sequences, setSequences] = useState<DunningSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [seeding, setSeeding] = useState(false);

  useEffect(() => {
    fetchSequences();
  }, []);

  async function fetchSequences() {
    if (isMockMode()) {
      setSequences(mockDunningSequences as DunningSequence[]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/dunning-sequences");
      if (res.ok) {
        const data = await res.json();
        setSequences(data.sequences || []);
      }
    } catch (err) {
      console.error("Failed to fetch sequences:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newName.trim()) return;
    setCreating(true);
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
        fetchSequences();
      }
    } catch (err) {
      console.error("Failed to create sequence:", err);
    } finally {
      setCreating(false);
    }
  }

  async function handleSeedDefault() {
    setSeeding(true);
    analytics.featureUsed("default_sequence_seeded", {});
    try {
      const res = await fetch("/api/dunning-sequences/seed-default", { method: "POST" });
      if (res.ok) {
        fetchSequences();
      } else {
        console.error("Failed to seed default sequence:", await res.text());
      }
    } catch (err) {
      console.error("Failed to seed default sequence:", err);
    } finally {
      setSeeding(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this sequence and all its emails?")) return;
    try {
      const res = await fetch(`/api/dunning-sequences/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSequences((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete sequence:", err);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Email Sequences</h1>
            <HowItWorks section="sequences" />
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Create dunning email sequences to recover failed payments
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowCreate(!showCreate)}>
            + New Sequence
          </Button>
        </div>
      </div>

      {/* Create form */}
      {showCreate && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Create New Sequence</h3>
          <div className="space-y-3">
            <Input placeholder="Sequence name" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Input placeholder="Description (optional)" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate} disabled={creating || !newName.trim()}>
                {creating ? "Creating..." : "Create Sequence"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-72 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      ) : sequences.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">📧</p>
          <p className="font-semibold">Create your first dunning email sequence</p>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Dunning sequences are automated email flows sent to customers with failed payments.
            Each step escalates urgency — from friendly reminder to last chance.
          </p>
          <div className="mt-4 flex gap-3 justify-center">
            <Button variant="primary" size="sm" onClick={handleSeedDefault} disabled={seeding}>
              {seeding ? "Creating..." : "⚡ Use Default Sequence (5 emails)"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowCreate(true)}>
              + Create Custom
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {sequences.map((seq) => (
            <Card key={seq.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{seq.name}</h3>
                    {seq.is_default && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#dbeafe", color: "#1e40af" }}>
                        Default
                      </span>
                    )}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${seq.is_active ? "" : "opacity-60"}`}
                      style={{ background: seq.is_active ? "#d1fae5" : "#f3f4f6", color: seq.is_active ? "#065f46" : "#6b7280" }}>
                      {seq.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  {seq.description && (
                    <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{seq.description}</p>
                  )}
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
                    {seq.dunning_emails?.[0]?.count || 0} emails in sequence
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/dashboard/sequences/${seq.id}`}>
                    <Button variant="outline" size="sm">Edit Emails</Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(seq.id)} style={{ color: "#ef4444" }}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
