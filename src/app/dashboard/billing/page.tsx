"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CancelInterceptModal } from "@/components/dashboard/CancelInterceptModal";
import { UpgradeButton } from "../UpgradeButton";
import { plans } from "@/lib/stripe/config";
import type { Plan } from "@/lib/stripe/config";

interface SubscriptionData {
  stripe_subscription_id: string | null;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
}

export default function BillingPage() {
  const supabase = createBrowserClient();
  const router = useRouter();

  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelled, setCancelled] = useState(false);
  const [cancelMessage, setCancelMessage] = useState("");

  useEffect(() => {
    fetch("/api/stripe/subscription")
      .then((res) => res.json())
      .then((data) => {
        if (data.subscription) {
          setSubscription(data.subscription);
          if (data.subscription.cancel_at_period_end) {
            setCancelled(true);
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const currentPlan = subscription?.price_id
    ? plans.find((p) => p.priceId === subscription.price_id)
    : null;
  const currentPrice = currentPlan?.price ?? 0;
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";
  const upgradePlans = plans.filter((p) => p.price > currentPrice);

  // No downgrade option — cancel modal only
  const nextLowerPlan = null;

  const periodEndDate = subscription?.current_period_end
    ? new Date(subscription.current_period_end).toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl py-12 px-6">
        <p style={{ color: "var(--color-text-secondary)" }}>Loading billing info...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-12 px-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/dashboard/settings"
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          ← Settings
        </Link>
      </div>
      <h1 className="text-2xl font-bold mb-8">Billing & Plan</h1>

      {/* ─── CURRENT PLAN ─── */}
      <Card className="p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold mb-1">Current Plan</h2>
            <div className="flex items-center gap-3 mt-2">
              <span
                className="inline-block text-white text-sm font-semibold px-4 py-1.5 rounded-full"
                style={{ background: "var(--color-brand)" }}
              >
                {currentPlan?.name ?? "Trial"}
              </span>
              <span className="text-lg font-bold">
                {currentPlan ? `$${currentPlan.price} AUD/mo` : "Trial"}
              </span>
            </div>
            {isActive && currentPlan && (
              <div className="mt-3 space-y-1">
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Status:{" "}
                  <span
                    className="font-medium"
                    style={{
                      color: cancelled ? "#f59e0b" : "#16a34a",
                    }}
                  >
                    {cancelled ? "Cancelling at end of period" : subscription?.status === "trialing" ? "Trial" : "Active"}
                  </span>
                </p>
                {periodEndDate && (
                  <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                    {cancelled
                      ? `Access until: ${periodEndDate}`
                      : `Next billing date: ${periodEndDate}`}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cancelled confirmation banner */}
        {cancelled && (
          <div
            className="mt-4 p-4 rounded-lg"
            style={{ background: "color-mix(in srgb, #f59e0b 10%, transparent)" }}
          >
            <p className="text-sm font-medium" style={{ color: "#92400e" }}>
              Your subscription has been cancelled. You&apos;ll keep full access to all {currentPlan?.name} features until <strong>{periodEndDate}</strong>. After that, you&apos;ll be moved to the Trial plan.
            </p>
          </div>
        )}

        {cancelMessage && !cancelled && (
          <p className="mt-3 text-sm text-green-600">{cancelMessage}</p>
        )}

        {/* Plan features */}
        {currentPlan && (
          <div className="mt-5 pt-4" style={{ borderTop: "1px solid var(--color-border)" }}>
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--color-text-secondary)" }}>
              Included in your plan
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {currentPlan.features.map((f) => (
                <li key={f} className="text-sm flex items-center gap-2">
                  <span style={{ color: "var(--color-brand)" }}>✓</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Card>

      {/* ─── UPGRADE OPTIONS ─── */}
      {upgradePlans.length > 0 && (
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Upgrade your plan</h2>
          <div className={`grid grid-cols-1 gap-4 ${upgradePlans.length >= 3 ? "sm:grid-cols-3" : upgradePlans.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-sm"}`}>
            {upgradePlans.map((plan) => (
              <Card
                key={plan.name}
                className={`p-4 ${plan.highlighted ? "ring-2" : ""}`}
                style={plan.highlighted ? { borderColor: "var(--color-brand)" } : undefined}
              >
                <h3 className="font-semibold">{plan.name}</h3>
                <p className="text-2xl font-bold mt-1">
                  ${plan.price}
                  <span className="text-sm font-normal">/mo</span>
                </p>
                <ul className="mt-3 space-y-1">
                  {plan.features.slice(0, 3).map((f) => (
                    <li key={f} className="text-xs flex items-center gap-1">
                      <span style={{ color: "var(--color-brand)" }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <UpgradeButton
                    priceId={plan.priceId}
                    planName={plan.name}
                    currentPlanPrice={currentPrice}
                    targetPlanPrice={plan.price}
                    hasSubscription={isActive && !!subscription?.stripe_subscription_id}
                    variant={plan.highlighted ? "primary" : "outline"}
                  />
                </div>
              </Card>
            ))}
          </div>
        </Card>
      )}

      {/* ─── CANCEL SECTION ─── */}
      {isActive && currentPlan && !cancelled && (
        <Card className="p-6">
          <h2 className="text-sm font-medium mb-2" style={{ color: "var(--color-text-secondary)" }}>
            Cancel subscription
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
            If you cancel, your {currentPlan.name} plan stays active until <strong>{periodEndDate ?? "the end of your billing period"}</strong>. After that you&apos;ll be on the Trial plan (10 recoveries/month).
          </p>
          <button
            className="text-sm underline cursor-pointer"
            style={{ color: "#ef4444" }}
            onClick={() => setShowCancelModal(true)}
          >
            Cancel my subscription
          </button>
        </Card>
      )}

      {/* No subscription */}
      {!isActive && !currentPlan && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          You&apos;re on the Trial plan. Choose an upgrade above to unlock more recoveries and features.
        </p>
      )}

      {/* Cancel intercept modal */}
      {currentPlan && (
        <CancelInterceptModal
          isOpen={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          currentPlan={currentPlan}
          downgradePlan={nextLowerPlan}
        />
      )}
    </div>
  );
}
