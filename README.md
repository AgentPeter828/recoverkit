# 🔥 Firestorm Starter Template

A production-ready SaaS starter template built with **Next.js 15**, **Supabase**, **Stripe**, and **Tailwind CSS v4**. Clone this template to scaffold any new business in minutes.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework (App Router) |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [Supabase](https://supabase.com/) | Auth + Database + RLS |
| [Stripe](https://stripe.com/) | Payments & subscriptions |
| [Plausible](https://plausible.io/) | Privacy-friendly analytics |
| [PostHog](https://posthog.com/) | Product analytics (optional) |

## What's Included

- **Landing page** — Hero, features grid, pricing tiers, CTA
- **Authentication** — Magic link + Google OAuth via Supabase
- **Protected dashboard** — Middleware-based auth redirects
- **Stripe integration** — Webhook handler for subscription events
- **Analytics** — Plausible (self-hosted compatible) + PostHog (env-gated)
- **Brand system** — CSS variables for easy theming per business
- **Health endpoint** — `/api/health` for monitoring
- **Legal pages** — Privacy policy & terms of service templates

## Getting Started

### 1. Create a new repo from this template

Click **"Use this template"** on GitHub, or:

```bash
gh repo create your-org/your-app --template AgentPeter828/firestorm-starter-template --private
git clone https://github.com/your-org/your-app.git
cd your-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Fill in the values:

| Variable | Where to get it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase project → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase project → Settings → API (keep secret!) |
| `STRIPE_SECRET_KEY` | [Stripe Dashboard → API Keys](https://dashboard.stripe.com/test/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → API Keys |
| `STRIPE_WEBHOOK_SECRET` | Stripe Dashboard → Webhooks → Signing secret |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Your site domain in Plausible |
| `NEXT_PUBLIC_PLAUSIBLE_HOST` | Your Plausible instance URL |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog → Project Settings (optional) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog → Project Settings (optional) |
| `NEXT_PUBLIC_APP_URL` | Your app URL (e.g., `https://yourapp.com`) |
| `NEXT_PUBLIC_APP_NAME` | Display name for your app |

### 4. Set up Supabase

1. Create a new [Supabase project](https://supabase.com/dashboard)
2. Enable Google OAuth in Authentication → Providers (optional)
3. Add your database migrations to `supabase/migrations/`

### 5. Set up Stripe

1. Create products and prices in the [Stripe Dashboard](https://dashboard.stripe.com/test/products)
2. Update the `priceId` values in `src/lib/stripe/config.ts`
3. Set up a webhook endpoint pointing to `https://yourapp.com/api/stripe/webhook`
4. Subscribe to events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

### 6. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

### Brand Colors

Edit the CSS variables in `src/app/globals.css`:

```css
:root {
  --color-brand: #6366f1;      /* Primary brand color */
  --color-brand-light: #818cf8; /* Lighter variant */
  --color-brand-dark: #4f46e5;  /* Darker variant */
}
```

### Pricing Tiers

Edit `src/lib/stripe/config.ts` to change plan names, prices, and features.

### Landing Page

Edit `src/app/page.tsx` to customize the hero text, features, and CTA.

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/AgentPeter828/firestorm-starter-template)

Or via CLI:

```bash
npm i -g vercel
vercel
```

Make sure to add all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (health, Stripe webhook)
│   ├── auth/              # Auth pages (login, signup, callback)
│   ├── dashboard/         # Protected dashboard
│   └── (marketing)/       # Marketing pages (pricing, privacy, terms)
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, Input)
│   ├── layout/            # Header, Footer
│   └── analytics/         # Analytics providers
└── lib/
    ├── supabase/          # Supabase client (browser, server, middleware)
    ├── stripe/            # Stripe client + pricing config
    └── utils.ts           # Utility functions
```

## License

Private — Firestorm internal use.
