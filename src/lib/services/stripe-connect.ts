/**
 * Stripe Connect OAuth service — handles connecting customer Stripe accounts.
 * Falls back to mock data when STRIPE_SECRET_KEY is not set.
 */

import { stripe } from "@/lib/stripe/client";

const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface ConnectResult {
  stripe_account_id: string;
  access_token: string;
  refresh_token: string | null;
  livemode: boolean;
  scope: string;
}

export function getOAuthUrl(): string {
  if (!STRIPE_CLIENT_ID) {
    console.warn("[stripe-connect] No STRIPE_CLIENT_ID, returning mock OAuth URL");
    return `${APP_URL}/api/stripe-connect/callback?code=mock_auth_code`;
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: STRIPE_CLIENT_ID,
    scope: "read_write",
    redirect_uri: `${APP_URL}/api/stripe-connect/callback`,
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

export async function exchangeCode(code: string): Promise<ConnectResult> {
  if (!STRIPE_CLIENT_ID || code === "mock_auth_code") {
    console.warn("[stripe-connect] Using mock OAuth exchange");
    return {
      stripe_account_id: "acct_mock_" + Math.random().toString(36).slice(2, 10),
      access_token: "sk_test_mock_" + Math.random().toString(36).slice(2, 18),
      refresh_token: "rt_mock_" + Math.random().toString(36).slice(2, 18),
      livemode: false,
      scope: "read_write",
    };
  }

  const response = await stripe.oauth.token({
    grant_type: "authorization_code",
    code,
  });

  return {
    stripe_account_id: response.stripe_user_id!,
    access_token: response.access_token!,
    refresh_token: response.refresh_token ?? null,
    livemode: response.livemode ?? false,
    scope: response.scope ?? "read_write",
  };
}

export async function getAccountInfo(accountId: string): Promise<{ business_name: string | null }> {
  if (accountId.startsWith("acct_mock_")) {
    return { business_name: "Mock Business Co." };
  }

  try {
    const account = await stripe.accounts.retrieve(accountId);
    return { business_name: account.business_profile?.name ?? account.settings?.dashboard?.display_name ?? null };
  } catch {
    return { business_name: null };
  }
}
