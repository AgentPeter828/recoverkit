# Configuration

## Environment Variables

Copy `.env.local.example` to `.env.local` and fill in the values.

### Required

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-only) |
| `STRIPE_SECRET_KEY` | Stripe secret key (RecoverKit's own billing) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Stripe Pricing

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_STRIPE_PRICE_STARTER` | Price ID for Starter plan ($29 AUD/mo) |
| `NEXT_PUBLIC_STRIPE_PRICE_GROWTH` | Price ID for Pro plan ($79 AUD/mo) |
| `NEXT_PUBLIC_STRIPE_PRICE_SCALE` | Price ID for Scale plan ($149 AUD/mo) |

### Product Features

| Variable | Required? | Description |
|----------|-----------|-------------|
| `STRIPE_CLIENT_ID` | For live Connect | Stripe Connect OAuth client ID |
| `RESEND_API_KEY` | Optional | Resend API key for sending dunning emails. Falls back to console logging if not set. |
| `FROM_EMAIL` | Optional | Sender address (default: `RecoverKit <noreply@recoverkit.dev>`) |
| `OPENAI_API_KEY` | Optional | OpenAI API key for AI email generation. Falls back to templates if not set. |
| `NEXT_PUBLIC_MIXPANEL_TOKEN` | Optional | Mixpanel token for analytics |

### App

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Base URL of the app (e.g., `https://recoverkit.dev`) |
| `NEXT_PUBLIC_APP_NAME` | App name (default: `RecoverKit`) |

## Database Schema

RecoverKit adds these tables to Supabase (all with Row Level Security):

- **stripe_connections** — OAuth connections from customer Stripe accounts
- **recovery_campaigns** — One per failed invoice, tracks recovery status
- **recovery_attempts** — Individual retry/email attempts per campaign
- **dunning_sequences** — Named email sequence templates
- **dunning_emails** — Individual emails within sequences (subject, body, delay)
- **payment_update_pages** — Branded hosted pages for payment updates
- **sent_emails** — Log of all sent dunning emails with delivery status
- **subscriptions** — RecoverKit's own subscription tracking (from template)

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Set all environment variables
4. Deploy

### Stripe Products

Create these products in your Stripe Dashboard:

1. **Starter** — $29 AUD/month recurring
2. **Growth** — $79 AUD/month recurring
3. **Scale** — $149 AUD/month recurring

Copy the Price IDs to your environment variables.
