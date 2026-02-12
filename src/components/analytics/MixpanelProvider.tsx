"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { analytics } from "@/lib/mixpanel";

/**
 * Mixpanel provider — tracks page views on route change.
 * Env-gated: does nothing when NEXT_PUBLIC_MIXPANEL_TOKEN is unset.
 */
export function MixpanelProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    analytics.pageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}
