import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * GET — Redirect the user to Google OAuth consent screen.
 * If GOOGLE_CLIENT_ID is not set, runs a mock flow.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const redirectUri = `${appUrl}/api/email-oauth/gmail/callback`;

  // Mock mode: simulate OAuth connection
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    const mockUrl = `${appUrl}/api/email-oauth/gmail/callback?code=mock_code&state=${user.id}`;
    return NextResponse.redirect(mockUrl);
  }

  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/gmail.send email profile",
    access_type: "offline",
    prompt: "consent",
    state: user.id,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
