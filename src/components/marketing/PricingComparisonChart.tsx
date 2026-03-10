"use client";

import { useEffect, useRef, useState } from "react";

interface CompetitorBar {
  name: string;
  priceAUD: number; // monthly price in AUD for bar width
  priceLabel: string; // display label
  isRecoverKit?: boolean;
  note?: string; // e.g. "contact sales"
}

const competitors: CompetitorBar[] = [
  {
    name: "RecoverKit",
    priceAUD: 29,
    priceLabel: "$29 AUD/mo",
    isRecoverKit: true,
  },
  {
    name: "Baremetrics Recover",
    priceAUD: 98,
    priceLabel: "$69 USD/mo (~$98 AUD)",
  },
  {
    name: "Stunning",
    priceAUD: 170,
    priceLabel: "~$120 USD/mo (~$170 AUD)",
  },
  {
    name: "Churn Buster",
    priceAUD: 354,
    priceLabel: "$249 USD/mo (~$354 AUD)",
  },
  {
    name: "Churnkey",
    priceAUD: 355,
    priceLabel: "$250 USD/mo (~$355 AUD)",
  },
  {
    name: "Gravy Solutions",
    priceAUD: 450,
    priceLabel: "Custom (contact sales)",
    note: "No public pricing",
  },
];

export function PricingComparisonChart() {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const maxPrice = Math.max(...competitors.map((c) => c.priceAUD));

  return (
    <div ref={ref} className="w-full">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Monthly cost comparison
        </h2>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          All prices converted to AUD for a fair comparison
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {competitors.map((comp, i) => {
          const widthPercent = (comp.priceAUD / maxPrice) * 100;
          return (
            <div key={comp.name} className="group">
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-sm font-medium ${
                    comp.isRecoverKit ? "" : ""
                  }`}
                  style={
                    comp.isRecoverKit
                      ? { color: "var(--color-brand)" }
                      : undefined
                  }
                >
                  {comp.name}
                </span>
                <span
                  className="text-sm tabular-nums"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {comp.priceLabel}
                </span>
              </div>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{
                  background: "var(--color-bg-secondary)",
                  height: "32px",
                }}
              >
                <div className="flex items-center gap-2 h-full">
                  <div
                    className="h-full rounded-full transition-all duration-1000 ease-out shrink-0"
                    style={{
                      width: isVisible ? `${Math.max(widthPercent, 6)}%` : "0%",
                      background: comp.isRecoverKit
                        ? "var(--color-brand)"
                        : "var(--color-text-secondary)",
                      opacity: comp.isRecoverKit ? 1 : 0.25,
                      transitionDelay: `${i * 120}ms`,
                    }}
                  />
                  {comp.isRecoverKit && isVisible && (
                    <span
                      className="text-xs font-bold whitespace-nowrap"
                      style={{ color: "var(--color-brand)" }}
                    >
                      {comp.priceLabel}
                    </span>
                  )}
                </div>
              </div>
              {comp.note && (
                <p
                  className="text-xs mt-0.5 italic"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {comp.note}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p
        className="text-center text-xs mt-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Gravy doesn&apos;t publish pricing — bar shown for visual comparison
        only. Prices as of March 2026.
      </p>
    </div>
  );
}
