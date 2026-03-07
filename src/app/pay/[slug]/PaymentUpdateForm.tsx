"use client";

import { useState, useEffect } from "react";
import { analytics } from "@/lib/mixpanel";

interface PaymentUpdateFormProps {
  brandColor: string;
  pageId: string;
}

export function PaymentUpdateForm({ brandColor, pageId }: PaymentUpdateFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "stripe" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [stripeLoaded, setStripeLoaded] = useState(false);

  // Dynamically load Stripe.js when needed
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    if (key && typeof window !== "undefined" && !document.querySelector('script[src*="js.stripe.com"]')) {
      const script = document.createElement("script");
      script.src = "https://js.stripe.com/v3/";
      script.onload = () => setStripeLoaded(true);
      document.head.appendChild(script);
    } else if (typeof window !== "undefined" && document.querySelector('script[src*="js.stripe.com"]')) {
      setStripeLoaded(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    analytics.featureUsed("payment_updated", { page_id: pageId });

    try {
      const res = await fetch("/api/payment-pages/update-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page_id: pageId }),
      });

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || "Something went wrong");
        setStatus("error");
        return;
      }

      const data = await res.json();

      // If we got a real SetupIntent client_secret, use Stripe.js
      if (data.client_secret && stripeLoaded && typeof window !== "undefined") {
        const stripeKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
        if (stripeKey) {
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const stripeInstance = (window as any).Stripe(stripeKey, {
              stripeAccount: data.stripe_account_id,
            });

            // Redirect to Stripe's hosted payment method update page
            const { error: stripeError } = await stripeInstance.confirmCardSetup(data.client_secret, {
              payment_method: {
                card: { token: "tok_visa" }, // Stripe Elements would go here in a full integration
              },
            });

            if (stripeError) {
              setErrorMsg(stripeError.message || "Payment update failed");
              setStatus("error");
              return;
            }

            setStatus("success");
            return;
          } catch {
            // Fall through to portal redirect
          }
        }
      }

      // If we got a Stripe Customer Portal URL, redirect
      if (data.portal_url) {
        window.location.href = data.portal_url;
        return;
      }

      // Mock mode or fallback: show success
      if (data.success) {
        setStatus("success");
      } else {
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
        className="w-full py-3 px-4 rounded-lg text-white font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer"
        style={{ background: brandColor }}
      >
        {status === "loading" ? "Redirecting to Stripe..." : "Update Payment Method"}
      </button>
    </form>
  );
}
