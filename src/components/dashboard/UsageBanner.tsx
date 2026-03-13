import Link from "next/link";
import { Button } from "@/components/ui/Button";

interface UsageBannerProps {
  current: number;
  limit: number;
  queuedCount: number;
  planName: string;
}

export function UsageBanner({ current, limit, queuedCount, planName }: UsageBannerProps) {
  // Don't show for unlimited plans or when under 80%
  if (limit === Infinity || !isFinite(limit)) return null;

  const usagePercent = Math.round((current / limit) * 100);
  if (usagePercent < 80) return null;

  const isAtLimit = current >= limit;

  return (
    <div
      className="rounded-xl border p-4 mb-6 flex items-center justify-between gap-4 flex-wrap"
      style={{
        background: isAtLimit ? "#fef2f2" : "#fffbeb",
        borderColor: isAtLimit ? "#fecaca" : "#fde68a",
      }}
    >
      <div className="flex items-start gap-3 min-w-0">
        <span className="text-xl leading-none shrink-0 mt-0.5">
          {isAtLimit ? "🚨" : "⚠️"}
        </span>
        <div>
          <p
            className="text-sm font-semibold"
            style={{ color: isAtLimit ? "#991b1b" : "#92400e" }}
          >
            {isAtLimit
              ? `You've hit your ${planName} recovery limit`
              : `You've used ${current} of ${limit} recoveries this month`}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{ color: isAtLimit ? "#b91c1c" : "#a16207" }}
          >
            {isAtLimit
              ? `${queuedCount} failed payment${queuedCount !== 1 ? "s are" : " is"} queued and won't be recovered until you upgrade.`
              : "Upgrade to avoid missing failed payments."}
          </p>
        </div>
      </div>
      <Link href="/pricing" className="shrink-0">
        <Button
          variant="primary"
          size="sm"
          style={
            isAtLimit
              ? { background: "#dc2626" }
              : { background: "#d97706" }
          }
        >
          Upgrade Now
        </Button>
      </Link>
    </div>
  );
}
