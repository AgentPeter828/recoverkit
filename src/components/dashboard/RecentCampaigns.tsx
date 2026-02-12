"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { isMockMode } from "@/lib/mock/config";
import { mockCampaigns } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";

interface Campaign {
  id: string;
  stripe_invoice_id: string;
  customer_email: string | null;
  customer_name: string | null;
  amount_due: number;
  currency: string;
  status: string;
  retry_count: number;
  max_retries: number;
  next_retry_at: string | null;
  created_at: string;
}

const statusColors: Record<string, { bg: string; text: string }> = {
  active: { bg: "#fef3c7", text: "#92400e" },
  recovered: { bg: "#d1fae5", text: "#065f46" },
  failed: { bg: "#fee2e2", text: "#991b1b" },
  cancelled: { bg: "#f3f4f6", text: "#374151" },
};

export function RecentCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCampaigns() {
      if (isMockMode()) {
        setCampaigns(mockCampaigns as Campaign[]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/recovery/campaigns?limit=10");
        if (res.ok) {
          const data = await res.json();
          setCampaigns(data.campaigns || []);
        }
      } catch (err) {
        console.error("Failed to fetch campaigns:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  async function handleRetry(campaignId: string) {
    analytics.featureUsed("recovery_attempted", { campaign_id: campaignId });
    try {
      const res = await fetch("/api/recovery/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign_id: campaignId }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, status: "recovered" } : c))
        );
      } else {
        setCampaigns((prev) =>
          prev.map((c) =>
            c.id === campaignId ? { ...c, retry_count: c.retry_count + 1 } : c
          )
        );
      }
    } catch (err) {
      console.error("Retry failed:", err);
    }
  }

  if (loading) {
    return (
      <Card className="p-6 animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 rounded bg-gray-100" />
          ))}
        </div>
      </Card>
    );
  }

  if (campaigns.length === 0) {
    return (
      <Card className="p-8 text-center">
        <p className="text-4xl mb-3">🎉</p>
        <p className="font-semibold">No failed payments yet</p>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          When your customers&apos; payments fail, recovery campaigns will appear here.
        </p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--color-bg-secondary)" }}>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--color-text-secondary)" }}>Customer</th>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--color-text-secondary)" }}>Amount</th>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--color-text-secondary)" }}>Status</th>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--color-text-secondary)" }}>Retries</th>
              <th className="px-4 py-3 text-left font-medium" style={{ color: "var(--color-text-secondary)" }}>Next Retry</th>
              <th className="px-4 py-3 text-right font-medium" style={{ color: "var(--color-text-secondary)" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((campaign) => {
              const colors = statusColors[campaign.status] || statusColors.active;
              return (
                <tr key={campaign.id} className="border-t" style={{ borderColor: "var(--color-border)" }}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium">{campaign.customer_name || "Unknown"}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{campaign.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    ${(campaign.amount_due / 100).toFixed(2)} {campaign.currency.toUpperCase()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--color-text-secondary)" }}>
                    {campaign.retry_count}/{campaign.max_retries}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                    {campaign.next_retry_at
                      ? new Date(campaign.next_retry_at).toLocaleString()
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    {campaign.status === "active" && (
                      <Button variant="outline" size="sm" onClick={() => handleRetry(campaign.id)}>
                        Retry Now
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
