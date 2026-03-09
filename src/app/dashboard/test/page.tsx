"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { HowItWorks } from "@/components/dev/HowItWorks";

interface SimResult {
  customer_name: string;
  customer_id: string;
  subscription_id: string;
  invoice_id: string | null;
  failure_type: string;
  amount: number;
  status: string;
  error?: string;
  campaign_created?: boolean;
}

export default function TestPage() {
  const [count, setCount] = useState(1);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SimResult[]>([]);
  const [note, setNote] = useState("");

  async function simulate() {
    setLoading(true);
    setResults([]);
    setNote("");
    try {
      const body: Record<string, unknown> = { count };
      if (amount) body.amount = Math.round(parseFloat(amount) * 100);

      const res = await fetch("/api/test/simulate-failure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.error) {
        setNote(`❌ ${data.error}`);
      } else {
        setResults(data.results ?? []);
        setNote(data.note ?? "");
      }
    } catch (err) {
      setNote(`❌ ${err instanceof Error ? err.message : "Request failed"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold">🧪 Test Tools</h1>
        <HowItWorks section="test" />
      </div>
      <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
        Create real failed payments in Stripe to test the full recovery flow.
      </p>

      <Card className="p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Simulate Failed Payments</h2>
        <p className="text-sm mb-4" style={{ color: "var(--color-text-secondary)" }}>
          Creates real Stripe test customers with declining cards. Failed invoices appear in
          your Stripe Dashboard and recovery campaigns are created automatically in RecoverKit.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">Number of failures</label>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-full border rounded px-3 py-2 text-sm"
              style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
            >
              {[1, 2, 3, 5, 10].map((n) => (
                <option key={n} value={n}>{n} failed payment{n > 1 ? "s" : ""}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount USD (optional)</label>
            <input
              type="number"
              step="0.01"
              min="1"
              placeholder="Random $5–$450"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
              style={{ borderColor: "var(--color-border)", background: "var(--color-bg)" }}
            />
          </div>
        </div>

        <Button variant="primary" onClick={simulate} disabled={loading}>
          {loading ? "Creating in Stripe..." : `Simulate ${count} Failed Payment${count > 1 ? "s" : ""}`}
        </Button>
      </Card>

      {note && (
        <div className="mb-4 p-3 rounded text-sm" style={{ 
          background: note.startsWith("❌") ? "#fee2e2" : "#dbeafe",
          color: note.startsWith("❌") ? "#991b1b" : "#1e40af"
        }}>
          {note}
        </div>
      )}

      {results.length > 0 && (
        <Card className="p-6">
          <h3 className="text-sm font-semibold mb-3">
            Results — {results.filter(r => r.status === "created").length}/{results.length} created
          </h3>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div
                key={i}
                className="text-sm px-4 py-3 rounded"
                style={{ background: "var(--color-bg-secondary)" }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">{r.customer_name}</span>
                  <span className={r.status === "created" ? "text-green-600" : "text-red-500"}>
                    {r.status === "created" ? "✅ Created" : `❌ ${r.error ?? "Failed"}`}
                  </span>
                </div>
                {r.status === "created" && (
                  <>
                    <div className="grid grid-cols-2 gap-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                      <span>💳 {r.failure_type}</span>
                      <span>💰 ${(r.amount / 100).toFixed(2)}</span>
                      <span>📋 {r.invoice_id}</span>
                      <span>👤 {r.customer_id}</span>
                    </div>
                    <div className="mt-1">
                      <span className={`text-xs font-medium ${r.campaign_created ? "text-green-600" : "text-yellow-600"}`}>
                        {r.campaign_created ? "✅ Recovery campaign created" : "⚠️ Campaign not created (check Stripe connection)"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs mt-4" style={{ color: "var(--color-text-secondary)" }}>
            Real Stripe test objects — check your{" "}
            <a href="https://dashboard.stripe.com/test/payments" target="_blank" rel="noopener noreferrer" className="underline">
              Stripe Dashboard
            </a>
            . Recovery campaigns are on the RecoverKit Dashboard.
          </p>
        </Card>
      )}
    </div>
  );
}
