/**
 * Mock data for testing the full app without live API calls.
 *
 * Uses a realistic example company: "CloudPulse" — a SaaS monitoring tool
 * charging $49-249 USD/mo. This lets us see RecoverKit through a real
 * customer's eyes.
 */

// ─── The Example Company ───
export const DEMO_COMPANY = {
  name: "CloudPulse",
  domain: "cloudpulse.io",
  tagline: "Infrastructure monitoring for growing teams",
  billingEmail: "billing@cloudpulse.io",
  brandColor: "#0ea5e9",
  plans: [
    { name: "Starter", price: 49 },
    { name: "Team", price: 99 },
    { name: "Business", price: 249 },
  ],
};

export const mockUser = {
  id: "mock-user-id-123",
  email: "sarah@cloudpulse.io",
  user_metadata: {
    full_name: "Sarah Chen",
  },
  created_at: "2026-01-15T10:00:00Z",
};

export const mockSubscription = {
  id: "mock-sub-id",
  user_id: "mock-user-id-123",
  stripe_customer_id: "cus_mock123",
  stripe_subscription_id: "sub_mock123",
  status: "active",
  price_id: "price_mock_growth",
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancel_at_period_end: false,
  created_at: "2026-01-15T10:00:00Z",
  updated_at: new Date().toISOString(),
};

