import type { Metadata } from "next";
import Link from "next/link";
import { BlogPost } from "@/components/marketing/BlogPost";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "RecoverKit API Quick Start | RecoverKit",
  description:
    "Get started with the RecoverKit API in 5 minutes. Authentication, key endpoints, webhooks, and code examples for Node.js.",
};

export default function APIQuickStartPage() {
  return (
    <BlogPost
      title="RecoverKit API Quick Start"
      date="February 14, 2026"
      readTime="6 min read"
      category="API"
    >
      <p style={{ color: "var(--color-text-secondary)", fontSize: "1.125rem", lineHeight: "1.75" }}>
        The RecoverKit API lets you programmatically manage recovery campaigns, customize dunning sequences, and access recovery analytics. This guide gets you up and running in 5 minutes.
      </p>

      <h2 className="text-2xl font-bold mt-12 mb-4">Prerequisites</h2>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• A RecoverKit account on the <strong>Scale plan</strong> ($149/mo) — API access is included</li>
        <li>• Your Stripe account connected via the RecoverKit dashboard</li>
        <li>• Your RecoverKit API key (found in Dashboard → Settings → API)</li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Authentication</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        All API requests require a Bearer token in the Authorization header:
      </p>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`curl -H "Authorization: Bearer rk_live_your_api_key" \\
  https://api.recoverkit.dev/v1/campaigns`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Key Endpoints</h2>

      <h3 className="text-xl font-semibold mt-8 mb-3">List Recovery Campaigns</h3>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`GET /v1/campaigns
GET /v1/campaigns?status=active
GET /v1/campaigns?status=recovered

Response:
{
  "data": [
    {
      "id": "camp_abc123",
      "stripe_customer_id": "cus_xyz",
      "stripe_invoice_id": "in_456",
      "amount": 7900,
      "status": "active",
      "recovery_attempts": 3,
      "emails_sent": 2,
      "created_at": "2026-02-10T10:00:00Z"
    }
  ],
  "has_more": false
}`}
        </pre>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">Get Recovery Stats</h3>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`GET /v1/stats
GET /v1/stats?period=30d

Response:
{
  "period": "30d",
  "total_failed": 47,
  "total_recovered": 31,
  "recovery_rate": 0.66,
  "revenue_at_risk": 425000,
  "revenue_recovered": 280500,
  "active_campaigns": 8
}`}
        </pre>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">Customize Dunning Sequence</h3>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`PUT /v1/sequences/default
{
  "steps": [
    {
      "delay_days": 0,
      "template": "friendly_reminder",
      "subject": "Quick heads up about your account"
    },
    {
      "delay_days": 3,
      "template": "gentle_reminder",
      "subject": "Your payment still needs attention"
    },
    {
      "delay_days": 7,
      "template": "urgent",
      "subject": "Action needed: Your account is at risk"
    },
    {
      "delay_days": 12,
      "template": "final_notice",
      "subject": "Last chance to save your account"
    }
  ]
}`}
        </pre>
      </Card>

      <h3 className="text-xl font-semibold mt-8 mb-3">Generate AI Dunning Emails</h3>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`POST /v1/emails/generate
{
  "product_name": "Your SaaS",
  "tone": "friendly",
  "steps": 4
}

Response:
{
  "emails": [
    {
      "step": 1,
      "subject": "Quick heads up about your YourSaaS account",
      "body": "Hi {{first_name}}, ...",
      "delay_days": 0
    },
    ...
  ]
}`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Node.js Example</h2>
      <Card className="p-4 my-4 overflow-x-auto">
        <pre className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
{`const RECOVERKIT_API_KEY = process.env.RECOVERKIT_API_KEY;
const BASE_URL = "https://api.recoverkit.dev/v1";

async function getRecoveryStats(period = "30d") {
  const res = await fetch(
    \`\${BASE_URL}/stats?period=\${period}\`,
    {
      headers: {
        Authorization: \`Bearer \${RECOVERKIT_API_KEY}\`,
      },
    }
  );
  return res.json();
}

async function listActiveCampaigns() {
  const res = await fetch(
    \`\${BASE_URL}/campaigns?status=active\`,
    {
      headers: {
        Authorization: \`Bearer \${RECOVERKIT_API_KEY}\`,
      },
    }
  );
  return res.json();
}

// Usage
const stats = await getRecoveryStats();
console.log(\`Recovery rate: \${(stats.recovery_rate * 100).toFixed(1)}%\`);
console.log(\`Revenue recovered: $\${(stats.revenue_recovered / 100).toFixed(2)}\`);`}
        </pre>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-4">Rate Limits</h2>
      <ul className="mb-4 space-y-1" style={{ color: "var(--color-text-secondary)" }}>
        <li>• <strong>Scale plan:</strong> 1,000 requests/minute</li>
        <li>• Rate limit headers are included in every response</li>
        <li>• Exceeding the limit returns <code className="text-xs px-1 rounded" style={{ background: "var(--color-bg-secondary)" }}>429 Too Many Requests</code></li>
      </ul>

      <h2 className="text-2xl font-bold mt-12 mb-4">Need Help?</h2>
      <p className="mb-4" style={{ color: "var(--color-text-secondary)" }}>
        The API is available on the Scale plan ($149/mo). If you don&apos;t need API access, the dashboard provides full control over your recovery campaigns, email sequences, and analytics. <Link href="/auth/signup" className="underline" style={{ color: "var(--color-brand)" }}>Get started free →</Link>
      </p>
    </BlogPost>
  );
}
