import { createClient } from "@supabase/supabase-js";
import { requireEnv } from "./env";

/** Default test user credentials */
export const TEST_USER = {
  email: "e2e-test@firestorm.test",
  password: "TestPassword123!",
} as const;

/** Secondary test user for multi-user scenarios */
export const TEST_USER_2 = {
  email: "e2e-test-2@firestorm.test",
  password: "TestPassword456!",
} as const;

/**
 * Generate an access token for a test user by signing in directly.
 * Requires Supabase to be running.
 */
export async function getTestUserToken(
  email: string,
  password: string
): Promise<string> {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const client = createClient(url, anonKey);

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(`Failed to get test token: ${error.message}`);
  return data.session.access_token;
}
