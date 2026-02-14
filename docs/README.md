# RecoverKit Documentation

RecoverKit is an affordable Stripe failed payment recovery tool for indie hackers and SaaS founders.

## Contents

- [Stripe Webhook Setup](./stripe-webhook-setup.md) — How to configure Stripe webhooks
- [API Reference](./api-reference.md) — All API endpoints
- [Configuration](./configuration.md) — Environment variables and setup

## Quick Start

1. Sign up at your RecoverKit instance
2. Connect your Stripe account (one-click OAuth)
3. Set up your webhook endpoint in Stripe
4. Customize your dunning email sequences
5. Start recovering failed payments automatically

## Architecture

RecoverKit uses:
- **Next.js 15** — App router with server components
- **Supabase** — Auth (magic link / password), PostgreSQL with RLS
- **Stripe Connect** — OAuth to monitor customer Stripe accounts
- **Stripe API** — Payment retries and customer portal
- **Resend** — Transactional dunning emails
- **OpenAI** — AI email personalization (optional)
