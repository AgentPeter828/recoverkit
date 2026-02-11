/**
 * Mock/Live data toggle.
 *
 * In the browser, users can toggle by adding ?mock=true to any URL,
 * or by setting localStorage key "firestorm_mock_mode" to "true".
 *
 * Server-side, check the NEXT_PUBLIC_MOCK_MODE env var.
 */

export function isMockMode(): boolean {
  // Server-side: check env
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_MOCK_MODE === "true";
  }

  // Client-side: check URL param first, then localStorage
  const params = new URLSearchParams(window.location.search);
  if (params.has("mock")) {
    const val = params.get("mock") === "true";
    localStorage.setItem("firestorm_mock_mode", String(val));
    return val;
  }

  return localStorage.getItem("firestorm_mock_mode") === "true";
}

export function setMockMode(enabled: boolean): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("firestorm_mock_mode", String(enabled));
  }
}
