"use client";

import { useEffect } from "react";

interface PostHogProviderProps {
  children: React.ReactNode;
}

/**
 * PostHog analytics provider — env-gated.
 *
 * To enable, install posthog-js (`npm install posthog-js`) and set the
 * NEXT_PUBLIC_POSTHOG_KEY and NEXT_PUBLIC_POSTHOG_HOST environment variables.
 */
export function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!key || !host) return;

    // Dynamically load PostHog only when env vars are set and the package is installed
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
        // Install with: npm install posthog-js
      }
    })();
  }, []);

  return <>{children}</>;
}
