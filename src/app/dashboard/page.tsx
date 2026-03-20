import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/stripe/billing";
import { plans } from "@/lib/stripe/config";
import { checkPlanLimit } from "@/lib/plan-limits";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { UpgradeButton } from "./UpgradeButton";
import { ManageButton } from "./ManageButton";
import { RecoveryStatsCards } from "@/components/dashboard/RecoveryStatsCards";
import { RecentCampaigns } from "@/components/dashboard/RecentCampaigns";
import { UsageBanner } from "@/components/dashboard/UsageBanner";
import { QueuedPaymentsCard } from "@/components/dashboard/QueuedPaymentsCard";

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
  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "there";

  // Check Stripe connection
  const { data: connection } = await supabase
    .from("rk_stripe_connections")
    .select("stripe_account_id, business_name")
    .eq("user_id", user.id)
    .single();

  // Check dunning sequences
  const { count: sequenceCount } = await supabase
    .from("rk_dunning_sequences")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Check email domain
  const { data: emailDomain } = await supabase
    .from("rk_email_domains")
    .select("id, domain, status")
    .eq("user_id", user.id)
    .eq("status", "verified")
    .single();

  const hasStripe = !!connection;
  const hasSequence = (sequenceCount ?? 0) > 0;
  const hasEmailDomain = !!emailDomain;
  const setupComplete = hasStripe && hasSequence && hasEmailDomain;
  const stepsComplete = [hasStripe, hasSequence, hasEmailDomain].filter(Boolean).length;

  // Plan usage data for banners
  const planLimit = await checkPlanLimit(user.id);
  const { count: queuedCount } = await supabase
    .from("rk_recovery_campaigns")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "queued");

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          {setupComplete ? "Recovery Dashboard" : `Welcome, ${displayName}!`}
        </h1>
        <p className="mt-1" style={{ color: "var(--color-text-secondary)" }}>
          {setupComplete
            ? "Your payment recovery is active. Here's how things are going."
            : "Let's get your payment recovery up and running. It only takes a few minutes."}
        </p>
      </div>

      {/* ─── USAGE BANNER ─── */}
      <UsageBanner
        current={planLimit.current}
        limit={planLimit.limit}
        queuedCount={queuedCount ?? 0}
        planName={planLimit.planName}
      />

      {/* ─── QUEUED PAYMENTS ─── */}
      <QueuedPaymentsCard initialCount={queuedCount ?? 0} />

      {/* ─── SETUP CHECKLIST ─── */}
      {!setupComplete && (
        <Card className="p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Setup checklist</h2>
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                background: stepsComplete === 3 ? "#d1fae5" : "#fef3c7",
                color: stepsComplete === 3 ? "#065f46" : "#92400e",
              }}
            >
              {stepsComplete}/3 complete
            </span>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 rounded-full mb-6" style={{ background: "var(--color-bg-secondary)" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(stepsComplete / 3) * 100}%`,
                background: stepsComplete === 3 ? "#22c55e" : "var(--color-brand)",
              }}
            />
          </div>

          <div className="space-y-4">
            {/* Step 1: Connect Stripe */}
            <SetupStep
              number={1}
              title="Connect your Stripe account"
              description="We'll monitor your Stripe account for failed payments and automatically start recovery campaigns."
              done={hasStripe}
              doneText={connection?.business_name ? `Connected: ${connection.business_name}` : "Stripe connected"}
              href="/dashboard/connect"
              buttonText="Connect Stripe"
              priority={!hasStripe}
            />

            {/* Step 2: Set up email sequence */}
            <SetupStep
              number={2}
              title="Set up your dunning email sequence"
              description="Choose the emails your customers receive when a payment fails. Use our default 5-step sequence or create your own."
              done={hasSequence}
              doneText={`${sequenceCount} sequence${(sequenceCount ?? 0) > 1 ? "s" : ""} configured`}
              href="/dashboard/sequences"
              buttonText="Set Up Emails"
              priority={hasStripe && !hasSequence}
            />

            {/* Step 3: Email domain */}
            <SetupStep
              number={3}
              title="Verify your email domain"
              description="So dunning emails come from your brand (e.g. billing@yourapp.com) instead of ours. This dramatically improves deliverability."
              done={hasEmailDomain}
              doneText={`Sending from ${emailDomain?.domain}`}
              href="/dashboard/email-setup"
              buttonText="Set Up Email Domain"
              priority={hasStripe && hasSequence && !hasEmailDomain}
              badge="Important"
            />
          </div>

          {!hasEmailDomain && hasStripe && hasSequence && (
            <div
              className="mt-4 p-3 rounded-lg text-sm flex items-start gap-2"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              <span className="text-lg leading-none">⚠️</span>
              <div>
                <strong>Without a verified email domain, your dunning emails may land in spam.</strong>
                {" "}Verifying your domain takes 2 minutes and ensures your customers actually see your recovery emails.
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ─── QUICK ACTIONS (when setup complete) ─── */}
      {setupComplete && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Link href="/dashboard/sequences">
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-2xl mb-1">📧</p>
              <p className="text-sm font-medium">Email Sequences</p>
            </Card>
          </Link>
          <Link href="/dashboard/payment-pages">
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-2xl mb-1">🔗</p>
              <p className="text-sm font-medium">Payment Pages</p>
            </Card>
          </Link>
          <Link href="/dashboard/email-setup">
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-2xl mb-1">✉️</p>
              <p className="text-sm font-medium">Email Domain</p>
            </Card>
          </Link>
          <Link href="/dashboard/settings">
            <Card className="p-4 text-center hover:shadow-md transition-shadow cursor-pointer">
              <p className="text-2xl mb-1">⚙️</p>
              <p className="text-sm font-medium">Settings</p>
            </Card>
          </Link>
        </div>
      )}

      {/* ─── RECOVERY STATS ─── */}
      {hasStripe && (
        <>
          <h2 className="text-lg font-semibold mb-3">Recovery Metrics</h2>
          <RecoveryStatsCards />
        </>
      )}

      {/* ─── RECENT CAMPAIGNS ─── */}
      {hasStripe && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Recovery Campaigns</h2>
            <Link href="/dashboard/campaigns">
              <Button variant="ghost" size="sm">View All →</Button>
            </Link>
          </div>
          <RecentCampaigns />
        </div>
      )}

      {/* ─── SUBSCRIPTION ─── */}
      <Card className="p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Your Plan</h2>
        {isActive && currentPlan ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span
                className="inline-block text-white text-xs font-semibold px-3 py-1 rounded-full"
                style={{ background: "var(--color-brand)" }}
              >
                {currentPlan.name}
              </span>
              <span className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                ${currentPlan.price} AUD/month
              </span>
            </div>
            <ManageButton />
          </div>
        ) : null}

        {/* Plan options — show upgrade for all non-Scale users */}
        {(!currentPlan || currentPlan.name !== "Scale") && (
          <div className="space-y-4 mt-4">
            {!currentPlan && (
              <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
                You&apos;re on the <strong>Free</strong> plan (10 recoveries/month). Upgrade to recover more revenue.
              </p>
            )}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {plans.filter((p) => p.price > 0 && p.name !== currentPlan?.name && p.price > (currentPlan?.price ?? 0)).map((plan) => (
                <Card
                  key={plan.name}
                  className={`p-4 ${plan.highlighted ? "ring-2" : ""}`}
                  style={plan.highlighted ? { borderColor: "var(--color-brand)" } : undefined}
                >
                  <h3 className="font-semibold">{plan.name}</h3>
                  <p className="text-2xl font-bold mt-1">
                    ${plan.price}
                    <span className="text-sm font-normal">/mo</span>
                  </p>
                  <ul className="mt-3 space-y-1">
                    {plan.features.slice(0, 3).map((f) => (
                      <li key={f} className="text-xs flex items-center gap-1">
                        <span style={{ color: "var(--color-brand)" }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <UpgradeButton
                      priceId={plan.priceId}
                      planName={plan.name}
                      currentPlanPrice={currentPlan?.price ?? 0}
                      targetPlanPrice={plan.price}
                      hasSubscription={isActive && !!subscription?.stripe_subscription_id}
                      variant={plan.price > (currentPlan?.price ?? 0) ? (plan.highlighted ? "primary" : "outline") : "outline"}
                    />
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

/* ─── Setup Step Component ─── */

function SetupStep({
  number,
  title,
  description,
  done,
  doneText,
  href,
  buttonText,
  priority,
  badge,
}: {
  number: number;
  title: string;
  description: string;
  done: boolean;
  doneText: string;
  href: string;
  buttonText: string;
  priority?: boolean;
  badge?: string;
}) {
  return (
    <div
      className="flex items-start gap-4 p-4 rounded-lg transition-colors"
      style={{
        background: done
          ? "color-mix(in srgb, #22c55e 6%, transparent)"
          : priority
            ? "color-mix(in srgb, var(--color-brand) 6%, transparent)"
            : "var(--color-bg-secondary)",
      }}
    >
      {/* Step circle */}
      <div
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{
          background: done ? "#22c55e" : priority ? "var(--color-brand)" : "var(--color-bg-secondary)",
          color: done || priority ? "#fff" : "var(--color-text-secondary)",
          border: !done && !priority ? "2px solid var(--color-border)" : "none",
        }}
      >
        {done ? "✓" : number}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className={`text-sm font-semibold ${done ? "line-through opacity-60" : ""}`}>
            {title}
          </h3>
          {badge && !done && (
            <span
              className="text-[10px] font-bold px-1.5 py-0.5 rounded uppercase"
              style={{ background: "#fef3c7", color: "#92400e" }}
            >
              {badge}
            </span>
          )}
        </div>
        {done ? (
          <p className="text-xs mt-0.5" style={{ color: "#16a34a" }}>
            ✅ {doneText}
          </p>
        ) : (
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {!done && (
        <Link href={href} className="shrink-0">
          <Button variant={priority ? "primary" : "outline"} size="sm">
            {buttonText}
          </Button>
        </Link>
      )}
    </div>
  );
}
