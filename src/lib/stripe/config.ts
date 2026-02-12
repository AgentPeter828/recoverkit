export interface Plan {
  name: string;
  description: string;
  price: number;
  priceId: string;
  features: string[];
  highlighted: boolean;
}

export const plans: Plan[] = [
  {
    name: "Starter",
    description: "For indie SaaS founders",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    features: [
      "100 recovery attempts/month",
      "Smart retry scheduling",
      "Basic email templates",
      "Recovery dashboard",
    ],
    highlighted: false,
  },
  {
    name: "Growth",
    description: "For growing SaaS businesses",
    price: 79,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_GROWTH || "",
    features: [
      "500 recovery attempts/month",
      "AI-generated email templates",
      "Custom branding",
      "Priority retry timing",
      "Email sequence builder",
    ],
    highlighted: true,
  },
  {
    name: "Scale",
    description: "For serious SaaS operations",
    price: 149,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SCALE || "",
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
