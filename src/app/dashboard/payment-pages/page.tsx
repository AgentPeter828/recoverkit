"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { isMockMode } from "@/lib/mock/config";
import { mockPaymentPages } from "@/lib/mock/data";
import { analytics } from "@/lib/mixpanel";
import { HowItWorks } from "@/components/dev/HowItWorks";

const MESSAGE_PRESETS = [
  {
    label: "🤝 Friendly",
    text: "Your latest payment didn't go through. No worries, it happens! Update your payment method below and you're all set.",
  },
  {
    label: "💼 Professional",
    text: "We noticed a problem with your recent payment. Please update your card details below to keep your account active.",
  },
  {
    label: "⚡ Direct",
    text: "Your payment method needs updating. It only takes a moment to enter new card details and keep your subscription running smoothly.",
  },
  {
    label: "😊 Warm",
    text: "Hi there! Your recent payment was declined. Please update your billing information below so we can continue providing you with great service.",
  },
  {
    label: "🏢 Formal",
    text: "There was an issue processing your subscription payment. To avoid any interruption to your service, please update your payment details.",
  },
];

interface PaymentPage {
  id: string;
  slug: string;
  title: string;
  message: string;
  brand_color: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export default function PaymentPagesPage() {
  const [pages, setPages] = useState<PaymentPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("Update Your Payment Method");
  const [newMessage, setNewMessage] = useState("");
  const [newColor, setNewColor] = useState("#6366f1");
  const [recommendedMessage, setRecommendedMessage] = useState<string | null>(null);
  const [loadingRecommended, setLoadingRecommended] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    if (isMockMode()) {
      setPages(mockPaymentPages as PaymentPage[]);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/payment-pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error("Failed to fetch pages:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    setCreating(true);
    analytics.featureUsed("payment_page_created");
    try {
      const res = await fetch("/api/payment-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle, message: newMessage, brand_color: newColor }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewTitle("Update Your Payment Method");
        setNewMessage("");
        fetchPages();
      }
    } catch (err) {
      console.error("Failed to create page:", err);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this payment page?")) return;
    try {
      const res = await fetch(`/api/payment-pages/${id}`, { method: "DELETE" });
      if (res.ok) setPages((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Failed to delete page:", err);
    }
  }

  async function fetchRecommendedMessage() {
    if (recommendedMessage) return; // Already fetched
    setLoadingRecommended(true);
    try {
      const res = await fetch("/api/payment-pages/recommended-message");
      if (res.ok) {
        const data = await res.json();
        setRecommendedMessage(data.message);
      }
    } catch {
      // Silent fail — recommended is optional
    } finally {
      setLoadingRecommended(false);
    }
  }

  // Fetch recommended message when create form opens
  useEffect(() => {
    if (showCreate && !recommendedMessage && !loadingRecommended) {
      fetchRecommendedMessage();
    }
  }, [showCreate]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">Payment Update Pages</h1>
            <HowItWorks section="paymentPages" />
          </div>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
            Branded pages where your customers can update their payment method
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">← Dashboard</Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setShowCreate(!showCreate)}>
            + New Page
          </Button>
        </div>
      </div>

      {showCreate && (
        <Card className="p-6 mb-6">
          <h3 className="font-semibold mb-4">Create Payment Update Page</h3>
          <div className="space-y-3">
            <Input placeholder="Page title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
            <div>
              <label className="block text-sm font-medium mb-1.5">Customer message</label>
              <p className="text-xs mb-2" style={{ color: "var(--color-text-secondary)" }}>
                Choose a tone, or write your own
              </p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {/* Recommended — AI generated based on their account */}
                {(recommendedMessage || loadingRecommended) && (
                  <button
                    type="button"
                    onClick={() => recommendedMessage && setNewMessage(recommendedMessage)}
                    disabled={loadingRecommended}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-current flex items-center gap-1.5"
                    style={{
                      borderColor: newMessage === recommendedMessage ? "var(--color-brand)" : "var(--color-border)",
                      color: newMessage === recommendedMessage ? "var(--color-brand)" : "var(--color-text-secondary)",
                      background: newMessage === recommendedMessage ? "color-mix(in srgb, var(--color-brand) 8%, transparent)" : "transparent",
                    }}
                  >
                    {loadingRecommended ? (
                      <>⏳ Analyzing your style...</>
                    ) : (
                      <>✨ Recommended for you</>
                    )}
                  </button>
                )}
                {MESSAGE_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setNewMessage(preset.text)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:border-current"
                    style={{
                      borderColor: newMessage === preset.text ? "var(--color-brand)" : "var(--color-border)",
                      color: newMessage === preset.text ? "var(--color-brand)" : "var(--color-text-secondary)",
                      background: newMessage === preset.text ? "color-mix(in srgb, var(--color-brand) 8%, transparent)" : "transparent",
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <textarea
                className="w-full rounded-lg border px-3 py-2 text-sm min-h-[80px]"
                style={{ background: "var(--color-bg)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                placeholder="Or write your own message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: "var(--color-text-secondary)" }}>Brand Color:</label>
              <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
              <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{newColor}</span>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleCreate} disabled={creating}>
                {creating ? "Creating..." : "Create Page"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>Cancel</Button>
            </div>
          </div>
        </Card>
      )}

      {loading ? (
        <Card className="p-8 animate-pulse">
          <div className="h-20 bg-gray-100 rounded" />
        </Card>
      ) : pages.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-4xl mb-3">🔗</p>
          <p className="font-semibold">Create a branded payment update page for your customers</p>
          <p className="text-sm mt-2 max-w-md mx-auto" style={{ color: "var(--color-text-secondary)" }}>
            Payment update pages let your customers securely update their card details.
            Include links in your dunning emails to make it easy to fix failed payments.
          </p>
          <div className="mt-4">
            <Button variant="primary" size="sm" onClick={() => setShowCreate(true)}>
              + Create Page
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <Card key={page.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full" style={{ background: page.brand_color }} />
                    <h3 className="font-semibold">{page.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full`}
                      style={{ background: page.is_active ? "#d1fae5" : "#f3f4f6", color: page.is_active ? "#065f46" : "#6b7280" }}>
                      {page.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>{page.message}</p>
                  <p className="text-xs mt-2 font-mono" style={{ color: "var(--color-text-secondary)" }}>
                    {appUrl}/pay/{page.slug}
                  </p>
                </div>
                <div className="flex gap-2">
                  <a href={`/pay/${page.slug}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="sm">Preview</Button>
                  </a>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(page.id)} style={{ color: "#ef4444" }}>
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
