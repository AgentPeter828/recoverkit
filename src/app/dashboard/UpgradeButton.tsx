"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface UpgradeButtonProps {
  priceId: string;
  planName: string;
  variant?: "primary" | "outline";
}

export function UpgradeButton({ priceId, planName, variant = "primary" }: UpgradeButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create checkout session");
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button
        variant={variant}
        onClick={handleCheckout}
        disabled={loading || !priceId}
        className="w-full"
      >
        {loading ? "Redirecting..." : `Upgrade to ${planName}`}
      </Button>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {!priceId && <p className="text-yellow-500 text-xs mt-1">Price not configured</p>}
    </div>
  );
}
