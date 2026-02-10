import { createBrowserClient as createClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function createBrowserClient() {
  if (!isSupabaseConfigured) {
    // Return null when Supabase isn't configured (dev/preview mode)
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
