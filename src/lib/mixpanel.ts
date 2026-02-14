import mixpanel from "mixpanel-browser";

const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
const isEnabled = typeof window !== "undefined" && !!token;

if (isEnabled) {
  mixpanel.init(token!, {
    track_pageview: false, // we handle this manually on route change
    persistence: "localStorage",
    ignore_dnt: false,
  });
}

/**
 * Mixpanel analytics helpers — env-gated.
 *
 * If NEXT_PUBLIC_MIXPANEL_TOKEN is not set, all calls are no-ops.
 */
export const analytics = {
  track(event: string, properties?: Record<string, unknown>) {
    if (!isEnabled) return;
    mixpanel.track(event, properties);
  },

  identify(userId: string, traits?: Record<string, unknown>) {
    if (!isEnabled) return;
    mixpanel.identify(userId);
    if (traits) {
      mixpanel.people.set(traits);
    }
  },

  reset() {
    if (!isEnabled) return;
    mixpanel.reset();
  },

  // --- Pre-defined events ---

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

  // --- RecoverKit product-specific events ---

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
