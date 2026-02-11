import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { requireEnv } from "./env";

let _adminClient: SupabaseClient | null = null;

/**
 * Get a Supabase admin client using the service role key.
 */
export function getAdminClient(): SupabaseClient {
  if (!_adminClient) {
    const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    _adminClient = createClient(url, serviceKey);
  }
  return _adminClient;
}

interface TestUser {
  id: string;
  email: string;
}

/**
 * Create a test user via Supabase admin API.
 */
export async function createTestUser(
  email: string,
  password: string
): Promise<TestUser> {
  const admin = getAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) throw new Error(`Failed to create test user: ${error.message}`);
  return { id: data.user.id, email: data.user.email ?? email };
}

/**
 * Delete a test user by ID.
 */
export async function deleteTestUser(userId: string): Promise<void> {
  const admin = getAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw new Error(`Failed to delete test user: ${error.message}`);
}

/**
 * Clean up subscription records for a user.
 */
export async function cleanupSubscription(userId: string): Promise<void> {
  const admin = getAdminClient();
  await admin.from("subscriptions").delete().eq("user_id", userId);
}
