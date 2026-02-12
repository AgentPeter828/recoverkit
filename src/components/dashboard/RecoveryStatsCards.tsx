"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { isMockMode } from "@/lib/mock/config";
import { mockRecoveryStats } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";

interface Stats {
  total_campaigns: number;
  active_campaigns: number;
  recovered_count: number;
  recovered_revenue_cents: number;
  failed_campaigns: number;
  emails_sent: number;
  total_attempts: number;
  success_rate: number;
}

export function RecoveryStatsCards() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (isMockMode()) {
        setStats(mockRecoveryStats);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/recovery/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          analytics.featureUsed("dashboard_viewed", { stats: data.stats });
        }
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 animate-pulse">
            <div className="h-4 w-24 rounded bg-gray-200 mb-3" />
            <div className="h-8 w-16 rounded bg-gray-200" />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) return null;

  const cards = [
    {
      label: "Revenue Recovered",
      value: `$${(stats.recovered_revenue_cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
      color: "#10b981",
      icon: "💰",
    },
    {
      label: "Active Campaigns",
      value: stats.active_campaigns.toString(),
      color: "#f59e0b",
      icon: "🔄",
    },
    {
      label: "Success Rate",
      value: `${stats.success_rate}%`,
      color: "#6366f1",
      icon: "📈",
    },
    {
      label: "Emails Sent",
      value: stats.emails_sent.toString(),
      color: "#8b5cf6",
      icon: "📧",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} className="p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium" style={{ color: "var(--color-text-secondary)" }}>
              {card.label}
            </p>
            <span className="text-xl">{card.icon}</span>
          </div>
          <p className="text-3xl font-bold mt-2" style={{ color: card.color }}>
            {card.value}
          </p>
        </Card>
      ))}
    </div>
  );
}
