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
    name: "Free",
    description: "Get started with payment recovery",
    price: 0,
    priceId: "",
    features: [
      "10 recovery attempts/month",
      "Smart retry scheduling",
      "Default email templates",
      "Recovery dashboard",
      "1 email sequence",
    ],
    highlighted: false,
  },
  {
    name: "Starter",
    description: "For indie SaaS founders",
    price: 29,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || "",
    features: [
      "100 recovery attempts/month",
      "Smart retry scheduling",
      "Email sequence builder",
      "Custom email domain",
      "Recovery dashboard",
      "Up to 3 email sequences",
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
      "AI-generated emails",
      "Custom branding",
      "Custom email domain",
      "Priority retry timing",
      "Up to 10 email sequences",
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
      "Everything in Growth",
      "Custom payment pages",
      "Advanced analytics",
      "API access",
      "Priority support",
      "Unlimited email sequences",
    ],
    highlighted: false,
  },
];
