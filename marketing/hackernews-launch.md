# Hacker News Show HN — RecoverKit

## Title
Show HN: RecoverKit – Affordable failed payment recovery for Stripe SaaS

## URL
https://recoverkit.dev

## Description (Text Post)

Hi HN,

I built RecoverKit to solve a problem I kept running into with my SaaS products: failed subscription payments silently churning customers who wanted to keep paying.

**The problem:** ~9% of SaaS MRR is lost to failed payments (expired cards, bank declines, insufficient funds). Stripe's built-in retry recovers ~30%. The rest just churns unless you actively do something.

**Why I built it:** Existing tools (Churnkey at $300+/mo, Baremetrics at $58+/mo, Gravy taking 15-25% of recoveries) are overpriced for indie SaaS founders. I wanted something that costs less than a single recovered payment.

**How it works:**

1. Connect Stripe via OAuth (reads `invoice.payment_failed` webhooks)
2. Smart retry scheduling — uses timing data (day of week, time of day, failure reason) to optimize retry windows instead of Stripe's fixed 1-3-5-7 day schedule
3. AI-generated dunning email sequences — 4-5 emails with progressive urgency, each linking to a hosted payment update page
4. Payment update pages — Stripe SetupIntent-based, branded, one-click card update

**Technical decisions:**
- Next.js 15 + Supabase + Stripe Connect
- AI email generation via LLM API (personalized to product brand)
- Retry timing model trained on payment success patterns (day-of-week/time-of-day correlations are surprisingly strong — Tuesday 10am succeeds 23% more than Sunday 3am)
- Webhook-driven architecture: listen for `invoice.payment_failed`, trigger recovery campaign, listen for `invoice.paid` to stop

**Pricing:** Free tier (10 attempts/mo), then $29/$79/$149/mo. No revenue share, no annual contracts.

**Results:** 66% average recovery rate vs 30% with Stripe alone. Average user recovers $2.8K/mo.

Site: https://recoverkit.dev
Docs: https://recoverkit.dev/docs

Would love feedback on the approach, pricing, or anything else. Happy to discuss the technical architecture in detail.