export const mockPlans = [
  {
    name: "Starter",
    description: "100 recoveries/month",
    price: 29,
    priceId: "price_mock_starter",
    features: [
      "100 recovery attempts/month",
      "Smart retry scheduling",
      "Email sequence builder (3 sequences)",
      "Recovery dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    description: "500 recoveries/month + AI emails",
    price: 79,
    priceId: "price_mock_growth",
    features: [
      "500 recovery attempts/month",
      "AI-generated email templates",
      "Custom branding",
      "Priority retry timing",
      "Email sequence builder (10 sequences)",
      "Custom email domain",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    description: "Unlimited recoveries + analytics",
    price: 149,
    priceId: "price_mock_scale",
    features: [
      "Unlimited recovery attempts",
      "Priority retry scheduling",
      "Advanced analytics",
      "Custom payment pages",
      "API access",
      "Priority support",
    ],
    highlighted: false,
  },
];

export const mockCheckoutUrl = "https://checkout.stripe.com/mock-test-session";
export const mockPortalUrl = "https://billing.stripe.com/mock-portal";

export const mockStripeConnection = {
  id: "mock-conn-1",
  stripe_account_id: "acct_mock_cloudpulse",
  business_name: "CloudPulse",
  livemode: false,
  connected_at: "2026-02-01T10:00:00Z",
};

export const mockEmailDomain = {
  id: "mock-domain-1",
  domain: "cloudpulse.io",
  status: "verified",
};

// ─── Recovery Stats (realistic for a ~$30K MRR SaaS) ───
export const mockRecoveryStats = {
  total_campaigns: 47,
  active_campaigns: 8,
  recovered_count: 31,
  recovered_revenue_cents: 467100, // $4,671 recovered
  failed_campaigns: 8,
  emails_sent: 112,
  total_attempts: 94,
  success_rate: 66,
};

// ─── Recovery Campaigns (CloudPulse's customers) ───
export const mockCampaigns = [
  {
    id: "mock-camp-1",
    stripe_invoice_id: "in_mock_1",
    stripe_customer_id: "cus_mock_a",
    customer_email: "james@northstarops.com",
    customer_name: "James Rivera",
    amount_due: 9900, // $99 Team plan
    currency: "usd",
    status: "active",
    retry_count: 2,
    max_retries: 5,
    next_retry_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-camp-2",
    stripe_invoice_id: "in_mock_2",
    stripe_customer_id: "cus_mock_b",
    customer_email: "finance@stackbuild.dev",
    customer_name: "Priya Sharma",
    amount_due: 24900, // $249 Business plan
    currency: "usd",
    status: "recovered",
    retry_count: 1,
    max_retries: 5,
    recovered_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-camp-3",
    stripe_invoice_id: "in_mock_3",
    stripe_customer_id: "cus_mock_c",
    customer_email: "matt@sideproject.co",
    customer_name: "Matt O'Brien",
    amount_due: 4900, // $49 Starter plan
    currency: "usd",
    status: "active",
    retry_count: 0,
    max_retries: 5,
    next_retry_at: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-camp-4",
    stripe_invoice_id: "in_mock_4",
    stripe_customer_id: "cus_mock_d",
    customer_email: "accounting@fintechplus.com.au",
    customer_name: "Rachel Kim",
    amount_due: 9900, // $99 Team plan
    currency: "usd",
    status: "recovered",
    retry_count: 3,
    max_retries: 5,
    recovered_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "mock-camp-5",
    stripe_invoice_id: "in_mock_5",
    stripe_customer_id: "cus_mock_e",
    customer_email: "dev@launchpad.io",
    customer_name: "Tom Fletcher",
    amount_due: 24900, // $249 Business plan
    currency: "usd",
    status: "failed",
    retry_count: 5,
    max_retries: 5,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// ─── Dunning Sequences (CloudPulse's branded emails) ───
export const mockDunningSequences = [
  {
    id: "mock-seq-1",
    name: "Default Recovery Sequence",
    description: "5-step email sequence. Friendly at first, then escalating urgency.",
    is_default: true,
    is_active: true,
    created_at: "2026-02-01T10:00:00Z",
    rk_dunning_emails: [{ count: 5 }],
  },
];

export const mockDunningEmails = [
  {
    id: "mock-email-1",
    sequence_id: "mock-seq-1",
    step_number: 1,
    delay_hours: 4,
    subject: "Quick heads up about your CloudPulse payment",
    body_html: `<p>Hi there,</p>
<p>We just tried to process your CloudPulse subscription payment, but it didn't go through. This usually happens when a card expires or your bank flags an unusual charge.</p>
<p>The good news: it takes less than a minute to fix. Just click the button below to update your payment details and you'll be all set.</p>
<p>Your monitoring dashboards and alerts are still active, so nothing to worry about right now.</p>`,
    body_text: `Hi there,

We just tried to process your CloudPulse subscription payment, but it didn't go through. This usually happens when a card expires or your bank flags an unusual charge.

The good news: it takes less than a minute to fix. Just click the button below to update your payment details and you'll be all set.

Your monitoring dashboards and alerts are still active, so nothing to worry about right now.`,
    is_ai_generated: false,
    created_at: "2026-02-01T10:00:00Z",
  },
  {
    id: "mock-email-2",
    sequence_id: "mock-seq-1",
    step_number: 2,
    delay_hours: 24,
    subject: "Your CloudPulse payment still needs attention",
    body_html: `<p>Hi there,</p>
<p>Just following up on your CloudPulse payment. We tried again but it was still declined.</p>
<p>We know how important uptime monitoring is for your team, and we'd hate for a billing issue to interrupt your service. Updating your card takes about 30 seconds.</p>
<p>If you're having trouble or have questions about your account, just reply to this email and we'll help sort it out.</p>`,
    body_text: `Hi there,

Just following up on your CloudPulse payment. We tried again but it was still declined.

We know how important uptime monitoring is for your team, and we'd hate for a billing issue to interrupt your service. Updating your card takes about 30 seconds.

If you're having trouble or have questions about your account, just reply to this email and we'll help sort it out.`,
    is_ai_generated: false,
    created_at: "2026-02-01T10:01:00Z",
  },
  {
    id: "mock-email-3",
    sequence_id: "mock-seq-1",
    step_number: 3,
    delay_hours: 72,
    subject: "Action needed: update your payment for CloudPulse",
    body_html: `<p>Hi there,</p>
<p>We've attempted to process your CloudPulse subscription payment several times now, but it keeps being declined by your bank.</p>
<p>Your account is still active, but we will need a valid payment method on file to keep your monitoring running. Without it, your dashboards, alerts, and incident history could be interrupted.</p>
<p>Please take a moment to update your payment details. It only takes a few seconds and ensures your team stays covered.</p>`,
    body_text: `Hi there,

We've attempted to process your CloudPulse subscription payment several times now, but it keeps being declined by your bank.

Your account is still active, but we will need a valid payment method on file to keep your monitoring running. Without it, your dashboards, alerts, and incident history could be interrupted.

Please take a moment to update your payment details. It only takes a few seconds and ensures your team stays covered.`,
    is_ai_generated: false,
    created_at: "2026-02-01T10:02:00Z",
  },
  {
    id: "mock-email-4",
    sequence_id: "mock-seq-1",
    step_number: 4,
    delay_hours: 120,
    subject: "Your CloudPulse subscription is at risk",
    body_html: `<p>Hi there,</p>
<p>This is an urgent reminder about your CloudPulse payment. We've tried multiple times to charge your card, but each attempt has been declined.</p>
<p>If we don't receive payment within the next few days, your CloudPulse subscription will be cancelled and your team will lose access to monitoring dashboards, alerting, and all historical data.</p>
<p>Please update your payment method now to avoid any disruption to your service.</p>`,
    body_text: `Hi there,

This is an urgent reminder about your CloudPulse payment. We've tried multiple times to charge your card, but each attempt has been declined.

If we don't receive payment within the next few days, your CloudPulse subscription will be cancelled and your team will lose access to monitoring dashboards, alerting, and all historical data.

Please update your payment method now to avoid any disruption to your service.`,
    is_ai_generated: false,
    created_at: "2026-02-01T10:03:00Z",
  },
  {
    id: "mock-email-5",
    sequence_id: "mock-seq-1",
    step_number: 5,
    delay_hours: 240,
    subject: "Final notice: your CloudPulse account will be cancelled",
    body_html: `<p>Hi there,</p>
<p>This is our final notice regarding your CloudPulse subscription. Your payment has been declined repeatedly and we've been unable to reach you.</p>
<p>Your account will be cancelled within 48 hours. Once cancelled, your team will immediately lose access to all monitoring dashboards, alert configurations, and incident history.</p>
<p>If you'd like to keep your CloudPulse account, please update your payment details now. This is the last email we'll send about this.</p>`,
    body_text: `Hi there,

This is our final notice regarding your CloudPulse subscription. Your payment has been declined repeatedly and we've been unable to reach you.

Your account will be cancelled within 48 hours. Once cancelled, your team will immediately lose access to all monitoring dashboards, alert configurations, and incident history.

If you'd like to keep your CloudPulse account, please update your payment details now. This is the last email we'll send about this.`,
    is_ai_generated: false,
    created_at: "2026-02-01T10:04:00Z",
  },
];

// ─── Payment Update Pages (CloudPulse branded) ───
export const mockPaymentPages = [
  {
    id: "mock-page-1",
    slug: "cloudpulse-update",
    title: "Update Your Payment Method",
    message: "Your recent CloudPulse payment didn't go through. Please update your card details below to keep your monitoring active. It only takes a moment.",
    brand_color: "#0ea5e9",
    logo_url: null,
    is_active: true,
    created_at: "2026-02-01T10:00:00Z",
  },
];
