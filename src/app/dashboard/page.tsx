import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerComponentClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

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

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p
          className="mt-2"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Welcome back, {user.email}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Total Revenue
          </h3>
          <p className="text-3xl font-bold mt-2">$0.00</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            +0% from last month
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Active Subscriptions
          </h3>
          <p className="text-3xl font-bold mt-2">0</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            +0% from last month
          </p>
        </Card>

        <Card className="p-6">
          <h3 className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
            Total Users
          </h3>
          <p className="text-3xl font-bold mt-2">1</p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-tertiary)" }}>
            That&apos;s you! 🎉
          </p>
        </Card>
      </div>

      <div className="mt-12">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-medium"
                style={{ background: "var(--color-brand)" }}
              >
                1
              </span>
              <p>Configure your Supabase database tables</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-medium"
                style={{ background: "var(--color-brand)" }}
              >
                2
              </span>
              <p>Set up your Stripe products and prices</p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full text-white text-sm font-medium"
                style={{ background: "var(--color-brand)" }}
              >
                3
              </span>
              <p>Customize the landing page and branding</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
