"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function ManageButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePortal() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to open billing portal");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError("No portal URL returned — is Stripe configured?");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Button variant="outline" onClick={handlePortal} disabled={loading}>
        {loading ? "Loading..." : "Manage Subscription"}
      </Button>
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
}
