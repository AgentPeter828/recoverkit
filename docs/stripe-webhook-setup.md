# Stripe Webhook Setup

RecoverKit uses two webhook endpoints:

## 1. RecoverKit Billing Webhook (own billing)

This handles RecoverKit's own subscription billing events.

**Endpoint:** `https://your-domain.com/api/stripe/webhook`

**Events to subscribe to:**
- `checkout.session.completed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`

### Setup Steps

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-domain.com/api/stripe/webhook`
4. Select the events listed above
5. Click "Add endpoint"
6. Copy the **Signing secret** (starts with `whsec_`)
7. Set it as `STRIPE_WEBHOOK_SECRET` in your environment

## 2. Recovery Webhook (connected accounts)

This listens for failed payments on your customers' connected Stripe accounts.

**Endpoint:** `https://your-domain.com/api/recovery/webhook`

**Events to subscribe to:**
- `invoice.payment_failed`

### Setup Steps

1. In Stripe Dashboard → Webhooks → "Add endpoint"
2. Toggle "Listen to events on Connected accounts"
3. Enter URL: `https://your-domain.com/api/recovery/webhook`
4. Select `invoice.payment_failed`
5. Click "Add endpoint"

## Stripe Connect Setup

RecoverKit uses Stripe Connect OAuth to link customer Stripe accounts.

1. Go to [Stripe Connect Settings](https://dashboard.stripe.com/settings/connect)
2. Enable Connect (Standard accounts)
3. Copy your **Client ID** (starts with `ca_`)
4. Set it as `STRIPE_CLIENT_ID` in your environment
5. Add your redirect URI: `https://your-domain.com/api/stripe-connect/callback`

## Testing Webhooks Locally

Use the Stripe CLI:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger invoice.payment_failed
```

## Verifying Webhook Signatures

RecoverKit verifies webhook signatures automatically using the `STRIPE_WEBHOOK_SECRET`. The main billing webhook (`/api/stripe/webhook`) uses full signature verification. The recovery webhook (`/api/recovery/webhook`) parses events directly for MVP (signature verification should be added for production with per-account secrets).
