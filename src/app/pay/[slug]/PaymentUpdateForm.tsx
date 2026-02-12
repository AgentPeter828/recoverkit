"use client";

import { useState } from "react";
import { analytics } from "@/lib/mixpanel";

interface PaymentUpdateFormProps {
  brandColor: string;
  pageId: string;
}

export function PaymentUpdateForm({ brandColor, pageId }: PaymentUpdateFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    analytics.featureUsed("payment_updated", { page_id: pageId });

    try {
      // In production, this would create a Stripe SetupIntent or redirect to Stripe's
      // hosted payment method update page. For MVP, we simulate the flow.
      const res = await fetch("/api/payment-pages/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId }),
      });

      if (res.ok) {
        setStatus("success");
      } else {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-xl font-semibold text-gray-900">Payment Method Updated!</h2>
        <p className="text-gray-600 mt-2 text-sm">
          Thank you! Your subscription will continue without interruption.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="p-3 rounded-lg text-sm" style={{ background: "#fee2e2", color: "#991b1b" }}>
          {errorMsg}
        </div>
      )}

      <p className="text-sm text-gray-600 text-center">
        Click below to securely update your payment method via Stripe.
      </p>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
        style={{ background: brandColor }}
      >
        {status === "loading" ? "Redirecting to Stripe..." : "Update Payment Method"}
      </button>
    </form>
  );
}
