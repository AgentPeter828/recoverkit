# RecoverKit — Environment Variables

## Required (from starter template)

| Variable | Description | Where to get it |
|----------|-------------|-----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) | Supabase Dashboard → Settings → API |
| `STRIPE_SECRET_KEY` | Stripe secret key (for RecoverKit's own billing) | https://dashboard.stripe.com/test/apikeys |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | https://dashboard.stripe.com/test/apikeys |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret (own billing) | Stripe Dashboard → Webhooks |

## RecoverKit Pricing (Stripe Price IDs)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | Price ID for Starter plan ($29/mo) |
| `NEXT_PUBLIC_STRIPE_PRICE_GROWTH` | Price ID for Growth plan ($79/mo) |
| `NEXT_PUBLIC_STRIPE_PRICE_SCALE` | Price ID for Scale plan ($149/mo) |

## Product-Specific (RecoverKit Features)

| Variable | Description | Where to get it | Required? |
|----------|-------------|-----------------|-----------|
| `STRIPE_CLIENT_ID` | Stripe Connect OAuth client ID | https://dashboard.stripe.com/settings/connect → Platform settings | For live Stripe Connect |
| `RESEND_API_KEY` | Resend email API key | https://resend.com/api-keys | For live email sending |
| `FROM_EMAIL` | Email sender address (e.g., `RecoverKit <noreply@recoverkit.dev>`) | Set in Resend dashboard | Optional (defaults to RecoverKit) |
| `OPENAI_API_KEY` | OpenAI API key for AI email generation | https://platform.openai.com/api-keys | Optional (templates used as fallback) |

## Analytics (optional)

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Mixpanel project token |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Plausible analytics domain |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key |

## App

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | App base URL (e.g., `https://recoverkit.dev`) |
| `NEXT_PUBLIC_APP_NAME` | App name (defaults to RecoverKit) |
| `NEXT_PUBLIC_MOCK_MODE` | Set to `true` to enable mock mode server-side |

## Mock Fallback Behavior

All third-party integrations gracefully fall back to mock data when env vars are missing:
- **Stripe Connect**: Returns mock OAuth flow and mock account IDs
- **Resend**: Logs email details to console, returns mock message IDs
- **OpenAI**: Uses pre-written dunning email templates (5-step sequence)
- **Stripe Retry**: Simulates 60% success rate with random results
