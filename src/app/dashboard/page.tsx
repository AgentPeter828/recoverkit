import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/stripe/billing";
import { plans } from "@/lib/stripe/config";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UpgradeButton } from "./UpgradeButton";
import { ManageButton } from "./ManageButton";
import { RecoveryStatsCards } from "@/components/dashboard/RecoveryStatsCards";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const subscription = await getSubscription(user.id);
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";
  const currentPlan = isActive ? plans.find((p) => p.priceId === subscription?.price_id) : null;

  // Check Stripe connection
  const { data: connection } = await supabase
    .from("stripe_connections")
    .select("stripe_account_id, business_name")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Recovery Dashboard</h1>
          <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
            Welcome back, {user.email}
          </p>
        </div>
        <div className="flex gap-3">
          <Link href="/dashboard/sequences">
            <Button variant="outline" size="sm">Email Sequences</Button>
          </Link>
          <Link href="/dashboard/payment-pages">
            <Button variant="outline" size="sm">Payment Pages</Button>
          </Link>
          <Link href="/dashboard/connect">
            <Button variant={connection ? "ghost" : "primary"} size="sm">
              {connection ? "⚡ Connected" : "Connect Stripe"}
            </Button>
          </Link>
        </div>
      </div>

      {/* Connection Status Banner */}
      {!connection && (
        <Card className="p-4 mb-6 border-yellow-300" style={{ background: "#fefce8" }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-yellow-800">Connect your Stripe account to get started</p>
              <p className="text-sm text-yellow-700">RecoverKit needs access to your Stripe account to monitor failed payments and retry them automatically.</p>
            </div>
            <Link href="/dashboard/connect" className="ml-auto">
              <Button variant="primary" size="sm">Connect Now</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Recovery Stats */}
      <RecoveryStatsCards />

      {/* Recent Campaigns */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Recovery Campaigns</h2>
          <Link href="/dashboard/campaigns">
            <Button variant="ghost" size="sm">View All →</Button>
          </Link>
        </div>
        <RecentCampaigns />
      </div>

      {/* Subscription Status */}
      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
        {isActive && currentPlan ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full" style={{ background: "var(--color-brand)" }}>
                {currentPlan.name}
              </span>
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                ${currentPlan.price}/month
              </span>
            </div>
            <ManageButton />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              You&apos;re on the <strong>Free</strong> plan (10 recoveries/month). Upgrade to recover more revenue.
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {plans.map((plan) => (
                <Card key={plan.name} className={`p-4 ${plan.highlighted ? "ring-2" : ""}`}
                  style={plan.highlighted ? { borderColor: "var(--color-brand)" } : undefined}>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">${plan.price}<span className="text-sm font-normal">/mo</span></p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="text-xs flex items-center gap-1">
                        <span style={{ color: "var(--color-brand)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <UpgradeButton priceId={plan.priceId} planName={plan.name} variant={plan.highlighted ? "primary" : "outline"} />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
