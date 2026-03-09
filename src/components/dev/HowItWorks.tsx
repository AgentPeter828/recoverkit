"use client";

import { useState } from "react";

interface HowItWorksProps {
  section: string;
}

const EXPLAINERS: Record<string, { title: string; content: string }> = {
  dashboard: {
    title: "Dashboard Overview",
    content: `## How the Dashboard Works

**What you're seeing:**
The main dashboard shows your Stripe connection status, subscription plan, and key recovery metrics.

**Data flow:**
1. When a user logs in, the dashboard queries \`rk_stripe_connections\` to check if Stripe is connected
2. It fetches the user's subscription from \`rk_subscriptions\` to show their current plan
3. Recovery stats (RecoveryStatsCards) aggregate data from \`rk_recovery_campaigns\`
4. Recent campaigns list shows the latest failed payment recovery attempts

**Key components:**
- \`RecoveryStatsCards\` — shows total recovered $, active campaigns, success rate
- \`RecentCampaigns\` — lists campaigns with status, retry count, and manual retry button
- Plan info — shows current plan limits and upgrade options

**Mock mode:** Uses \`mockCampaigns\` and \`mockStripeConnection\` from \`/lib/mock/data.ts\`
**Test mode:** Real Supabase data + Stripe test keys
**Prod mode:** Live Stripe data from connected customer accounts`,
  },

  connect: {
    title: "Stripe Connect",
    content: `## How Stripe Connect Works

**Purpose:** Connects a customer's Stripe account so RecoverKit can monitor and retry their failed payments.

**OAuth flow (production):**
1. User clicks "Connect with Stripe" → \`GET /api/stripe-connect\`
2. Server generates a CSRF state token, stores in httpOnly cookie
3. Redirects to \`connect.stripe.com/oauth/authorize\` with your platform's \`ca_...\` Client ID
4. Customer authorizes on Stripe → redirected back to \`/api/stripe-connect/callback\`
5. Callback validates state, exchanges auth code for access_token via \`stripe.oauth.token()\`
6. Stores connection in \`rk_stripe_connections\` (account ID, access token, livemode)

**Test mode:** Skips OAuth, pre-seeds \`STRIPE_TEST_CONNECTED_ACCOUNT\` from env
**Mock mode:** Returns fake \`acct_mock_xxx\` account IDs

**Key files:**
- \`/lib/services/stripe-connect.ts\` — OAuth URL generation, code exchange
- \`/api/stripe-connect/route.ts\` — GET (start OAuth), DELETE (disconnect)
- \`/api/stripe-connect/callback/route.ts\` — handles OAuth callback

**Security:** CSRF protection via state parameter + httpOnly cookie. Access tokens stored server-side only.`,
  },

  campaigns: {
    title: "Recovery Campaigns",
    content: `## How Recovery Campaigns Work

**What is a campaign?**
Each failed payment creates one recovery campaign. It tracks the invoice, customer, failure reason, and retry history.

**How campaigns are created:**
1. Stripe fires \`invoice.payment_failed\` webhook to \`/api/recovery/webhook\`
2. Webhook looks up the connected account in \`rk_stripe_connections\`
3. Checks plan limits (Starter: 50/mo, Growth: 500/mo, Scale: unlimited)
4. Creates a campaign in \`rk_recovery_campaigns\` with status "active"
5. Schedules first retry using exponential backoff

**Retry flow:**
- Automatic: \`/api/cron/retry-due\` runs periodically, retries campaigns where \`next_retry_at\` has passed
- Manual: "Retry Now" button calls \`/api/recovery/retry\` for immediate retry
- Each attempt is logged in \`rk_recovery_attempts\`
- Max 5 retries with exponential backoff (1h, 4h, 12h, 24h, 48h)

**Statuses:**
- 🟡 **active** — retries ongoing
- 🟢 **recovered** — payment succeeded
- 🔴 **failed** — max retries exhausted
- ⚪ **cancelled** — manually stopped

**Key tables:** \`rk_recovery_campaigns\`, \`rk_recovery_attempts\``,
  },

  sequences: {
    title: "Dunning Email Sequences",
    content: `## How Dunning Sequences Work

**What is a dunning sequence?**
A series of automated emails sent to customers whose payments have failed, encouraging them to update their payment method.

**Structure:**
- Each sequence has multiple steps (dunning emails)
- Each step has a delay (hours after previous step), subject, and HTML body
- One sequence can be marked as "default" — used for all new campaigns

**Email flow:**
1. Campaign created → first dunning email scheduled based on step 1 delay
2. After delay, email sent via Resend API (\`/lib/services/email.ts\`)
3. Next step scheduled, and so on until:
   - Payment is recovered (sequence stops)
   - All steps exhausted
   - Campaign cancelled

**AI generation (optional):**
If \`OPENAI_API_KEY\` is set, emails can be AI-generated and personalized per customer.
Without it, pre-written templates from \`/lib/mock/data.ts\` are used.

**Key tables:** \`rk_dunning_sequences\`, \`rk_dunning_emails\`, \`rk_sent_emails\`
**Key files:** \`/lib/services/email.ts\`, \`/api/recovery/send-email/route.ts\``,
  },

  paymentPages: {
    title: "Payment Update Pages",
    content: `## How Payment Update Pages Work

**What are they?**
Branded, hosted pages where customers can update their payment method after a failed charge. Each page has a unique slug/URL.

**How they work:**
1. RecoverKit user creates a page with custom title, message, and brand color
2. Page is accessible at \`/pay/[slug]\` — no auth required (customer-facing)
3. Dunning emails include a link to this page
4. Customer visits, enters new card details via Stripe Elements
5. Card is attached to their Stripe customer, and the failed invoice is retried

**Customization:**
- Title and message text
- Brand color (affects buttons and accents)
- Logo URL (optional)
- Active/inactive toggle

**Key tables:** \`rk_payment_update_pages\`
**Key files:** \`/app/pay/[slug]/page.tsx\`, \`/app/pay/[slug]/PaymentUpdateForm.tsx\`
**Component:** Uses Stripe.js Elements for PCI-compliant card collection`,
  },

  test: {
    title: "Test Tools",
    content: `## How the Test Simulator Works

**What it does:**
Creates real Stripe test objects (customers + invoices) and feeds them into RecoverKit's recovery pipeline.

**Flow:**
1. Creates a Stripe customer with a random name and email
2. Creates an invoice with a line item for the specified amount
3. Finalizes the invoice (makes it visible in Stripe Dashboard as unpaid)
4. Sends a simulated \`invoice.payment_failed\` webhook event to \`/api/recovery/webhook\`
5. Webhook creates a recovery campaign in the database

**What's real vs simulated:**
- ✅ Real: Stripe customer, invoice, line items (visible in Stripe Dashboard)
- ✅ Real: RecoverKit campaign, database records
- ⚡ Simulated: The webhook event (not sent by Stripe, sent by this endpoint)
- ⚡ Simulated: The failure reason (randomly assigned)

**Environment modes:**
- \`npm run env:mock\` — all fake data, no Stripe calls
- \`npm run env:test\` — real Stripe test API, real Supabase
- \`npm run env:prod\` — live keys (test tools disabled)`,
  },

  // Sub-sections for dashboard page
  recoveryStats: {
    title: "Recovery Stats Cards",
    content: `## How Recovery Stats Work

**What you're seeing:**
Four metric cards showing your recovery performance at a glance.

**Metrics:**
- 💰 **Revenue Recovered** — total \`amount_due\` from campaigns with status "recovered"
- 🔄 **Active Campaigns** — count of campaigns with status "active" (retries in progress)
- 📈 **Success Rate** — recovered / (recovered + failed) × 100%
- 📧 **Emails Sent** — count of rows in \`rk_sent_emails\` for the user

**Data source:**
- Queries \`rk_recovery_campaigns\` grouped by status
- Queries \`rk_sent_emails\` for email count
- All filtered by \`user_id\` via RLS

**Component:** \`/components/dashboard/RecoveryStatsCards.tsx\``,
  },

  recentCampaigns: {
    title: "Recent Recovery Campaigns",
    content: `## How Recent Campaigns Work

**What you're seeing:**
A table of your most recent recovery campaigns — each one represents a failed payment that RecoverKit is trying to recover.

**Columns:**
- **Customer** — name + email from the Stripe invoice
- **Amount** — \`amount_due\` in the invoice currency
- **Status** — active (retrying), recovered (payment succeeded), failed (max retries hit), cancelled
- **Retries** — current retry count / max retries (default 5)
- **Next Retry** — when the next automatic retry is scheduled
- **Action** — "Retry Now" button for manual immediate retry

**Retry Now button:**
1. Calls \`POST /api/recovery/retry\` with the campaign ID
2. Uses the connected Stripe account's access token to retry the invoice payment
3. Records the attempt in \`rk_recovery_attempts\`
4. Updates campaign status based on result

**Automatic retries:**
The cron endpoint \`/api/cron/retry-due\` runs periodically and retries all campaigns where \`next_retry_at\` has passed. Backoff schedule: 1h → 4h → 12h → 24h → 48h.

**Component:** \`/components/dashboard/RecentCampaigns.tsx\`
**API:** \`/api/recovery/retry/route.ts\`, \`/api/cron/retry-due/route.ts\``,
  },

  subscription: {
    title: "Your Subscription",
    content: `## How Subscriptions Work

**What you're seeing:**
Your current RecoverKit plan and upgrade options.

**Plans:**
- **Free** — 10 recoveries/month (default)
- **Starter ($29/mo)** — 100 recoveries/month, smart retry scheduling
- **Growth ($79/mo)** — 500 recoveries/month, AI emails, custom branding
- **Scale ($149/mo)** — unlimited recoveries, priority scheduling, analytics

**How billing works:**
1. User clicks "Upgrade" → \`UpgradeButton\` creates a Stripe Checkout session
2. After payment, Stripe fires \`checkout.session.completed\` webhook
3. Webhook handler creates/updates row in \`rk_subscriptions\`
4. "Manage" button opens Stripe Customer Portal for plan changes/cancellation

**Plan limits enforced in:**
- \`/lib/plan-limits.ts\` — \`checkPlanLimit()\` called before creating campaigns
- Recovery webhook returns 403 if limit reached

**Config:** \`/lib/stripe/config.ts\` (plan definitions + price IDs)
**Tables:** \`rk_subscriptions\``,
  },

  connectionBanner: {
    title: "Stripe Connection Banner",
    content: `## Connection Status Banner

**What you're seeing:**
A warning banner that appears when no Stripe account is connected.

**How it works:**
1. Dashboard queries \`rk_stripe_connections\` for the logged-in user
2. If no row exists → shows yellow banner with "Connect Now" button
3. If connected → shows "⚡ Connected" in the top nav
4. The "Connect Now" link goes to \`/dashboard/connect\` (Stripe OAuth page)

**Why it matters:**
Without a connected Stripe account, RecoverKit can't monitor failed payments or retry them. This is the first step for any new user.`,
  },

  // Sub-sections for campaigns page
  campaignFilters: {
    title: "Campaign Filters",
    content: `## Campaign Filtering

**Available filters:**
- **Status** — active, recovered, failed, cancelled
- **Search** — filters by customer name or email (client-side)

**How it works:**
- Fetches all campaigns from \`rk_recovery_campaigns\` for the user
- Client-side filtering by status and search term
- Sorted by \`created_at\` descending (newest first)

**Cancel button:**
- Sets campaign status to "cancelled"
- Stops all future retries
- Cannot be undone (would need a new webhook event)`,
  },

  // Sub-sections for sequences page
  sequenceList: {
    title: "Sequence List",
    content: `## Dunning Sequence List

**What you're seeing:**
Your configured email sequences. Each sequence is a series of emails sent to customers after payment failure.

**Default sequence:**
- One sequence can be marked "default" — automatically used for new campaigns
- Toggle with the star/default button

**Creating a sequence:**
1. Click "Create Sequence" → name + description
2. Add email steps with subject, body (HTML), and delay in hours
3. Mark as default if desired

**Tables:** \`rk_dunning_sequences\` (sequences), \`rk_dunning_emails\` (steps)`,
  },

  // Sub-sections for payment pages
  pageList: {
    title: "Payment Pages List",
    content: `## Payment Update Pages

**What you're seeing:**
Your branded payment update pages. Each has a unique URL that customers visit to update their card.

**Creating a page:**
1. Set title, message, and brand color
2. A unique slug is auto-generated
3. Page is live at \`/pay/[slug]\`

**Customer flow:**
1. Customer receives dunning email with link to \`/pay/[slug]\`
2. Page shows your branding + message + Stripe Elements card form
3. Customer enters new card → attached to their Stripe customer
4. Failed invoice is retried with the new card
5. If successful → campaign marked as recovered

**Toggle:** Active/inactive switch disables the page without deleting it

**Tables:** \`rk_payment_update_pages\`
**Frontend:** \`/app/pay/[slug]/page.tsx\``,
  },
};

