"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createBrowserClient } from "@/lib/supabase/client";
import { analytics } from "@/lib/mixpanel";

const INDUSTRIES = [
  {
    id: "saas",
    emoji: "🔧",
    label: "SaaS / Developer Tools",
    desc: "Software subscriptions, dev tools, APIs",
    color: "#6366f1",
  },
  {
    id: "education",
    emoji: "🎓",
    label: "Online Education",
    desc: "Courses, memberships, coaching",
    color: "#8b5cf6",
  },
  {
    id: "fitness",
    emoji: "💪",
    label: "Fitness & Wellness",
    desc: "Gym memberships, health apps, coaching",
    color: "#10b981",
  },
  {
    id: "creative",
    emoji: "🎨",
    label: "Creative & Design",
    desc: "Design tools, media platforms, content",
    color: "#f59e0b",
  },
  {
    id: "agency",
    emoji: "🏢",
    label: "Agency & Consulting",
    desc: "Retainers, project billing, services",
    color: "#3b82f6",
  },
  {
    id: "other",
    emoji: "📦",
    label: "Other",
    desc: "Something else entirely",
    color: "#6b7280",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleContinue() {
    if (!selected) return;
    setSaving(true);

    try {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Save business type to user metadata (no schema change needed)
      await supabase.auth.updateUser({
        data: {
          business_type: selected,
          onboarding_completed: true,
        },
      });

      analytics.track("onboarding_completed", { business_type: selected });

      router.push("/dashboard");
    } catch (err) {
      console.error("Failed to save:", err);
      // Still redirect — don't block onboarding on a DB error
      router.push("/dashboard");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-var(--header-height)-100px)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">👋</div>
          <h1 className="text-3xl font-bold mb-2">Welcome to RecoverKit!</h1>
          <p className="text-base" style={{ color: "var(--color-text-secondary)" }}>
            What type of business do you run? We&apos;ll customize your
            recovery emails to match your industry.
          </p>
        </div>

        {/* Industry cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
          {INDUSTRIES.map((industry) => {
            const isSelected = selected === industry.id;
            return (
              <button
                key={industry.id}
                onClick={() => setSelected(industry.id)}
                className="text-left rounded-xl p-5 transition-all"
                style={{
                  background: isSelected ? `${industry.color}10` : "var(--color-bg)",
                  border: isSelected
                    ? `2px solid ${industry.color}`
                    : "2px solid var(--color-border)",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div className="flex items-start gap-4">
                  <span
                    className="text-3xl flex items-center justify-center rounded-lg shrink-0"
                    style={{
                      width: 52,
                      height: 52,
                      background: isSelected ? `${industry.color}20` : "var(--color-bg-secondary)",
                    }}
                  >
                    {industry.emoji}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm">{industry.label}</p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {industry.desc}
                    </p>
                  </div>
                  {/* Checkmark */}
                  {isSelected && (
                    <div
                      className="shrink-0 flex items-center justify-center rounded-full ml-auto"
                      style={{
                        width: 24,
                        height: 24,
                        background: industry.color,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 7 L6 10 L11 4"
                          stroke="#fff"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <div className="text-center">
          <Button
            variant="primary"
            size="lg"
            onClick={handleContinue}
            disabled={!selected || saving}
          >
            {saving ? "Setting things up..." : "Continue →"}
          </Button>
          <p
            className="text-xs mt-3"
            style={{ color: "var(--color-text-secondary)" }}
          >
            You can change this anytime in settings
          </p>
        </div>
      </div>
    </div>
  );
}
