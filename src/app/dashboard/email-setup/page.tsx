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

/* ─── Inline SVG Illustrations ─── */

function DomainInputIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="18" width="56" height="28" rx="6" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-brand-50)" />
      <text x="12" y="36" fontSize="10" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="600">app.com</text>
      <rect x="50" y="27" width="2" height="10" rx="1" fill="var(--color-brand)">
        <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite" />
      </rect>
    </svg>
  );
}

function CopyClipboardIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="16" width="28" height="36" rx="4" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-brand-50)" />
      <rect x="22" y="26" width="16" height="2" rx="1" fill="var(--color-brand-light)" />
      <rect x="22" y="32" width="12" height="2" rx="1" fill="var(--color-brand-light)" />
      <rect x="22" y="38" width="14" height="2" rx="1" fill="var(--color-brand-light)" />
      <rect x="24" y="10" width="12" height="9" rx="3" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-bg)" />
      <circle cx="30" cy="14" r="2" fill="var(--color-brand)" />
    </svg>
  );
}

function DnsProviderIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="14" width="24" height="16" rx="4" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-brand-50)" />
      <text x="10" y="25" fontSize="7" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="600">DNS</text>
      <path d="M32 22 L38 22" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 19 L39 22 L36 25" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="40" y="8" width="20" height="12" rx="3" stroke="var(--color-text-tertiary)" strokeWidth="1.5" fill="var(--color-bg-secondary)" />
      <rect x="40" y="24" width="20" height="12" rx="3" stroke="var(--color-text-tertiary)" strokeWidth="1.5" fill="var(--color-bg-secondary)" />
      <rect x="40" y="40" width="20" height="12" rx="3" stroke="var(--color-text-tertiary)" strokeWidth="1.5" fill="var(--color-bg-secondary)" />
      <rect x="44" y="13" width="12" height="2" rx="1" fill="var(--color-text-tertiary)" />
      <rect x="44" y="29" width="12" height="2" rx="1" fill="var(--color-text-tertiary)" />
      <rect x="44" y="45" width="12" height="2" rx="1" fill="var(--color-text-tertiary)" />
    </svg>
  );
}

function VerifyCheckIllustration() {
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-brand-50)" />
      <path d="M22 32 L29 39 L42 26" stroke="var(--color-brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StepNumber({ number }: { number: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 48,
        height: 48,
        background: "var(--color-brand)",
        color: "#fff",
        fontSize: 22,
        fontWeight: 700,
      }}
    >
      {number}
    </div>
  );
}

function DnsQuestionMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="9" cy="9" r="8" stroke="var(--color-brand-light)" strokeWidth="1.5" fill="var(--color-brand-50)" />
      <text x="9" y="13" fontSize="11" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="700" textAnchor="middle">?</text>
    </svg>
  );
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
  const [showDnsExplainer, setShowDnsExplainer] = useState(false);

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
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Setup</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Make your emails come from your brand — not ours
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

      {/* ─── VISUAL STEP-BY-STEP GUIDE ─── */}
      <Card className="p-8 mb-8">
        <h2 className="text-lg font-bold mb-2">How to set up your email in 4 easy steps</h2>
        <div
          className="rounded-lg px-4 py-3 mb-6 text-sm"
          style={{ background: "var(--color-brand-50)", color: "var(--color-brand-dark)" }}
        >
          Don&apos;t worry — this sounds technical but it&apos;s really just copy-paste!
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ minWidth: 0 }}>
          {[
            {
              num: 1,
              icon: <DomainInputIllustration />,
              title: "Type your domain",
              desc: "Enter your website address",
            },
            {
              num: 2,
              icon: <CopyClipboardIllustration />,
              title: "Copy DNS records",
              desc: "Click the copy button we give you",
            },
            {
              num: 3,
              icon: <DnsProviderIllustration />,
              title: "Paste in your provider",
              desc: "Add the records in your DNS settings",
            },
            {
              num: 4,
              icon: <VerifyCheckIllustration />,
              title: "Click Verify",
              desc: "We\u2019ll check everything works",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center text-center rounded-xl overflow-hidden"
              style={{ background: "var(--color-bg-secondary)", border: "1px solid var(--color-border)" }}
            >
              <div className="w-full px-4 pt-5 pb-3 flex flex-col items-center gap-2">
                <StepNumber number={step.num} />
                <div className="flex items-center justify-center" style={{ width: 64, height: 64 }}>
                  {step.icon}
                </div>
              </div>
              <div className="w-full px-5 pb-5">
                <p className="font-semibold text-sm mb-1">{step.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-secondary)", wordBreak: "normal", overflowWrap: "break-word" }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What is DNS? */}
        <div className="mt-6 pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
          <button
            onClick={() => setShowDnsExplainer(!showDnsExplainer)}
            className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity"
            style={{ color: "var(--color-brand)" }}
          >
            <DnsQuestionMark />
            What is DNS? (click to learn)
            <svg
              className={`h-4 w-4 transition-transform ${showDnsExplainer ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showDnsExplainer && (
            <div
              className="mt-3 rounded-lg p-4 text-sm"
              style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
            >
              <p className="mb-2">
                <strong>DNS is like a phone book for the internet.</strong>
              </p>
              <p className="mb-2">
                When someone gets an email from &quot;yourapp.com&quot;, their email service checks the DNS to make sure it&apos;s really from you and not spam.
              </p>
              <p>
                By adding DNS records, you&apos;re basically telling the internet: &quot;Yes, RecoverKit is allowed to send emails on my behalf.&quot; That&apos;s it!
              </p>
            </div>
          )}
        </div>
      </Card>

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
            Add your own domain below so emails come from your brand. This makes way more emails land in the inbox instead of spam.
          </p>
        )}
      </Card>

      {/* Add domain form */}
      {showAdd && (
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <StepNumber number={1} />
            <h3 className="font-semibold text-lg">Type your domain</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium mb-1">Your domain</label>
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
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="mx-auto mb-3">
            <rect x="8" y="16" width="48" height="32" rx="6" stroke="var(--color-brand)" strokeWidth="2" fill="var(--color-brand-50)" />
            <path d="M8 22 L32 38 L56 22" stroke="var(--color-brand)" strokeWidth="2" fill="none" />
            <circle cx="50" cy="16" r="8" fill="var(--color-brand)" />
            <path d="M47 16 L50 19 L53 13" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="font-semibold">No domain set up yet</p>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Add your domain so emails come from your brand. Customers trust emails from your domain way more!
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
                <div className="flex items-center gap-3 p-4 rounded-lg" style={{ background: "#d1fae5" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#065f46" />
                    <path d="M8 12 L11 15 L16 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span className="text-sm font-medium" style={{ color: "#065f46" }}>
                    All set! Emails sending from: <strong>{domain.from_email}</strong>
                  </span>
                </div>
              )}

              {domain.status !== "verified" && domain.dns_records && domain.dns_records.length > 0 && (
                <div>
                  {/* Step 2 guidance */}
                  <div className="flex items-center gap-3 mb-4">
                    <StepNumber number={2} />
                    <div>
                      <p className="text-sm font-semibold">Copy these DNS records</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        Click the &quot;Copy&quot; button next to each row below
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-lg border" style={{ borderColor: "var(--color-border)" }}>
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ background: "var(--color-bg-tertiary)" }}>
                          <th className="px-3 py-2.5 text-left font-semibold">Type</th>
                          <th className="px-3 py-2.5 text-left font-semibold">Name</th>
                          <th className="px-3 py-2.5 text-left font-semibold">
                            Value
                            <span className="ml-1 font-normal" style={{ color: "var(--color-brand)" }}>← copy this</span>
                          </th>
                          <th className="px-3 py-2.5 text-left font-semibold">Status</th>
                          <th className="px-3 py-2.5"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {domain.dns_records.map((record, i) => (
                          <tr
                            key={i}
                            className="border-t"
                            style={{
                              borderColor: "var(--color-border)",
                              background: copied === `${domain.id}-${i}` ? "var(--color-brand-50)" : undefined,
                              transition: "background 0.3s",
                            }}
                          >
                            <td className="px-3 py-2.5 font-mono">{record.type}</td>
                            <td className="px-3 py-2.5 font-mono max-w-[200px] truncate" title={record.name}>
                              {record.name}
                            </td>
                            <td className="px-3 py-2.5 font-mono max-w-[300px] truncate" title={record.value}>
                              {record.value}
                            </td>
                            <td className="px-3 py-2.5">
                              <span className="flex items-center gap-1.5">
                                <span
                                  className="inline-block w-2 h-2 rounded-full"
                                  style={{
                                    background: record.status === "verified" ? "#22c55e" : "#eab308",
                                  }}
                                />
                                <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                                  {record.status === "verified" ? "Done" : "Waiting"}
                                </span>
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <button
                                onClick={() => copyToClipboard(record.value, `${domain.id}-${i}`)}
                                className="text-xs font-medium px-3 py-1 rounded-md transition-colors hover:opacity-70"
                                style={{
                                  color: copied === `${domain.id}-${i}` ? "#065f46" : "var(--color-brand)",
                                  background: copied === `${domain.id}-${i}` ? "#d1fae5" : "var(--color-brand-50)",
                                }}
                              >
                                {copied === `${domain.id}-${i}` ? "Copied!" : "Copy"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Step 3 guidance */}
                  <div className="flex items-center gap-3 mt-6 mb-3">
                    <StepNumber number={3} />
                    <div>
                      <p className="text-sm font-semibold">Paste them in your domain provider</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        Go to where you bought your domain (GoDaddy, Cloudflare, Namecheap, etc.) and add these records in their DNS settings
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-lg px-4 py-3 text-xs"
                    style={{ background: "var(--color-bg-secondary)", color: "var(--color-text-secondary)" }}
                  >
                    <strong>Tip:</strong> Look for &quot;DNS&quot;, &quot;DNS Management&quot;, or &quot;DNS Records&quot; in your domain provider&apos;s settings. Then click &quot;Add Record&quot; and paste the Type, Name, and Value from above.
                  </div>

                  {/* Step 4 guidance */}
                  <div className="flex items-center gap-3 mt-6 mb-3">
                    <StepNumber number={4} />
                    <div>
                      <p className="text-sm font-semibold">Click Verify below</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        After pasting the records, come back here and click the button. It usually takes a few minutes.
                      </p>
                    </div>
                  </div>

                  <div
                    className="rounded-lg px-4 py-3 text-xs"
                    style={{ background: "var(--color-brand-50)", color: "var(--color-brand-dark)" }}
                  >
                    DNS changes usually show up in minutes, but can sometimes take up to 48 hours. If it doesn&apos;t work right away, try again in a bit!
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
