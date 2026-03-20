"use client";

import { useState, useEffect, useCallback } from "react";
import { ConsentContext, getConsent, setConsent, type ConsentStatus } from "@/lib/consent";

/**
 * Cookie consent provider + banner.
 * Wraps children with ConsentContext so analytics providers can check consent.
 */
export function CookieConsentProvider({ children }: { children: React.ReactNode }) {
  const [consent, setConsentState] = useState<ConsentStatus>("pending");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConsentState(getConsent());
    setMounted(true);
  }, []);

  const accept = useCallback(() => {
    setConsent("accepted");
    setConsentState("accepted");
  }, []);

  const reject = useCallback(() => {
    setConsent("rejected");
    setConsentState("rejected");
  }, []);

  return (
    <ConsentContext.Provider value={{ consent, accept, reject }}>
      {children}
      {mounted && consent === "pending" && <CookieBanner onAccept={accept} onReject={reject} />}
    </ConsentContext.Provider>
  );
}

function CookieBanner({ onAccept, onReject }: { onAccept: () => void; onReject: () => void }) {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4"
      style={{ background: "rgba(0,0,0,0.03)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="mx-auto max-w-3xl rounded-xl border px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg"
        style={{
          background: "var(--color-bg, #fff)",
          borderColor: "var(--color-border, #e5e7eb)",
        }}
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium" style={{ color: "var(--color-text, #111)" }}>
            🍪 We use cookies to improve your experience
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-secondary, #6b7280)" }}>
            We use analytics cookies to understand how you use RecoverKit so we can make it better.
            Essential cookies for authentication are always active.{" "}
            <a href="/privacy" className="underline hover:opacity-70">Privacy Policy</a>
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={onReject}
            className="px-4 py-2 rounded-lg text-sm font-medium border transition-colors hover:bg-black/5"
            style={{
              borderColor: "var(--color-border, #e5e7eb)",
              color: "var(--color-text-secondary, #6b7280)",
            }}
          >
            Reject
          </button>
          <button
            onClick={onAccept}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors hover:opacity-90"
            style={{ background: "var(--color-brand, #6366f1)" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
