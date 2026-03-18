import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * POST — Disconnect an OAuth email connection.
 * Body: { provider: 'gmail' | 'outlook' }
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const provider = body.provider;

  if (provider !== "gmail" && provider !== "outlook") {
    return NextResponse.json({ error: "Invalid provider. Must be 'gmail' or 'outlook'." }, { status: 400 });
  }

  const { error } = await supabase
    .from("rk_email_oauth_connections")
    .delete()
    .eq("user_id", user.id)
    .eq("provider", provider);

  if (error) {
    console.error("[email-oauth] Disconnect failed:", error);
    return NextResponse.json({ error: "Failed to disconnect" }, { status: 500 });
  }

  await logAudit(user.id, "email_oauth_disconnected", { provider });

  return NextResponse.json({ success: true });
}
