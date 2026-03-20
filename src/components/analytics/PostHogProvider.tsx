"use client";

import { useEffect } from "react";
import { useConsent } from "@/lib/consent";

interface PostHogProviderProps {
  children: React.ReactNode;
}

/**
 * PostHog analytics provider — gated behind cookie consent + env vars.
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  const { consent } = useConsent();

  useEffect(() => {
    if (consent !== "accepted") return;

    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
    if (!key || !host) return;

    (async () => {
      try {
        // @ts-expect-error — posthog-js is an optional dependency
        const posthog = await import("posthog-js");
        posthog.default.init(key, {
          api_host: host,
          person_profiles: "identified_only",
          capture_pageview: true,
          capture_pageleave: true,
        });
      } catch {
        // PostHog not installed — skip silently.
      }
    })();
  }, [consent]);

  return <>{children}</>;
}
