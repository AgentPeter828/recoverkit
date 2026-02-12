"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { isMockMode } from "@/lib/mock/config";
import { mockCampaigns } from "@/lib/mock/data";

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

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    async function fetchCampaigns() {
      if (isMockMode()) {
        setCampaigns(mockCampaigns as Campaign[]);
        setLoading(false);
        return;
      }

      try {
        const params = filter !== "all" ? `?status=${filter}` : "";
        const res = await fetch(`/api/recovery/campaigns${params}`);
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
  }, [filter]);

  async function handleCancel(campaignId: string) {
    if (!confirm("Cancel this recovery campaign?")) return;
    try {
      const res = await fetch(`/api/recovery/campaigns/${campaignId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelled" }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? { ...c, status: "cancelled" } : c))
        );
      }
    } catch (err) {
      console.error("Failed to cancel campaign:", err);
    }
  }

  const filtered = filter === "all" ? campaigns : campaigns.filter((c) => c.status === filter);

  return (
    <div className="mx-auto max-w-[var(--max-width)] px-6 py-12 lg:px-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Recovery Campaigns</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            {campaigns.length} total campaigns
          </p>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">← Back to Dashboard</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["all", "active", "recovered", "failed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className="px-3 py-1.5 text-sm rounded-full border transition-colors capitalize"
            style={{
              background: filter === s ? "var(--color-brand)" : "transparent",
              color: filter === s ? "#fff" : "var(--color-text-secondary)",
              borderColor: filter === s ? "var(--color-brand)" : "var(--color-border)",
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <Card className="p-8 animate-pulse">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => <div key={i} className="h-16 rounded bg-gray-100" />)}
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-semibold">No campaigns found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((campaign) => {
            const colors = statusColors[campaign.status] || statusColors.active;
            return (
              <Card key={campaign.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="font-medium">{campaign.customer_name || campaign.customer_email || "Unknown"}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {campaign.customer_email} · Invoice: {campaign.stripe_invoice_id.slice(0, 20)}...
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-semibold">${(campaign.amount_due / 100).toFixed(2)}</p>
                      <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                        {campaign.retry_count}/{campaign.max_retries} retries
                      </p>
                    </div>
                    <span className="inline-block text-xs font-semibold px-2 py-1 rounded-full" style={{ background: colors.bg, color: colors.text }}>
                      {campaign.status}
                    </span>
                    {campaign.status === "active" && (
                      <Button variant="ghost" size="sm" onClick={() => handleCancel(campaign.id)} style={{ color: "#ef4444" }}>
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
