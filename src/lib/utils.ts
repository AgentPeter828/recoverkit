/**
 * Merge class names. Simple utility — extend with clsx/tailwind-merge if needed.
 */
export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

/**
 * Format a price in cents to a display string.
 */
export function formatPrice(
  priceInCents: number,
  currency: string = "USD"
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(priceInCents / 100);
}

/**
 * Get the absolute URL for a path. Works in both server and client contexts.
 */
export function getAbsoluteUrl(path: string = ""): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "http://localhost:3000");
  return `${base}${path}`;
}

/**
 * Sleep utility for async operations.
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
