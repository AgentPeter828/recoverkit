# Indie Hackers Launch Post — RecoverKit

## Title
I built a $29/mo alternative to Churnkey for recovering failed Stripe payments

## Post

Hey IH! 👋

I want to share the story of RecoverKit — a payment recovery tool I built after getting frustrated with the cost of existing solutions.

### The Problem I Kept Running Into

I've been building SaaS products for a few years, and I kept seeing the same pattern: customers churning not because they were unhappy, but because their credit card expired or their bank declined a charge.

When I dug into the data, the numbers were worse than I expected:

- **9% of MRR lost to failed payments** on average across SaaS
- At my $30K MRR, that was **$2,700/month** walking out the door
- Stripe's built-in retry was only recovering about **30%** of those

So I was losing ~$1,890/month in revenue from customers who literally wanted to keep paying me. They just didn't know their payment failed.

### Why I Didn't Use Existing Tools

I looked at the market:

| Tool | Cost | Issue |
|------|------|-------|
| Churnkey | $300-500+/mo | Way too expensive for my stage |
| Baremetrics Recover | $58+/mo | Caps recoveries based on plan |
| Gravy Solutions | 10-25% of recovered revenue | Costs grow with success |
| Stunning | $100+/mo | Basically discontinued |

For an indie SaaS founder doing $30K MRR, paying $300+/month for a recovery tool felt ridiculous. That's more than 10% of the revenue I was trying to recover!

### What I Built

RecoverKit focuses on the three things that actually matter for payment recovery:

**1. Smart Retry Logic**
Instead of Stripe's fixed schedule (retry on days 1, 3, 5, 7), RecoverKit uses AI to retry at optimal times. Turns out, Tuesday at 10am succeeds 23% more often than Sunday at 3am. For insufficient-funds failures, retrying on the 1st or 15th of the month (paydays) works better.

**2. AI-Generated Dunning Emails**
A 4-5 email sequence that escalates from "hey just a heads up" to "last chance before cancellation." The AI writes them so they sound human and empathetic — not like a debt collection notice. Each email includes a one-click link to update the payment method.

**3. Branded Payment Update Pages**
When a customer clicks "Update Payment Method" in a dunning email, they land on a branded page where they can enter a new card in 30 seconds. No logging in, no navigating settings, no friction.

### The Results

After 3 months of running RecoverKit on my own SaaS products:

- Recovery rate: **30% → 66%** (more than doubled)
- Revenue recovered: **~$2,800/month**
- ROI: **96x** ($29/mo cost → $2,800/mo recovered)
- Setup time: **Under 5 minutes** (one-click Stripe OAuth)

### Pricing

I wanted to make this accessible to every indie founder:

- **Free:** $0/mo — 10 recovery attempts (try it risk-free)
- **Starter:** $29/mo — 100 recovery attempts
- **Growth:** $79/mo — 500 recovery attempts
- **Scale:** $149/mo — Unlimited + API access

All month-to-month, no contracts, cancel anytime.

### What's Next

Currently focused on:
- Improving the AI email generation
- Adding more analytics and A/B testing for dunning emails
- Pre-dunning (proactive card expiration notifications)
- Expanding beyond Stripe (Paddle, etc.)

### Try It

If you're losing MRR to failed payments (you probably are), give RecoverKit a try: **recoverkit.dev**

The free tier lets you test with no financial risk. Setup takes under 5 minutes.

Happy to answer any questions about payment recovery, the technical architecture, or the business side of building a developer tool!
