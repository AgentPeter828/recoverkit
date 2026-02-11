/**
 * Mock data for testing the full app without live API calls.
 * Toggle between mock and live data with ?mock=true in the URL.
 */

export const mockUser = {
  id: "mock-user-id-123",
  email: "demo@firestorm.dev",
  created_at: "2026-01-15T10:00:00Z",
};

export const mockSubscription = {
  id: "mock-sub-id",
  user_id: "mock-user-id-123",
  stripe_customer_id: "cus_mock123",
  stripe_subscription_id: "sub_mock123",
  status: "active",
  price_id: "price_mock_pro",
  current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  cancel_at_period_end: false,
  created_at: "2026-01-15T10:00:00Z",
  updated_at: new Date().toISOString(),
};

export const mockPlans = [
  {
    name: "Starter",
    description: "Perfect for getting started",
    price: 9,
    priceId: "price_mock_starter",
    features: [
      "Up to 1,000 requests",
      "Basic analytics",
      "Email support",
      "1 team member",
    ],
    highlighted: false,
  },
  {
    name: "Pro",
    description: "For growing businesses",
    price: 29,
    priceId: "price_mock_pro",
    features: [
      "Up to 50,000 requests",
      "Advanced analytics",
      "Priority support",
      "5 team members",
      "Custom integrations",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    description: "For large-scale operations",
    price: 99,
    priceId: "price_mock_enterprise",
    features: [
      "Unlimited requests",
      "Full analytics suite",
      "Dedicated support",
      "Unlimited team members",
      "Custom integrations",
      "SLA guarantee",
    ],
    highlighted: false,
  },
];

export const mockCheckoutUrl = "https://checkout.stripe.com/mock-test-session";
export const mockPortalUrl = "https://billing.stripe.com/mock-portal";
