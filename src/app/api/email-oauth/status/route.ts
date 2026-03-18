import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET — Return the user's OAuth email connections (no tokens exposed).
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: connections, error } = await supabase
    .from("rk_email_oauth_connections")
    .select("provider, email, status, created_at, updated_at")
    .eq("user_id", user.id);

  if (error) {
    console.error("[email-oauth] Status fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch connections" }, { status: 500 });
  }

  return NextResponse.json({ connections: connections || [] });
}
