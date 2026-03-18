import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET — Returns Gmail OAuth connection status for the current user.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("rk_email_oauth_tokens")
    .select("email")
    .eq("user_id", user.id)
    .eq("provider", "gmail")
    .single();

  if (data) {
    return NextResponse.json({ connected: true, email: data.email });
  }

  return NextResponse.json({ connected: false });
}
