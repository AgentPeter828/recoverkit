import { createClient } from "@supabase/supabase-js";
import { stripe } from "./client";

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string | null;
  status: string;
  price_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase environment variables");
  }
  return createClient(url, serviceKey);
}

/**
 * Check if a user has an active Pro subscription.
 */
export async function isUserPro(userId: string): Promise<boolean> {
  const sub = await getSubscription(userId);
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
}

/**
 * Get subscription details for a user.
 */
export async function getSubscription(
  userId: string
): Promise<Subscription | null> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;
  return data as Subscription;
}

/**
 * Create or retrieve a Stripe customer for a given user.
 */
export async function createOrGetCustomer(
  userId: string,
  email: string
): Promise<string> {
  const supabase = getSupabaseAdmin();

  // Check if user already has a subscription record with a customer ID
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", userId)
    .single();

  if (existing?.stripe_customer_id) {
    return existing.stripe_customer_id;
  }

  // Create a new Stripe customer
  const customer = await stripe.customers.create({
    email,
    metadata: { supabase_user_id: userId },
  });

  // Upsert a subscription record with the new customer ID
  await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: customer.id,
      status: "inactive",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  return customer.id;
}
