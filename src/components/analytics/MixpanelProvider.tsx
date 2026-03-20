"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/mixpanel";
import { getStoredUTMParams } from "@/lib/utm";
import { useConsent } from "@/lib/consent";

/**
 * Mixpanel provider — tracks page views on route change.
 * Gated behind cookie consent + env var.
 */
export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { consent } = useConsent();

  useEffect(() => {
    if (consent !== "accepted") return;
    const utm = getStoredUTMParams();
    analytics.track("page_view", { path: pathname, ...utm });
  }, [pathname, consent]);

  return <>{children}</>;
}
