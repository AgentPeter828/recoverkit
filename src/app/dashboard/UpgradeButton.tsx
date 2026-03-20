"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { analytics } from "@/lib/mixpanel";

interface UpgradeButtonProps {
  priceId: string;
  planName: string;
  currentPlanPrice?: number;
  targetPlanPrice?: number;
  hasSubscription?: boolean;
  variant?: "primary" | "outline";
}

export function UpgradeButton({
  priceId,
  planName,
  currentPlanPrice = 0,
  targetPlanPrice = 0,
  hasSubscription = false,
  variant = "primary",
}: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  async function handlePlanChange() {
    setLoading(true);
    setError(null);
    setMessage(null);

    analytics.track("plan_selected", { priceId });

    try {
      if (hasSubscription) {
        // Existing subscriber → change plan
        const res = await fetch("/api/stripe/change-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });

        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to change plan");
          return;
        }

        setMessage(data.message);
        // Refresh the page after a short delay to show new plan
        setTimeout(() => router.refresh(), 2000);
      } else {
        // First-time subscriber → Stripe Checkout
        const res = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ priceId }),
        });

        const data = await res.json();

        if (!res.ok) {
          // If they already have a subscription, retry as plan change
          if (data.useChangePlan) {
            const retryRes = await fetch("/api/stripe/change-plan", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ priceId }),
            });
            const retryData = await retryRes.json();
            if (!retryRes.ok) {
              setError(retryData.error || "Failed to change plan");
              return;
            }
            setMessage(retryData.message);
            setTimeout(() => router.refresh(), 2000);
            return;
          }
          setError(data.error || "Failed to create checkout session");
          return;
        }

        if (data.url) {
          window.location.href = data.url;
        }
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const buttonLabel = loading
    ? "Processing..."
    : `Upgrade to ${planName}`;

  return (
    <div>
      <Button
        variant={variant}
        onClick={handlePlanChange}
        disabled={loading || !priceId}
        className="w-full"
      >
        {buttonLabel}
      </Button>
      {message && <p className="text-green-600 text-xs mt-1">{message}</p>}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {!priceId && <p className="text-yellow-500 text-xs mt-1">Price not configured</p>}
    </div>
  );
}
