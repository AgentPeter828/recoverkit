/**
 * Stripe Connect OAuth service — handles connecting customer Stripe accounts.
 * Falls back to mock data when STRIPE_SECRET_KEY is not set.
 */

import { stripe } from "@/lib/stripe/client";
import { cookies } from "next/headers";

const STRIPE_CLIENT_ID = process.env.STRIPE_CLIENT_ID;
const STRIPE_TEST_CONNECTED_ACCOUNT = process.env.STRIPE_TEST_CONNECTED_ACCOUNT;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const IS_MOCK = process.env.NEXT_PUBLIC_MOCK_MODE === "true";

const OAUTH_STATE_COOKIE = "stripe_oauth_state";

interface ConnectResult {
  stripe_account_id: string;
  access_token: string;
  refresh_token: string | null;
  livemode: boolean;
  scope: string;
}

/**
 * Generate OAuth URL with CSRF state parameter.
 * Stores state in an httpOnly cookie for validation on callback.
 */
export async function getOAuthUrl(): Promise<string> {
  const state = crypto.randomUUID();

  // Store state in httpOnly cookie (expires in 10 minutes)
  const cookieStore = await cookies();
  cookieStore.set(OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600, // 10 minutes
    path: "/",
  });

  if (!STRIPE_CLIENT_ID) {
    if (IS_MOCK) {
      console.warn("[stripe-connect] Mock mode: returning mock OAuth URL");
      return `${APP_URL}/api/stripe-connect/callback?code=mock_auth_code&state=${state}`;
    }
    if (STRIPE_TEST_CONNECTED_ACCOUNT) {
      console.warn("[stripe-connect] Test mode: using pre-seeded test account");
      return `${APP_URL}/api/stripe-connect/callback?code=test_auth_code&state=${state}`;
    }
    console.error("[stripe-connect] No STRIPE_CLIENT_ID configured — cannot start OAuth flow");
    return `${APP_URL}/dashboard/connect?error=missing_stripe_client_id`;
  }

  const params = new URLSearchParams({
    response_type: "code",
    client_id: STRIPE_CLIENT_ID,
    scope: "read_write",
    redirect_uri: `${APP_URL}/api/stripe-connect/callback`,
    state,
  });

  return `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
}

/**
 * Validate the OAuth state parameter against the stored cookie.
 * Returns true if valid, false if CSRF mismatch.
 */
export async function validateOAuthState(state: string | null): Promise<boolean> {
  if (!state) return false;

  const cookieStore = await cookies();
  const storedState = cookieStore.get(OAUTH_STATE_COOKIE)?.value;

  // Clean up the cookie
  cookieStore.delete(OAUTH_STATE_COOKIE);

  if (!storedState) return false;
  return state === storedState;
}

export async function exchangeCode(code: string): Promise<ConnectResult> {
  // Mock mode — fully fake data
  if (code === "mock_auth_code") {
    console.warn("[stripe-connect] Using mock OAuth exchange");
    return {
      stripe_account_id: "acct_mock_" + Math.random().toString(36).slice(2, 10),
      access_token: "sk_test_mock_" + Math.random().toString(36).slice(2, 18),
      refresh_token: "rt_mock_" + Math.random().toString(36).slice(2, 18),
      livemode: false,
      scope: "read_write",
    };
  }

  // Test mode — real Stripe test account, no OAuth
  if (code === "test_auth_code" && STRIPE_TEST_CONNECTED_ACCOUNT) {
    console.warn("[stripe-connect] Using pre-seeded test connected account");
    return {
      stripe_account_id: STRIPE_TEST_CONNECTED_ACCOUNT,
      access_token: "sk_test_connected_" + Math.random().toString(36).slice(2, 18),
      refresh_token: null,
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
