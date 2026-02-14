/**
 * UTM parameter capture and retrieval.
 * Stores first-touch UTM params in localStorage on page load.
 */

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content"] as const;
const STORAGE_KEY = "firestorm_utm";

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_first_touch_at?: string;
}

/** Call on page load to capture UTM params from the URL (first-touch only). */
export function captureUTMParams(): void {
  if (typeof window === "undefined") return;

  const existing = localStorage.getItem(STORAGE_KEY);
  if (existing) return; // first-touch only — don't overwrite

  const url = new URL(window.location.href);
  const params: Record<string, string> = {};
  let hasAny = false;

  for (const key of UTM_KEYS) {
    const val = url.searchParams.get(key);
    if (val) {
      params[key] = val;
      hasAny = true;
    }
  }

  if (hasAny) {
    params.utm_first_touch_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(params));
  }
}

/** Retrieve stored UTM params (returns empty object if none). */
export function getStoredUTMParams(): UTMParams {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
