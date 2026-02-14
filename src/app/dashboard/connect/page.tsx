"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { isMockMode } from "@/lib/mock/config";
import { mockStripeConnection } from "@/lib/mock/data";
import { createBrowserClient } from "@/lib/supabase/client";
import { analytics } from "@/lib/mixpanel";
import { getStoredUTMParams } from "@/lib/utm";

interface StripeConnection {
  id: string;
  stripe_account_id: string;
  business_name: string | null;
  livemode: boolean;
  connected_at: string;
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
          .from("stripe_connections")
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
      <h1 className="text-2xl font-bold mb-6">Stripe Connection</h1>

      {success && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: "#d1fae5", color: "#065f46" }}>
          ✅ Stripe account connected successfully!
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-lg" style={{ background: "#fee2e2", color: "#991b1b" }}>
          ❌ Connection failed: {error}
        </div>
      )}

      {connection ? (
        <Card className="p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl" style={{ background: "#d1fae5" }}>
              ⚡
            </div>
            <div>
              <h2 className="text-lg font-semibold">Connected to Stripe</h2>
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                {connection.business_name || connection.stripe_account_id}
              </p>
            </div>
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
            <p className="text-sm mb-3" style={{ color: "var(--color-text-secondary)" }}>
              RecoverKit is monitoring your Stripe account for failed payments and automatically creating recovery campaigns.
            </p>
            <Button variant="ghost" size="sm" onClick={handleDisconnect} style={{ color: "#ef4444" }}>
              Disconnect Account
            </Button>
          </div>
        </Card>
      ) : (
        <Card className="p-8 text-center">
          <div className="text-5xl mb-4">🔗</div>
          <h2 className="text-xl font-semibold mb-2">Connect Your Stripe Account</h2>
          <p className="mb-6" style={{ color: "var(--color-text-secondary)" }}>
            RecoverKit needs access to your Stripe account to detect failed payments
            and retry them automatically. We use Stripe Connect (OAuth) for secure access.
          </p>
          <div className="space-y-4">
            <Button variant="primary" size="lg" onClick={handleConnect} disabled={connecting}>
              {connecting ? "Redirecting to Stripe..." : "Connect with Stripe →"}
            </Button>
            <div className="flex items-center justify-center gap-6 text-xs" style={{ color: "var(--color-text-secondary)" }}>
              <span>🔒 Secure OAuth</span>
              <span>📖 Read-write access</span>
              <span>🔄 Revoke anytime</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
