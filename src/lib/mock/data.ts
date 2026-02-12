/**
 * Mock data for testing the full app without live API calls.
 */

export const mockUser = {
  id: "mock-user-id-123",
  email: "demo@recoverkit.dev",
  created_at: "2026-01-15T10:00:00Z",
};

export const mockSubscription = {
  id: "mock-sub-id",
  user_id: "mock-user-id-123",
  stripe_customer_id: "cus_mock123",
  stripe_subscription_id: "sub_mock123",
  status: "active",
  price_id: "price_mock_starter",
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
    features: ["100 recovery attempts/month", "Smart retry scheduling", "Basic email templates", "Recovery dashboard"],
    highlighted: false,
  },
  {
    name: "Growth",
    description: "500 recoveries/month + custom templates",
    price: 79,
    priceId: "price_mock_growth",
    features: ["500 recovery attempts/month", "AI-generated email templates", "Custom branding", "Priority retry timing", "Email sequence builder"],
    highlighted: true,
  },
  {
    name: "Scale",
    description: "Unlimited recoveries + analytics",
    price: 149,
    priceId: "price_mock_scale",
    features: ["Unlimited recovery attempts", "Priority retry scheduling", "Advanced analytics", "Custom payment pages", "API access", "Priority support"],
    highlighted: false,
  },
];

export const mockCheckoutUrl = "https://checkout.stripe.com/mock-test-session";
export const mockPortalUrl = "https://billing.stripe.com/mock-portal";

export const mockStripeConnection = {
  id: "mock-conn-1",
  stripe_account_id: "acct_mock_12345",
  business_name: "Demo SaaS Co.",
  livemode: false,
  connected_at: "2026-01-20T10:00:00Z",
};

export const mockRecoveryStats = {
  total_campaigns: 47,
  active_campaigns: 8,
  recovered_count: 31,
  recovered_revenue_cents: 284700,
  failed_campaigns: 8,
  emails_sent: 112,
  total_attempts: 94,
  success_rate: 66,
};

export const mockCampaigns = [
  {
    id: "mock-camp-1",
    stripe_invoice_id: "in_mock_1",
    stripe_customer_id: "cus_mock_a",
    customer_email: "alice@example.com",
    customer_name: "Alice Johnson",
    amount_due: 9900,
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
    customer_email: "bob@example.com",
    customer_name: "Bob Smith",
    amount_due: 29900,
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
    customer_email: "carol@example.com",
    customer_name: "Carol Williams",
    amount_due: 7900,
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
    customer_email: "dave@example.com",
    customer_name: "Dave Brown",
    amount_due: 14900,
    currency: "usd",
    status: "failed",
    retry_count: 5,
    max_retries: 5,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockDunningSequences = [
  {
    id: "mock-seq-1",
    name: "Default Recovery Sequence",
    description: "5-step email sequence with increasing urgency",
    is_default: true,
    is_active: true,
    created_at: "2026-01-20T10:00:00Z",
    dunning_emails: [{ count: 5 }],
  },
];

export const mockPaymentPages = [
  {
    id: "mock-page-1",
    slug: "pay-demo-abc123",
    title: "Update Your Payment Method",
    message: "Your recent payment failed. Please update your payment method to continue your subscription.",
    brand_color: "#6366f1",
    logo_url: null,
    is_active: true,
    created_at: "2026-01-20T10:00:00Z",
  },
];
