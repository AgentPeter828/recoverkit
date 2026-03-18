"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { isMockMode } from "@/lib/mock/config";
import { mockStripeConnection } from "@/lib/mock/data";
import { createBrowserClient } from "@/lib/supabase/client";
import { analytics } from "@/lib/mixpanel";
import { HowItWorks } from "@/components/dev/HowItWorks";
import { getStoredUTMParams } from "@/lib/utm";

interface StripeConnection {
  id: string;
  stripe_account_id: string;
  business_name: string | null;
  livemode: boolean;
  connected_at: string;
}

/* ─── Inline SVG Illustrations ─── */

function ClickButtonIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="26" width="44" height="20" rx="10" fill="var(--color-brand-50)" stroke="var(--color-brand)" strokeWidth="2" />
      <text x="36" y="39" fontSize="9" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="600" textAnchor="middle">Connect</text>
      <path d="M48 18 C50 16, 54 18, 52 22 L48 30 L44 28 L48 20Z" fill="var(--color-text-secondary)" />
      <path d="M48 30 L44 28 L43 32 L44 34 L46 35 L48 34 L50 35 L51 33 L48 30Z" fill="var(--color-text-secondary)" />
    </svg>
  );
}

function StripeRedirectIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="4" y="20" width="26" height="32" rx="5" stroke="var(--color-brand)" strokeWidth="1.5" fill="var(--color-brand-50)" />
      <text x="17" y="40" fontSize="8" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="700" textAnchor="middle">RK</text>
      <path d="M33 36 L39 36" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" />
      <path d="M37 32 L41 36 L37 40" stroke="var(--color-brand)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="42" y="20" width="26" height="32" rx="5" stroke="#635bff" strokeWidth="1.5" fill="#f0efff" />
      <text x="55" y="40" fontSize="10" fill="#635bff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">S</text>
    </svg>
  );
}

function LoginScreenIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="14" width="40" height="44" rx="6" stroke="var(--color-border)" strokeWidth="2" fill="var(--color-bg-secondary)" />
      <circle cx="36" cy="28" r="7" stroke="#635bff" strokeWidth="1.5" fill="#f0efff" />
      <circle cx="36" cy="26" r="3" fill="#635bff" />
      <path d="M30 33 C30 30, 42 30, 42 33" stroke="#635bff" strokeWidth="1.5" />
      <rect x="24" y="40" width="24" height="5" rx="2.5" stroke="var(--color-border)" strokeWidth="1" fill="var(--color-bg)" />
      <rect x="24" y="48" width="24" height="5" rx="2.5" fill="#635bff" />
      <text x="36" y="53" fontSize="4" fill="#fff" fontFamily="system-ui" fontWeight="600" textAnchor="middle">Log in</text>
    </svg>
  );
}

function AllowConnectIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="22" cy="36" r="14" stroke="var(--color-brand)" strokeWidth="1.5" fill="var(--color-brand-50)" />
      <text x="22" y="40" fontSize="8" fill="var(--color-brand)" fontFamily="system-ui" fontWeight="700" textAnchor="middle">RK</text>
      <circle cx="50" cy="36" r="14" stroke="#635bff" strokeWidth="1.5" fill="#f0efff" />
      <text x="50" y="40" fontSize="10" fill="#635bff" fontFamily="system-ui" fontWeight="700" textAnchor="middle">S</text>
      {/* Connecting line with checkmark */}
      <line x1="36" y1="36" x2="36" y2="36" stroke="none" />
      <circle cx="36" cy="36" r="7" fill="#22c55e" />
      <path d="M32.5 36 L35 38.5 L39.5 33.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CelebrationIllustration() {
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="36" cy="36" r="18" stroke="#22c55e" strokeWidth="2" fill="#d1fae5" />
      <path d="M26 36 L32 42 L46 28" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* Confetti */}
      <rect x="16" y="14" width="4" height="4" rx="1" fill="var(--color-brand)" transform="rotate(15 16 14)" opacity="0.7" />
      <rect x="52" y="12" width="3" height="3" rx="1" fill="#f59e0b" transform="rotate(-20 52 12)" opacity="0.7" />
      <rect x="56" y="28" width="4" height="4" rx="1" fill="#ec4899" transform="rotate(30 56 28)" opacity="0.7" />
      <rect x="10" y="32" width="3" height="3" rx="1" fill="#22c55e" transform="rotate(-10 10 32)" opacity="0.7" />
      <rect x="50" y="52" width="4" height="4" rx="1" fill="var(--color-brand-light)" transform="rotate(20 50 52)" opacity="0.7" />
      <rect x="18" y="54" width="3" height="3" rx="1" fill="#f59e0b" transform="rotate(-25 18 54)" opacity="0.7" />
      <circle cx="24" cy="18" r="2" fill="#ec4899" opacity="0.5" />
      <circle cx="48" cy="56" r="2" fill="#22c55e" opacity="0.5" />
    </svg>
  );
}

function ConnectedSuccessIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="40" cy="40" r="30" fill="#d1fae5" />
      <circle cx="40" cy="40" r="20" fill="#22c55e" />
      <path d="M30 40 L37 47 L52 32" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="40" r="34" stroke="#22c55e" strokeWidth="1" strokeDasharray="4 4" opacity="0.4" />
    </svg>
  );
}

function StepNumber({ number }: { number: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{
        width: 44,
        height: 44,
        background: "var(--color-brand)",
        color: "#fff",
        fontSize: 20,
        fontWeight: 700,
      }}
    >
      {number}
    </div>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-6 py-12"><Card className="p-8 animate-pulse"><div className="h-6 w-48 bg-gray-200 rounded mb-4" /></Card></div>}>
      <ConnectPageInner />
    </Suspense>
  );
}

function ConnectPageInner() {
  const searchParams = useSearchParams();
  const [connection, setConnection] = useState<StripeConnection | null>(null);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);

  const success = searchParams.get("success");
  const error = searchParams.get("error");

  useEffect(() => {
    async function fetchConnection() {
      if (isMockMode()) {
        setConnection(mockStripeConnection as StripeConnection);
        setLoading(false);
        return;
      }

      try {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
          .from("rk_stripe_connections")
          .select("*")
          .eq("user_id", user.id)
          .single();

        setConnection(data);
      } catch (err) {
        console.error("Failed to fetch connection:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchConnection();
    if (success) {
      analytics.track("first_action", { action: "connected_stripe", ...getStoredUTMParams() });
    }
  }, [success]);

  async function handleConnect() {
    setConnecting(true);
    analytics.featureUsed("stripe_connect_started");
    try {
      const res = await fetch("/api/stripe-connect");
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Failed to get OAuth URL:", err);
      setConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!confirm("Are you sure you want to disconnect your Stripe account? This will stop all active recovery campaigns.")) return;

    try {
      const res = await fetch("/api/stripe-connect", { method: "DELETE" });
      if (res.ok) {
        setConnection(null);
      }
    } catch (err) {
      console.error("Failed to disconnect:", err);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <Card className="p-8 animate-pulse">
          <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
          <div className="h-4 w-72 bg-gray-200 rounded" />
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">Stripe Connection</h1>
        <HowItWorks section="connect" />
      </div>

      {success && (
        <div className="mb-6 rounded-lg overflow-hidden" style={{ background: "#d1fae5", color: "#065f46" }}>
          <div className="p-4 flex items-center gap-3">
            <CelebrationIllustration />
            <div>
              <p className="font-semibold">Stripe account connected successfully!</p>
              <p className="text-sm mt-1">You&apos;re all set — RecoverKit will now watch for failed payments.</p>
            </div>
          </div>
          <div className="px-4 pb-4">
            <a href="/dashboard/sequences">
              <Button variant="primary" size="lg" style={{ width: "100%" }}>
                Next: Set up your recovery emails →
              </Button>
            </a>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: "#fee2e2", color: "#991b1b" }}>
          {error === "stripe_account_taken" ? (
            <>
              <p className="font-semibold">This Stripe account is already connected to another RecoverKit account.</p>
              <p className="text-sm mt-1">If you can&apos;t access that account, please contact support so we can help resolve this.</p>
            </>
          ) : (
            <>Connection failed: {error}</>
          )}
        </div>
      )}

      {connection ? (
        /* ─── CONNECTED STATE ─── */
        <Card className="p-8">
          <div className="flex flex-col items-center text-center mb-6">
            <ConnectedSuccessIllustration />
            <h2 className="text-xl font-bold mt-4">Connected to Stripe</h2>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
              {connection.business_name || connection.stripe_account_id}
            </p>
          </div>

          <div
            className="rounded-lg p-4 mb-6"
            style={{ background: "#d1fae5", color: "#065f46" }}
          >
            <p className="text-sm text-center">
              RecoverKit is watching your Stripe account for failed payments and will automatically start recovery emails.
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-text-secondary)" }}>Account ID</span>
              <code className="text-xs px-2 py-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>
                {connection.stripe_account_id}
              </code>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-text-secondary)" }}>Mode</span>
              <span className={connection.livemode ? "text-green-600 font-semibold" : "text-yellow-600"}>
                {connection.livemode ? "Live" : "Test"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--color-text-secondary)" }}>Connected</span>
              <span>{new Date(connection.connected_at).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="pt-4 border-t" style={{ borderColor: "var(--color-border)" }}>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} style={{ color: "#ef4444" }}>
              Disconnect Account
            </Button>
          </div>
        </Card>
      ) : (
        /* ─── NOT CONNECTED STATE ─── */
        <>
          {/* Visual step-by-step explainer */}
          <Card className="p-8 mb-6">
            <h2 className="text-lg font-bold mb-2 text-center">Here&apos;s what happens when you connect</h2>
            <p className="text-sm text-center mb-8" style={{ color: "var(--color-text-secondary)" }}>
              It takes about 2 minutes — and it&apos;s completely free
            </p>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-center gap-4">
                <StepNumber number={1} />
                <ClickButtonIllustration />
                <div>
                  <p className="font-semibold text-sm">Click the &quot;Connect&quot; button below</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>That&apos;s all you do on this page!</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-center gap-4">
                <StepNumber number={2} />
                <StripeRedirectIllustration />
                <div>
                  <p className="font-semibold text-sm">You&apos;ll be taken to Stripe&apos;s website</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Stripe is a secure, trusted payment platform used by millions</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-center gap-4">
                <StepNumber number={3} />
                <LoginScreenIllustration />
                <div>
                  <p className="font-semibold text-sm">Log in to your Stripe account</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Use your existing Stripe credentials to sign in</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-center gap-4">
                <StepNumber number={4} />
                <AllowConnectIllustration />
                <div>
                  <p className="font-semibold text-sm">Click &quot;Allow&quot; to connect</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>This lets RecoverKit see your failed payments so we can help recover them</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex items-center gap-4">
                <StepNumber number={5} />
                <CelebrationIllustration />
                <div>
                  <p className="font-semibold text-sm">You&apos;re done! You come back here automatically</p>
                  <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>Stripe sends you right back to RecoverKit — nothing else to do</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Connect button */}
          <Card className="p-8 text-center mb-6">
            <h2 className="text-xl font-semibold mb-2">Ready to connect?</h2>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
              Click below and follow the steps on Stripe&apos;s website
            </p>
            <Button variant="primary" size="lg" onClick={handleConnect} disabled={connecting}>
              {connecting ? "Redirecting to Stripe..." : "Connect with Stripe →"}
            </Button>
          </Card>

          {/* Reassurance messages */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className="rounded-lg p-4 text-center"
              style={{ background: "var(--color-bg-secondary)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2">
                <circle cx="16" cy="16" r="12" stroke="#22c55e" strokeWidth="1.5" fill="#d1fae5" />
                <text x="16" y="20" fontSize="12" fill="#22c55e" fontFamily="system-ui" fontWeight="600" textAnchor="middle">$0</text>
              </svg>
              <p className="text-xs font-semibold">Completely free</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>No cost to connect</p>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{ background: "var(--color-bg-secondary)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2">
                <rect x="8" y="14" width="16" height="12" rx="3" stroke="var(--color-brand)" strokeWidth="1.5" fill="var(--color-brand-50)" />
                <path d="M12 14 V10 C12 7.8 13.8 6 16 6 C18.2 6 20 7.8 20 10 V14" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" />
                <circle cx="16" cy="20" r="1.5" fill="var(--color-brand)" />
              </svg>
              <p className="text-xs font-semibold">Your data stays safe</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>We never see your password</p>
            </div>
            <div
              className="rounded-lg p-4 text-center"
              style={{ background: "var(--color-bg-secondary)" }}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="mx-auto mb-2">
                <circle cx="16" cy="16" r="12" stroke="var(--color-brand-light)" strokeWidth="1.5" fill="var(--color-brand-50)" />
                <path d="M11 16 L16 16 L16 10" stroke="var(--color-brand)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="text-xs font-semibold">Disconnect anytime</p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>One click to remove</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
