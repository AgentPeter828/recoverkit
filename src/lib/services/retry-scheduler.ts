/**
 * Smart retry scheduler — exponential backoff with optimal timing.
 * Research shows retries on Tuesdays/Wednesdays at 10am have highest success rates.
 */

interface RetrySchedule {
  attempt_number: number;
  delay_hours: number;
  scheduled_at: Date;
}

const OPTIMAL_RETRY_HOURS = [10, 14, 17]; // 10am, 2pm, 5pm local
const OPTIMAL_DAYS = [2, 3, 4]; // Tue, Wed, Thu

/**
 * Calculate the next retry time using exponential backoff + optimal timing.
 * Base delays: 4h, 24h, 72h, 120h, 168h (1 week)
 */
export function getNextRetryTime(attemptNumber: number, fromDate: Date = new Date()): Date {
  const baseDelays = [4, 24, 72, 120, 168]; // hours
  const delayHours = baseDelays[Math.min(attemptNumber - 1, baseDelays.length - 1)];

  const targetDate = new Date(fromDate.getTime() + delayHours * 60 * 60 * 1000);

  // Snap to nearest optimal hour
  const hour = targetDate.getHours();
  const nearestOptimalHour = OPTIMAL_RETRY_HOURS.reduce((prev, curr) =>
    Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev
  );
  targetDate.setHours(nearestOptimalHour, 0, 0, 0);

  // If we snapped backwards, move forward one day
  if (targetDate.getTime() < fromDate.getTime() + delayHours * 60 * 60 * 1000 * 0.5) {
    targetDate.setDate(targetDate.getDate() + 1);
  }

  return targetDate;
}

/**
 * Generate the full retry schedule for a campaign.
 */
export function generateRetrySchedule(maxRetries: number = 5, startDate: Date = new Date()): RetrySchedule[] {
  const schedule: RetrySchedule[] = [];
  let lastDate = startDate;

  for (let i = 1; i <= maxRetries; i++) {
    const scheduledAt = getNextRetryTime(i, lastDate);
    const delayHours = Math.round((scheduledAt.getTime() - lastDate.getTime()) / (60 * 60 * 1000));
    schedule.push({
      attempt_number: i,
      delay_hours: delayHours,
      scheduled_at: scheduledAt,
    });
    lastDate = scheduledAt;
  }

  return schedule;
}

/**
 * Attempt to retry a payment via Stripe.
 * Falls back to mock when stripe connection is mock.
 */
export async function retryPayment(
  invoiceId: string,
  accessToken: string
): Promise<{ success: boolean; payment_intent_id?: string; error?: string }> {
  if (accessToken.startsWith("sk_test_mock_")) {
    console.warn("[retry-scheduler] Mock retry for invoice:", invoiceId);
    const success = Math.random() > 0.4; // 60% mock success rate
    return {
      success,
      payment_intent_id: success ? "pi_mock_" + Math.random().toString(36).slice(2, 10) : undefined,
      error: success ? undefined : "card_declined",
    };
  }

  try {
    const Stripe = (await import("stripe")).default;
    const connectedStripe = new Stripe(accessToken, { apiVersion: "2025-02-24.acacia" });
    const invoice = await connectedStripe.invoices.pay(invoiceId);
    return {
      success: invoice.status === "paid",
      payment_intent_id: typeof invoice.payment_intent === "string" ? invoice.payment_intent : invoice.payment_intent?.id,
      error: invoice.status !== "paid" ? "payment_failed" : undefined,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { success: false, error: message };
  }
}
