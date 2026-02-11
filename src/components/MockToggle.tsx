"use client";

import { useEffect, useState } from "react";
import { isMockMode, setMockMode } from "@/lib/mock/config";

export function MockToggle() {
  const [mock, setMock] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setMock(isMockMode());
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => {
        const next = !mock;
        setMockMode(next);
        setMock(next);
        window.location.reload();
      }}
      className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg border transition-colors"
      style={{
        background: mock ? "#fef3c7" : "var(--color-bg)",
        borderColor: mock ? "#f59e0b" : "var(--color-border)",
        color: mock ? "#92400e" : "var(--color-text-secondary)",
      }}
      title={mock ? "Using mock data — click to switch to live" : "Using live data — click to switch to mock"}
    >
      <span className="text-sm">{mock ? "🧪" : "🔴"}</span>
      {mock ? "Mock Mode" : "Live Mode"}
    </button>
  );
}
