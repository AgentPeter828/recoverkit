"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function SequencesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Card className="p-8 text-center">
        <p className="text-4xl mb-4">Something went wrong</p>
        <p className="mb-2 font-semibold text-lg">Couldn&apos;t load sequences</p>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <Button variant="primary" onClick={reset}>
          Try Again
        </Button>
      </Card>
    </div>
  );
}
