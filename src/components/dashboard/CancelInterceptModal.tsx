"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/lib/stripe/config";

interface CancelInterceptModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: Plan;
  downgradePlan?: Plan | null;
}

export function CancelInterceptModal({
  isOpen,
  onClose,
  currentPlan,
  downgradePlan,
}: CancelInterceptModalProps) {
  const router = useRouter();
  const [cancelling, setCancelling] = useState(false);
  const [downgrading, setDowngrading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"confirm" | "reason">("confirm");
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  async function handleCancel() {
    setCancelling(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to cancel subscription");
        return;
      }
      // Close modal and refresh — the billing page will show the cancellation state
      onClose();
      router.refresh();
      // Force a full reload so billing page re-fetches subscription
      window.location.reload();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setCancelling(false);
    }
  }

  async function handleDowngrade() {
    if (!downgradePlan?.priceId) return;
    setDowngrading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/change-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priceId: downgradePlan.priceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change plan");
        return;
      }
      onClose();
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setDowngrading(false);
    }
  }

  // What they lose on cancel
  const lossItems = [
    "All active recovery campaigns will stop",
    "Queued payment retries will be cancelled",
    "Custom email sequences will be deactivated",
    "You'll revert to Free (10 recoveries/month)",
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0, 0, 0, 0.5)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="w-full max-w-lg rounded-xl p-6 shadow-2xl"
        style={{ background: "#ffffff" }}
      >
        {step === "confirm" ? (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">😢</div>
              <h2 className="text-xl font-bold">Are you sure you want to cancel?</h2>
              <p className="text-sm mt-2" style={{ color: "var(--color-text-secondary)" }}>
                We&apos;d hate to see you go. Here&apos;s what happens if you cancel:
              </p>
            </div>

            {/* What they lose */}
            <div
              className="rounded-lg p-4 mb-6"
              style={{ background: "color-mix(in srgb, #ef4444 8%, transparent)" }}
            >
              <ul className="space-y-2">
                {lossItems.map((item) => (
                  <li key={item} className="text-sm flex items-start gap-2">
                    <span className="text-red-500 shrink-0">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Downgrade offer */}
            {downgradePlan && (
              <div
                className="rounded-lg p-4 mb-6 border-2"
                style={{ borderColor: "var(--color-brand)", background: "color-mix(in srgb, var(--color-brand) 6%, transparent)" }}
              >
                <h3 className="font-semibold text-sm mb-1">
                  💡 How about downgrading instead?
                </h3>
                <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  Switch to <strong>{downgradePlan.name}</strong> at just <strong>${downgradePlan.price}/mo</strong> — 
                  you keep your recovery campaigns running and save ${currentPlan.price - downgradePlan.price}/mo.
                </p>
                <Button
                  variant="primary"
                  size="sm"
                  className="mt-3 w-full"
                  onClick={handleDowngrade}
                  disabled={downgrading}
                >
                  {downgrading ? "Switching..." : `Downgrade to ${downgradePlan.name} — $${downgradePlan.price}/mo`}
                </Button>
              </div>
            )}

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={onClose}>
                Keep my plan
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                style={{ color: "#ef4444", borderColor: "#ef4444" }}
                onClick={() => setStep("reason")}
              >
                Continue cancelling
              </Button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold mb-2">One last thing...</h2>
            <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Can you tell us why you&apos;re leaving? This helps us improve.
            </p>

            <div className="space-y-2 mb-4">
              {[
                "Too expensive",
                "Not recovering enough payments",
                "Switching to another tool",
                "Shutting down my business",
                "Other",
              ].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-sm transition-colors"
                  style={{
                    background: reason === r ? "color-mix(in srgb, var(--color-brand) 10%, transparent)" : "var(--color-bg-secondary)",
                    border: reason === r ? "1px solid var(--color-brand)" : "1px solid transparent",
                  }}
                >
                  <input
                    type="radio"
                    name="cancel-reason"
                    value={r}
                    checked={reason === r}
                    onChange={() => setReason(r)}
                    className="accent-[var(--color-brand)]"
                  />
                  {r}
                </label>
              ))}
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep("confirm")}>
                ← Back
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                style={{ color: "#ef4444", borderColor: "#ef4444" }}
                onClick={handleCancel}
                disabled={cancelling || !reason}
              >
                {cancelling ? "Processing..." : "Cancel subscription"}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
