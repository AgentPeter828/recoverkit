"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/mixpanel";
import { getStoredUTMParams } from "@/lib/utm";

/**
 * Mixpanel provider — tracks page views on route change.
 * Env-gated: does nothing when NEXT_PUBLIC_MIXPANEL_TOKEN is unset.
 */
export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const utm = getStoredUTMParams();
    analytics.track("page_view", { path: pathname, ...utm });
  }, [pathname]);

  return <>{children}</>;
}
