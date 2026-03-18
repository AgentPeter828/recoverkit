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

/* ─── Brand icons ─── */

function GmailIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18.171 8.368h-.67V8.333H10v3.333h4.709A5 5 0 1 1 6.665 8.214V4.459A8.333 8.333 0 1 0 18.333 10c0-.558-.058-1.103-.163-1.632Z" fill="#FFC107"/>
      <path d="m1.128 5.298 3.246 2.382A5 5 0 0 1 10 5c1.274 0 2.434.478 3.322 1.26l2.357-2.358A8.286 8.286 0 0 0 10 1.667 8.33 8.33 0 0 0 1.128 5.298Z" fill="#FF3D00"/>
      <path d="M10 18.333a8.286 8.286 0 0 0 5.587-2.163L13.17 14.09A4.963 4.963 0 0 1 10 15a5 5 0 0 1-4.701-3.306l-3.211 2.474A8.327 8.327 0 0 0 10 18.333Z" fill="#4CAF50"/>
      <path d="M18.171 8.368H17.5V8.333H10v3.333h4.709a5.018 5.018 0 0 1-1.7 2.324h.002l2.416 2.08c-.17.156 2.573-1.877 2.573-6.07 0-.558-.058-1.103-.163-1.632Z" fill="#1976D2"/>
    </svg>
  );
}

function OutlookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="4" width="18" height="12" rx="2" fill="#0078D4"/>
      <path d="M1 6.5 L10 12 L19 6.5" stroke="#fff" strokeWidth="1.2" fill="none"/>
      <path d="M1 4.5 L10 10 L19 4.5" stroke="#fff" strokeWidth="0.8" fill="none" opacity="0.5"/>
    </svg>
  );
}

interface OAuthConnection {
  provider: "gmail" | "outlook";
  email: string;
  status: string;
}

type SetupTab = "oauth" | "dns";

