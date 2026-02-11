import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getSubscription } from "@/lib/stripe/billing";
import { plans } from "@/lib/stripe/config";
import { Card } from "@/components/ui/Card";
import { UpgradeButton } from "./UpgradeButton";
import { ManageButton } from "./ManageButton";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const subscription = await getSubscription(user.id);
  const isActive = subscription?.status === "active" || subscription?.status === "trialing";
  const currentPlan = isActive
    ? plans.find((p) => p.priceId === subscription?.price_id)
    : null;

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2" style={{ color: "var(--color-text-secondary)" }}>
          Welcome back, {user.email}
        </p>
      </div>

      {/* Subscription Status */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Subscription</h2>
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
                ${currentPlan.price}/month
              </span>
            </div>
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Status: <span className="font-medium text-green-600">{subscription?.status}</span>
              {subscription?.current_period_end && (
                <> · Renews {new Date(subscription.current_period_end).toLocaleDateString()}</>
              )}
              {subscription?.cancel_at_period_end && (
                <span className="text-yellow-600 ml-2">(Cancels at period end)</span>
              )}
            </p>
            <ManageButton />
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              You&apos;re on the <strong>Free</strong> plan. Upgrade to unlock all features.
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
                    <UpgradeButton
                      priceId={plan.priceId}
                      planName={plan.name}
                      variant={plan.highlighted ? "primary" : "outline"}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Plan
          </h3>
          <p className="text-3xl font-bold mt-2">{currentPlan?.name ?? "Free"}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Status
          </h3>
          <p className="text-3xl font-bold mt-2">{isActive ? "Active ✅" : "Inactive"}</p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Member Since
          </h3>
          <p className="text-3xl font-bold mt-2">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
        </Card>
      </div>
    </div>
  );
}