export function HowItWorks({ section }: HowItWorksProps) {
  const [open, setOpen] = useState(false);
  const explainer = EXPLAINERS[section];

  // Only show in non-production
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PUBLIC_MOCK_MODE !== "true") {
    return null;
  }

  if (!explainer) return null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors"
        style={{
          background: "var(--color-bg-secondary, #f3f4f6)",
          color: "var(--color-text-secondary, #6b7280)",
          border: "1px solid var(--color-border, #e5e7eb)",
        }}
      >
        <span>❓</span> How does this work?
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl shadow-2xl p-6"
            style={{ background: "var(--color-bg, #fff)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{explainer.title}</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-2xl leading-none px-2 rounded hover:bg-gray-100"
                style={{ color: "var(--color-text-secondary)" }}
              >
                ×
              </button>
            </div>
            <div className="prose prose-sm max-w-none">
              <MarkdownRenderer content={explainer.content} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Simple markdown renderer — handles ##, **, `, - lists, and numbered lists */
function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(<ul key={`list-${elements.length}`} className="list-disc pl-5 space-y-1 mb-3">{listItems}</ul>);
      listItems = [];
      inList = false;
    }
  }

  function formatInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let key = 0;

    while (remaining.length > 0) {
      // Bold
      const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
      // Code
      const codeMatch = remaining.match(/`(.+?)`/);

      const matches = [
        boldMatch ? { type: "bold", index: boldMatch.index!, match: boldMatch } : null,
        codeMatch ? { type: "code", index: codeMatch.index!, match: codeMatch } : null,
      ].filter(Boolean).sort((a, b) => a!.index - b!.index);

      if (matches.length === 0) {
        parts.push(remaining);
        break;
      }

      const first = matches[0]!;
      if (first.index > 0) {
        parts.push(remaining.slice(0, first.index));
      }

      if (first.type === "bold") {
        parts.push(<strong key={key++}>{first.match![1]}</strong>);
      } else {
        parts.push(
          <code key={key++} className="text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--color-bg-secondary, #f3f4f6)" }}>
            {first.match![1]}
          </code>
        );
      }

      remaining = remaining.slice(first.index + first.match![0].length);
    }

    return parts;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h3 key={i} className="text-base font-bold mt-4 mb-2">{trimmed.slice(3)}</h3>
      );
    } else if (trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(
        <li key={i} className="text-sm" style={{ color: "var(--color-text, #111)" }}>
          {formatInline(trimmed.slice(2))}
        </li>
      );
    } else if (/^\d+\.\s/.test(trimmed)) {
      inList = true;
      listItems.push(
        <li key={i} className="text-sm" style={{ color: "var(--color-text, #111)" }}>
          {formatInline(trimmed.replace(/^\d+\.\s/, ""))}
        </li>
      );
    } else {
      flushList();
      elements.push(
        <p key={i} className="text-sm mb-2" style={{ color: "var(--color-text, #111)" }}>
          {formatInline(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return <>{elements}</>;
}