export default function EmailSetupPage() {
  const [activeTab, setActiveTab] = useState<SetupTab>("dns");
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
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  // OAuth state
  const [oauthConnections, setOauthConnections] = useState<OAuthConnection[]>([]);
  const [oauthLoading, setOauthLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [connectingProvider, setConnectingProvider] = useState<string | null>(null);

  useEffect(() => {
    fetchDomains();
    fetchOAuthStatus();

    // Check URL params for OAuth callback result
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const oauthError = params.get("error");
    if (connected) {
      setActiveTab("oauth");
      setSuccessBanner(
        connected === "gmail"
          ? "Gmail connected successfully! Your dunning emails will now send from your Gmail account."
          : "Outlook connected successfully! Your dunning emails will now send from your Outlook account."
      );
      fetchOAuthStatus();
      window.history.replaceState({}, "", window.location.pathname);
    }
    if (oauthError) {
      setActiveTab("oauth");
      setError(formatOAuthError(oauthError));
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  function formatOAuthError(code: string): string {
    const messages: Record<string, string> = {
      gmail_denied: "Gmail connection was cancelled. Please try again when you're ready.",
      gmail_invalid: "Invalid Gmail callback. Please try connecting again.",
      gmail_token_failed: "Failed to authenticate with Gmail. Please try again.",
      gmail_no_refresh: "Gmail did not grant offline access. Please try again and accept all permissions.",
      gmail_userinfo_failed: "Could not retrieve your Gmail address. Please try again.",
      gmail_no_email: "No email address found on your Google account.",
      gmail_db_failed: "Failed to save your Gmail connection. Please try again.",
      gmail_unknown: "An unexpected error occurred connecting Gmail. Please try again.",
      outlook_denied: "Outlook connection was cancelled. Please try again when you're ready.",
      outlook_invalid: "Invalid Outlook callback. Please try connecting again.",
      outlook_token_failed: "Failed to authenticate with Outlook. Please try again.",
      outlook_no_refresh: "Outlook did not grant offline access. Please try again and accept all permissions.",
      outlook_userinfo_failed: "Could not retrieve your Outlook address. Please try again.",
      outlook_no_email: "No email address found on your Microsoft account.",
      outlook_db_failed: "Failed to save your Outlook connection. Please try again.",
      outlook_unknown: "An unexpected error occurred connecting Outlook. Please try again.",
    };
    return messages[code] || `Connection failed: ${code.replace(/_/g, " ")}`;
  }

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

  async function fetchOAuthStatus() {
    try {
      const res = await fetch("/api/email-oauth/status");
      if (res.ok) {
        const data = await res.json();
        setOauthConnections(data.connections || []);
      }
    } catch (err) {
      console.error("Failed to fetch OAuth status:", err);
    } finally {
      setOauthLoading(false);
    }
  }

  function handleOAuthConnect(provider: "gmail" | "outlook") {
    setConnectingProvider(provider);
    window.location.href = `/api/email-oauth/${provider}`;
  }

  async function handleOAuthDisconnect(provider: "gmail" | "outlook") {
    if (!confirm(`Disconnect your ${provider === "gmail" ? "Gmail" : "Outlook"} account? Emails will fall back to the default sender.`)) return;

    setDisconnecting(provider);
    try {
      const res = await fetch("/api/email-oauth/disconnect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider }),
      });
      if (res.ok) {
        setOauthConnections((prev) => prev.filter((c) => c.provider !== provider));
      } else {
        setError("Failed to disconnect. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDisconnecting(null);
    }
  }

  const gmailConnection = oauthConnections.find((c) => c.provider === "gmail" && c.status === "connected");
  const outlookConnection = oauthConnections.find((c) => c.provider === "outlook" && c.status === "connected");
  const hasAnyOAuth = Boolean(gmailConnection || outlookConnection);

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
      {/* ─── HEADER ─── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Setup</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Make your emails come from your brand — not ours
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">&larr; Dashboard</Button>
        </Link>
      </div>

      {/* ─── CURRENT SENDING STATUS ─── */}
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
        ) : hasAnyOAuth ? (
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            <span className="text-sm">
              Emails send via <strong>{gmailConnection ? `Gmail (${gmailConnection.email})` : `Outlook (${outlookConnection!.email})`}</strong>
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#d1fae5", color: "#065f46" }}>
              Connected
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
        {!verifiedDomain && !hasAnyOAuth && (
          <p className="text-xs mt-2" style={{ color: "var(--color-text-secondary)" }}>
            Connect your Gmail or Outlook for quick setup, or add a custom domain for best deliverability.
          </p>
        )}
      </Card>

      {/* ─── SUCCESS BANNER ─── */}
      {successBanner && (
        <div
          className="mb-6 rounded-lg px-4 py-3 text-sm flex items-center justify-between"
          style={{ background: "#d1fae5", color: "#065f46", border: "1px solid #6ee7b7" }}
        >
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <circle cx="9" cy="9" r="8" fill="#065f46" />
              <path d="M5.5 9 L8 11.5 L12.5 6.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {successBanner}
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-sm font-medium hover:opacity-70 shrink-0 ml-4"
            style={{ color: "#065f46" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── ERROR BANNER ─── */}
      {error && (
        <div
          className="mb-6 rounded-lg px-4 py-3 text-sm flex items-center justify-between"
          style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" }}
        >
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-sm font-medium hover:opacity-70 shrink-0 ml-4"
            style={{ color: "#991b1b" }}
          >
            Dismiss
          </button>
        </div>
      )}

      {/* ─── TAB SELECTOR ─── */}
      <div
        className="grid grid-cols-2 gap-3 mb-6"
        role="tablist"
      >
        <button
          role="tab"
          aria-selected={activeTab === "dns"}
          onClick={() => setActiveTab("dns")}
          className="relative rounded-xl border-2 p-4 text-left transition-all"
          style={{
            borderColor: activeTab === "dns" ? "var(--color-brand)" : "var(--color-border)",
            background: activeTab === "dns" ? "var(--color-brand-50)" : "var(--color-bg)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">Custom Domain (DNS)</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "var(--color-brand-50)", color: "var(--color-brand-dark)" }}
            >
              Recommended
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Best deliverability — emails from billing@yourdomain.com
          </p>
          {verifiedDomain && (
            <span
              className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
              style={{ background: "#22c55e" }}
              title="Verified"
            />
          )}
        </button>

        <button
          role="tab"
          aria-selected={activeTab === "oauth"}
          onClick={() => setActiveTab("oauth")}
          className="relative rounded-xl border-2 p-4 text-left transition-all"
          style={{
            borderColor: activeTab === "oauth" ? "var(--color-brand)" : "var(--color-border)",
            background: activeTab === "oauth" ? "var(--color-brand-50)" : "var(--color-bg)",
          }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm">Connect Gmail / Outlook</span>
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wide"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              Quick Setup
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
            Send from your own email account — ready in 30 seconds
          </p>
          {hasAnyOAuth && (
            <span
              className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full"
              style={{ background: "#22c55e" }}
              title="Connected"
            />
          )}
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB: CONNECT GMAIL / OUTLOOK                          */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "oauth" && (
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-1">Connect your email account</h2>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
              Send dunning emails directly from your own email — no DNS setup required. Click a button, authorize, and you&apos;re done.
            </p>

            {oauthLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-14 rounded-lg" style={{ background: "var(--color-bg-secondary)" }} />
                <div className="h-14 rounded-lg" style={{ background: "var(--color-bg-secondary)" }} />
              </div>
            ) : (
              <div className="space-y-3">
                {/* ── Gmail ── */}
                {gmailConnection ? (
                  <div
                    className="flex items-center justify-between rounded-lg px-4 py-3"
                    style={{ background: "#d1fae5", border: "1px solid #6ee7b7" }}
                  >
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#065f46" />
                        <path d="M6 10 L9 13 L14 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <span className="text-sm font-medium" style={{ color: "#065f46" }}>Gmail connected</span>
                        <span className="text-xs ml-2" style={{ color: "#047857" }}>{gmailConnection.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOAuthDisconnect("gmail")}
                      disabled={disconnecting === "gmail"}
                      className="text-xs font-medium px-3 py-1.5 rounded-md transition-opacity hover:opacity-70 disabled:opacity-50"
                      style={{ color: "#991b1b", background: "#fee2e2" }}
                    >
                      {disconnecting === "gmail" ? "Disconnecting..." : "Disconnect"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOAuthConnect("gmail")}
                    disabled={connectingProvider === "gmail"}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    <GmailIcon />
                    {connectingProvider === "gmail" ? "Redirecting to Google..." : "Connect Gmail Account"}
                    <svg className="ml-auto h-4 w-4" style={{ color: "var(--color-text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}

                {/* ── Outlook ── */}
                {outlookConnection ? (
                  <div
                    className="flex items-center justify-between rounded-lg px-4 py-3"
                    style={{ background: "#d1fae5", border: "1px solid #6ee7b7" }}
                  >
                    <div className="flex items-center gap-3">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <circle cx="10" cy="10" r="9" fill="#065f46" />
                        <path d="M6 10 L9 13 L14 7" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <div>
                        <span className="text-sm font-medium" style={{ color: "#065f46" }}>Outlook connected</span>
                        <span className="text-xs ml-2" style={{ color: "#047857" }}>{outlookConnection.email}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleOAuthDisconnect("outlook")}
                      disabled={disconnecting === "outlook"}
                      className="text-xs font-medium px-3 py-1.5 rounded-md transition-opacity hover:opacity-70 disabled:opacity-50"
                      style={{ color: "#991b1b", background: "#fee2e2" }}
                    >
                      {disconnecting === "outlook" ? "Disconnecting..." : "Disconnect"}
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleOAuthConnect("outlook")}
                    disabled={connectingProvider === "outlook"}
                    className="w-full flex items-center gap-3 rounded-lg px-4 py-3.5 text-sm font-medium transition-all hover:shadow-md disabled:opacity-50"
                    style={{
                      background: "#fff",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  >
                    <OutlookIcon />
                    {connectingProvider === "outlook" ? "Redirecting to Microsoft..." : "Connect Outlook Account"}
                    <svg className="ml-auto h-4 w-4" style={{ color: "var(--color-text-tertiary)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* ── Sending limits warning ── */}
            <div
              className="mt-5 rounded-lg px-4 py-3 text-xs"
              style={{ background: "#fffbeb", border: "1px solid #fcd34d", color: "#92400e" }}
            >
              <div className="flex items-start gap-2">
                <svg className="shrink-0 mt-0.5" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1L13 12H1L7 1Z" stroke="#d97706" strokeWidth="1.2" fill="#fef3c7" />
                  <path d="M7 5.5V8" stroke="#d97706" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="7" cy="9.75" r="0.5" fill="#d97706" />
                </svg>
                <div>
                  <strong>Good to know:</strong> Personal Gmail accounts allow ~500 emails/day, Outlook allows ~300/day.
                  Emails from free accounts may land in the Promotions tab or spam for some recipients.
                  For highest deliverability and unlimited volume, use a{" "}
                  <button
                    onClick={() => setActiveTab("dns")}
                    className="underline font-semibold hover:opacity-70"
                    style={{ color: "#92400e" }}
                  >
                    Custom Domain
                  </button> instead.
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* TAB: CUSTOM DOMAIN (DNS)                              */}
      {/* ═══════════════════════════════════════════════════════ */}
      {activeTab === "dns" && (
        <div className="space-y-6">
          {/* ─── VISUAL STEP-BY-STEP GUIDE ─── */}
          <Card className="p-8">
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

          {/* ─── "WE'LL DO IT FOR YOU" UPSELL ─── */}
          <Card className="p-5" style={{ background: "linear-gradient(135deg, #f0f4ff 0%, #faf5ff 100%)", border: "1px solid var(--color-brand-light)" }}>
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-start gap-3">
                <span className="text-2xl shrink-0">🛠️</span>
                <div>
                  <p className="font-semibold text-sm">Too technical? We&apos;ll set it up for you</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
                    Our team will configure your DNS records and verify everything works — one-time $50 fee.
                  </p>
                </div>
              </div>
              <a
                href="mailto:support@recoverkit.dev?subject=DNS%20Setup%20Request%20(%2450)&body=Hi%2C%20I%E2%80%99d%20like%20help%20setting%20up%20DNS%20for%20my%20domain.%0A%0AMy%20domain%3A%20%0AMy%20DNS%20provider%20(e.g.%20GoDaddy%2C%20Cloudflare)%3A%20"
                className="shrink-0"
              >
                <Button variant="outline" size="sm">
                  Request Setup — $50
                </Button>
              </a>
            </div>
          </Card>

          {/* ─── ADD DOMAIN BUTTON / FORM ─── */}
          {!showAdd && (
            <div className="flex justify-end">
              <Button variant="primary" size="sm" onClick={() => setShowAdd(true)}>
                + Add Domain
              </Button>
            </div>
          )}

          {showAdd && (
            <Card className="p-6">
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

          {/* ─── DOMAIN LIST ─── */}
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
                                <span className="ml-1 font-normal" style={{ color: "var(--color-brand)" }}>&larr; copy this</span>
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
      )}
    </div>
  );
}
