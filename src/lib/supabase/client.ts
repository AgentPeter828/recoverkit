import { createBrowserClient as createClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export function createBrowserClient() {
  if (!isSupabaseConfigured) {
    // Log warning but still return a client — callers expect non-null
    console.warn("[supabase] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  }

  return createClient(SUPABASE_URL || "http://localhost:54321", SUPABASE_ANON_KEY || "placeholder");
}
