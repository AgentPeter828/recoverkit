"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface DnsRecord {
  record: string;
  name: string;
  type: string;
  ttl: string;
  status: string;
  value: string;
  priority?: number;
}

interface EmailDomain {
  id: string;
  domain: string;
  status: string;
  dns_records: DnsRecord[];
  from_name: string | null;
  from_email: string | null;
  created_at: string;
  verified_at: string | null;
}

export default function EmailSetupPage() {
  const [domains, setDomains] = useState<EmailDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [verifying, setVerifying] = useState<string | null>(null);
  const [newDomain, setNewDomain] = useState("");
  const [fromName, setFromName] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
  }, []);

  async function fetchDomains() {
    try {
      const res = await fetch("/api/email-domains");
      if (res.ok) {
        const data = await res.json();
        setDomains(data.domains || []);
      }
    } catch (err) {
      console.error("Failed to fetch domains:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    if (!newDomain.trim()) return;
    setAdding(true);
    setError(null);

    try {
      const res = await fetch("/api/email-domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          domain: newDomain.trim(),
          from_name: fromName.trim() || null,
        }),
      });

      if (res.ok) {
        setNewDomain("");
        setFromName("");
        setShowAdd(false);
        fetchDomains();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add domain");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setAdding(false);
    }
  }

  async function handleVerify(domainId: string) {
    setVerifying(domainId);
    setError(null);

    try {
      const res = await fetch(`/api/email-domains/${domainId}/verify`, {
        method: "POST",
      });
      const data = await res.json();

      if (res.ok) {
        fetchDomains();
        if (data.status === "verified") {
          setError(null);
        } else {
          setError("DNS records not yet verified. Please check your DNS settings and try again in a few minutes.");
        }
      } else {
        setError(data.error || "Verification failed");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setVerifying(null);
    }
  }

  async function handleDelete(domainId: string) {
    if (!confirm("Remove this domain? Emails will fall back to the default sender.")) return;

    try {
      const res = await fetch(`/api/email-domains/${domainId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setDomains((prev) => prev.filter((d) => d.id !== domainId));
      }
    } catch {
      setError("Failed to remove domain.");
    }
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  const verifiedDomain = domains.find((d) => d.status === "verified");

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Setup</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Add your domain so dunning emails come from your brand, not ours
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
          {!showAdd && (
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              + Add Domain
            </Button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg px-4 py-3 text-sm" style={{ background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      {/* Current sending status */}
      <Card className="p-6 mb-6">
        <h2 className="font-semibold mb-2">Current email sender</h2>
        {verifiedDomain ? (
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">
              Emails send from <strong>{verifiedDomain.from_email}</strong>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
              Verified
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-yellow-500" />
            <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Using default sender: <strong>RecoverKit &lt;noreply@mail.recoverkit.dev&gt;</strong>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#fef3c7", color: "#92400e" }}>
              Low deliverability
            </span>
          </div>
        )}
        {!verifiedDomain && (
          <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
            Add your own domain below so emails come from your brand. This dramatically improves deliverability.
          </p>
        )}
      </Card>

      {/* Add domain form */}
      {showAdd && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Add your sending domain</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Domain</label>
              <Input
                placeholder="yourapp.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
              />
              <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary)" }}>
                Emails will send from billing@{newDomain || "yourapp.com"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From name (optional)</label>
              <Input
                placeholder="Your App Name"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAdd} disabled={adding || !newDomain.trim()}>
                {adding ? "Adding..." : "Add Domain"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => { setShowAdd(false); setError(null); }}>
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Domain list */}
      {loading ? (
        <Card className="p-6 animate-pulse">
          <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </Card>
      ) : domains.length === 0 && !showAdd ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">📧</p>
          <p className="font-semibold">No sending domain configured</p>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Add your domain so dunning emails come from your brand. This improves deliverability and builds trust with your customers.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
              + Add Domain
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {domains.map((domain) => (
            <Card key={domain.id} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{domain.domain}</h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: domain.status === "verified" ? "#d1fae5" : "#fef3c7",
                      color: domain.status === "verified" ? "#065f46" : "#92400e",
                    }}
                  >
                    {domain.status === "verified" ? "Verified" : "Pending verification"}
                  </span>
                </div>
                <div className="flex gap-2">
                  {domain.status !== "verified" && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleVerify(domain.id)}
                      disabled={verifying === domain.id}
                    >
                      {verifying === domain.id ? "Checking..." : "Verify DNS"}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(domain.id)}
                    style={{ color: "#ef4444" }}
                  >
                    Remove
                  </Button>
                </div>
              </div>

              {domain.status === "verified" && (
                <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
                  Emails sending from: <strong>{domain.from_email}</strong>
                </p>
              )}

              {domain.status !== "verified" && domain.dns_records && domain.dns_records.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-3">
                    Add these DNS records to your domain provider:
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: "var(--color-bg-secondary)" }}>
                          <th className="px-3 py-2 text-left font-semibold">Type</th>
                          <th className="px-3 py-2 text-left font-semibold">Name</th>
                          <th className="px-3 py-2 text-left font-semibold">Value</th>
                          <th className="px-3 py-2 text-left font-semibold">Status</th>
                          <th className="px-3 py-2"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {domain.dns_records.map((record, i) => (
                          <tr key={i} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                            <td className="px-3 py-2 font-mono">{record.type}</td>
                            <td className="px-3 py-2 font-mono max-w-[200px] truncate" title={record.name}>
                              {record.name}
                            </td>
                            <td className="px-3 py-2 font-mono max-w-[300px] truncate" title={record.value}>
                              {record.value}
                            </td>
                            <td className="px-3 py-2">
                              <span
                                className="inline-block w-2 h-2 rounded-full"
                                style={{
                                  background: record.status === "verified" ? "#22c55e" : "#eab308",
                                }}
                              />
                            </td>
                            <td className="px-3 py-2">
                              <button
                                onClick={() => copyToClipboard(record.value, `${domain.id}-${i}`)}
                                className="text-xs hover:opacity-70"
                                style={{ color: "var(--color-brand)" }}
                              >
                                {copied === `${domain.id}-${i}` ? "Copied!" : "Copy"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs mt-3" style={{ color: "var(--color-text-secondary)" }}>
                    DNS changes can take up to 48 hours to propagate, but usually complete within minutes. 
                    Click "Verify DNS" after adding the records.
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* How it works */}
      <Card className="p-6 mt-8">
        <h3 className="font-semibold mb-3">How it works</h3>
        <div className="space-y-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          <div className="flex gap-3">
            <span className="font-bold shrink-0" style={{ color: "var(--color-brand)" }}>1.</span>
            <p>Add your domain (e.g. <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>yourapp.com</code>)</p>
          </div>
          <div className="flex gap-3">
            <span className="font-bold shrink-0" style={{ color: "var(--color-brand)" }}>2.</span>
            <p>Add the DNS records to your domain provider (Cloudflare, Namecheap, GoDaddy, etc.)</p>
          </div>
          <div className="flex gap-3">
            <span className="font-bold shrink-0" style={{ color: "var(--color-brand)" }}>3.</span>
            <p>Click "Verify DNS" to confirm the records are set up correctly</p>
          </div>
          <div className="flex gap-3">
            <span className="font-bold shrink-0" style={{ color: "var(--color-brand)" }}>4.</span>
            <p>Dunning emails now send from <strong>billing@yourapp.com</strong> with proper authentication. No email login needed.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
