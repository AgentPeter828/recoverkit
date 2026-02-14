/**
 * Server-side Mixpanel tracking for API routes.
 * Uses the Mixpanel HTTP API directly (no browser SDK).
 */
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export async function trackServerEvent(
  event: string,
  properties?: Record<string, unknown>,
  distinctId?: string
) {
  if (!MIXPANEL_TOKEN) return;

  try {
    const payload = {
      event,
      properties: {
        token: MIXPANEL_TOKEN,
        distinct_id: distinctId || "server",
        ...properties,
      },
    };

    await fetch("https://api.mixpanel.com/track", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "text/plain" },
      body: JSON.stringify([payload]),
    });
  } catch {
    // Non-critical — don't break the request
  }
}
