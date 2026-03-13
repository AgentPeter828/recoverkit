"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface QueuedCampaign {
  id: string;
  customer_name: string | null;
  customer_email: string | null;
  amount_due: number;
  currency: string;
  created_at: string;
}

interface QueuedPaymentsCardProps {
  initialCount: number;
}

export function QueuedPaymentsCard({ initialCount }: QueuedPaymentsCardProps) {
  const [campaigns, setCampaigns] = useState<QueuedCampaign[]>([]);
  const [totalCount, setTotalCount] = useState(initialCount);
  const [totalAtRisk, setTotalAtRisk] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialCount === 0) {
      setLoading(false);
      return;
    }

    async function fetchQueued() {
      try {
        const res = await fetch("/api/recovery/queued");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns);
          setTotalCount(data.totalCount);
          setTotalAtRisk(data.totalAtRisk);
        }
      } catch (err) {
        console.error("Failed to fetch queued campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQueued();
  }, [initialCount]);

  if (initialCount === 0 || (totalCount === 0 && !loading)) return null;

  if (loading) {
    return (
      <Card className="p-6 mb-6 animate-pulse">
        <div className="h-5 w-48 rounded bg-gray-200 mb-3" />
        <div className="h-4 w-64 rounded bg-gray-200" />
      </Card>
    );
  }

  const displayCampaigns = campaigns.slice(0, 5);
  const remaining = totalCount - displayCampaigns.length;

  function formatAmount(cents: number, currency: string) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 0,
    }).format(cents / 100);
  }

  return (
    <Card className="p-6 mb-6" style={{ borderColor: "#fecaca" }}>
      <div className="flex items-start gap-3 mb-4">
        <span className="text-2xl leading-none">🚫</span>
        <div>
          <h3 className="font-semibold" style={{ color: "#991b1b" }}>
            {totalCount} failed payment{totalCount !== 1 ? "s" : ""} waiting to be recovered
          </h3>
          <p className="text-sm mt-1" style={{ color: "#b91c1c" }}>
            These customers have payment issues but RecoverKit can&apos;t help them
            yet because you&apos;ve hit your plan limit.
          </p>
        </div>
      </div>

      {/* Campaign list */}
      <div className="space-y-2 mb-4">
        {displayCampaigns.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between p-3 rounded-lg text-sm"
            style={{ background: "var(--color-bg-secondary)" }}
          >
            <div className="min-w-0">
              <p className="font-medium truncate">
                {c.customer_name || c.customer_email || "Unknown customer"}
              </p>
              <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                {new Date(c.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </p>
            </div>
            <span className="font-semibold shrink-0 ml-3" style={{ color: "#dc2626" }}>
              {formatAmount(c.amount_due, c.currency)}
            </span>
          </div>
        ))}
        {remaining > 0 && (
          <p className="text-xs text-center py-1" style={{ color: "var(--color-text-secondary)" }}>
            and {remaining} more...
          </p>
        )}
      </div>

      {/* Total at risk */}
      {totalAtRisk > 0 && (
        <div
          className="text-center py-3 rounded-lg mb-4 font-semibold"
          style={{ background: "#fef2f2", color: "#991b1b" }}
        >
          Total at risk: {formatAmount(totalAtRisk, campaigns[0]?.currency || "usd")}
        </div>
      )}

      <Link href="/pricing" className="block">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          style={{ background: "#dc2626" }}
        >
          Upgrade to Recover These Payments
        </Button>
      </Link>
    </Card>
  );
}
