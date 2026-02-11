import Stripe from "stripe";
import crypto from "crypto";
import { requireEnv } from "./env";

let _stripe: Stripe | null = null;

/**
 * Get a Stripe client for testing.
 */
export function getStripeClient(): Stripe {
  if (!_stripe) {
    const key = requireEnv("STRIPE_SECRET_KEY");
    _stripe = new Stripe(key, { apiVersion: "2025-02-24.acacia" });
  }
  return _stripe;
}

/**
 * Create a test Stripe customer.
 */
export async function createTestCustomer(
  email: string
): Promise<Stripe.Customer> {
  const client = getStripeClient();
  return client.customers.create({ email, metadata: { test: "true" } });
}

/**
 * Delete a test Stripe customer.
 */
export async function deleteTestCustomer(customerId: string): Promise<void> {
  const client = getStripeClient();
  await client.customers.del(customerId);
}

/**
 * Generate a valid Stripe webhook signature for testing.
 */
export function generateWebhookSignature(
  payload: string,
  secret: string
): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const signedPayload = `${timestamp}.${payload}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(signedPayload)
    .digest("hex");
  return `t=${timestamp},v1=${signature}`;
}

/**
 * Build a fake Stripe event payload for webhook testing.
 */
export function buildWebhookPayload(
  eventType: string,
  data: Record<string, unknown>
): string {
  const event = {
    id: `evt_test_${crypto.randomUUID()}`,
    object: "event",
    type: eventType,
    data: { object: data },
    created: Math.floor(Date.now() / 1000),
    livemode: false,
    pending_webhooks: 1,
    api_version: "2025-02-24.acacia",
  };
  return JSON.stringify(event);
}
