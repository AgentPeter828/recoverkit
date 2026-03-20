import mixpanel from "mixpanel-browser";
import { hasAnalyticsConsent } from "./consent";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

let initialized = false;

function ensureInit() {
  if (initialized) return true;
  if (typeof window === "undefined" || !token) return false;
  if (!hasAnalyticsConsent()) return false;

  mixpanel.init(token, {
    track_pageview: false,
    persistence: "localStorage",
    ignore_dnt: false,
  });
  initialized = true;
  return true;
}

/**
 * Mixpanel analytics helpers — gated behind cookie consent + env var.
 * All calls are no-ops until consent is granted.
 */
export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    if (!ensureInit()) return;
    mixpanel.track(event, properties);
  },

  identify(userId: string, traits?: Record<string, unknown>) {
    if (!ensureInit()) return;
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  },

  reset() {
    if (!ensureInit()) return;
    mixpanel.reset();
  },

  pageView(path: string) {
    this.track("Page Viewed", { path });
  },

  signUp(userId: string, email?: string) {
    this.identify(userId, email ? { email } : undefined);
    this.track("Sign Up");
  },

  login(userId: string, email?: string) {
    this.identify(userId, email ? { email } : undefined);
    this.track("Login");
  },

  subscriptionStarted(plan?: string, priceId?: string) {
    this.track("Subscription Started", { plan, price_id: priceId });
  },

  featureUsed(feature: string, properties?: Record<string, unknown>) {
    this.track("Feature Used", { feature, ...properties });
  },

  ctaClicked(label: string, location?: string) {
    this.track("CTA Clicked", { label, location });
  },

  paymentFailedDetected(properties?: {
    amount?: number;
    currency?: string;
    customer_email?: string;
    failure_code?: string;
  }) {
    this.track("payment_failed_detected", properties);
  },

  dunningEmailSent(properties?: {
    step_number?: number;
    campaign_id?: string;
    customer_email?: string;
    subject?: string;
    is_ai_generated?: boolean;
  }) {
    this.track("dunning_email_sent", properties);
  },

  paymentRecovered(properties?: {
    amount?: number;
    currency?: string;
    campaign_id?: string;
    recovery_method?: string;
    days_to_recover?: number;
  }) {
    this.track("payment_recovered", properties);
  },
};
