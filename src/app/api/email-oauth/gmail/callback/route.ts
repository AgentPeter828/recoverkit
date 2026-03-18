import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

/**
 * GET — Google OAuth callback. Exchanges code for tokens and stores the connection.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user_id
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_invalid`);
  }

  // Try to get user from cookie first, fall back to state param
  let userId = state;
  try {
    const supabase = await createServerComponentClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) userId = user.id;
  } catch {
    // Cookie auth failed, use state param
  }

  const redirectUri = `${appUrl}/api/email-oauth/gmail/callback`;

  // Mock mode
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    const admin = getSupabaseAdmin();
    const mockEmail = `user-${userId.slice(0, 8)}@gmail.com`;

    await admin.from("rk_email_oauth_connections").upsert(
      {
        user_id: userId,
        provider: "gmail",
        email: mockEmail,
        access_token: "mock_access_token_gmail",
        refresh_token: "mock_refresh_token_gmail",
        token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: "connected",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    await logAudit(userId, "email_oauth_connected", { provider: "gmail", email: mockEmail, mock: true });
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?connected=gmail`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("[gmail-oauth] Token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_token_failed`);
    }

    const tokens = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokens;

    if (!access_token || !refresh_token) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_no_refresh`);
    }

    // Fetch user email from Google
    const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userInfoRes.ok) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_userinfo_failed`);
    }

    const userInfo = await userInfoRes.json();
    const email = userInfo.email;

    if (!email) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_no_email`);
    }

    // Store in database
    const admin = getSupabaseAdmin();
    const { error: dbError } = await admin.from("rk_email_oauth_connections").upsert(
      {
        user_id: userId,
        provider: "gmail",
        email,
        access_token,
        refresh_token,
        token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
        status: "connected",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    if (dbError) {
      console.error("[gmail-oauth] DB upsert failed:", dbError);
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_db_failed`);
    }

    await logAudit(userId, "email_oauth_connected", { provider: "gmail", email });
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?connected=gmail`);
  } catch (err) {
    console.error("[gmail-oauth] Callback error:", err);
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=gmail_unknown`);
  }
}
