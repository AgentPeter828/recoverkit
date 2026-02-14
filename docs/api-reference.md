# API Reference

All API endpoints require authentication unless noted. Authenticated requests use Supabase session cookies.

## Recovery

### POST /api/recovery/webhook
**Auth:** None (webhook endpoint)

Receives `invoice.payment_failed` events from connected Stripe accounts. Creates recovery campaigns automatically.

### POST /api/recovery/retry
**Auth:** Required

Manually retry a failed payment.

```json
{ "campaign_id": "uuid" }
```

**Response:**
```json
{
  "success": true,
  "attempt_number": 2,
  "payment_intent_id": "pi_...",
  "error": null
}
```

### POST /api/recovery/send-email
**Auth:** Required

Send a dunning email for a campaign.

```json
{
  "campaign_id": "uuid",
  "dunning_email_id": "uuid"
}
```

### GET /api/recovery/stats
**Auth:** Required

Get recovery statistics for the authenticated user.

**Response:**
```json
{
  "total_campaigns": 42,
  "active_campaigns": 5,
  "recovered_campaigns": 30,
  "failed_campaigns": 7,
  "total_amount_at_risk": 15000,
  "total_recovered": 10500,
  "recovery_rate": 71.4,
  "emails_sent": 120,
  "emails_opened": 85
}
```

### GET /api/recovery/campaigns
**Auth:** Required

List all recovery campaigns for the authenticated user.

### GET /api/recovery/campaigns/[id]
**Auth:** Required

Get a single campaign with its attempts and sent emails.

## Dunning Sequences

### GET /api/dunning-sequences
**Auth:** Required

List all dunning sequences.

### POST /api/dunning-sequences
**Auth:** Required

Create a new dunning sequence.

```json
{
  "name": "My Custom Sequence",
  "description": "4-step email sequence for failed payments"
}
```

### GET/PUT/DELETE /api/dunning-sequences/[id]
**Auth:** Required

CRUD operations on individual sequences.

## Dunning Emails

### GET /api/dunning-emails?sequence_id=uuid
**Auth:** Required

List emails in a sequence.

### POST /api/dunning-emails
**Auth:** Required

Create a new email in a sequence.

```json
{
  "sequence_id": "uuid",
  "step_number": 1,
  "subject": "Your payment failed — update your card",
  "body_html": "<h1>Hi {{customer_name}}</h1>...",
  "delay_hours": 0
}
```

### POST /api/dunning-emails/generate
**Auth:** Required

Generate AI-powered dunning email content. Falls back to templates if no OpenAI API key.

```json
{
  "step_number": 1,
  "customer_name": "Acme Corp",
  "plan_name": "Pro Plan",
  "amount": "$49.00"
}
```

## Payment Pages

### GET /api/payment-pages
**Auth:** Required

List payment update pages.

### POST /api/payment-pages
**Auth:** Required

Create a branded payment update page.

```json
{
  "title": "Update Your Payment",
  "message": "Please update your card to continue.",
  "brand_color": "#6366f1"
}
```

### POST /api/payment-pages/update-payment
**Auth:** None (customer-facing)

Process a payment method update from a customer.

## Stripe Connect

### GET /api/stripe-connect
**Auth:** Required

Initiate Stripe Connect OAuth flow. Redirects to Stripe.

### GET /api/stripe-connect/callback
**Auth:** Required

OAuth callback from Stripe Connect. Stores connection details.

## Billing (RecoverKit's own)

### POST /api/stripe/checkout
**Auth:** Required

Create a checkout session for RecoverKit subscription.

```json
{ "priceId": "price_..." }
```

### POST /api/stripe/portal
**Auth:** Required

Create a Stripe Customer Portal session for managing RecoverKit subscription.

### POST /api/stripe/webhook
**Auth:** None (Stripe webhook)

Handles RecoverKit's own billing events.

## Health

### GET /api/health
**Auth:** None

Returns `{ "status": "ok" }`.
