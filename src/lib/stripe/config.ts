export interface Plan {
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe Price ID — set after creating products in Stripe Dashboard
  features: string[];
  highlighted: boolean;
}

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "Perfect for getting started",
    price: 9,
    priceId: "", // TODO: Set your Stripe Price ID (e.g., price_xxx)
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
    priceId: "", // TODO: Set your Stripe Price ID
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
    priceId: "", // TODO: Set your Stripe Price ID
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
