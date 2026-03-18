import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const MICROSOFT_CLIENT_ID = process.env.MICROSOFT_CLIENT_ID;
const MICROSOFT_CLIENT_SECRET = process.env.MICROSOFT_CLIENT_SECRET;

/**
 * GET — Microsoft OAuth callback. Exchanges code for tokens and stores the connection.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state"); // user_id
  const error = searchParams.get("error");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (error) {
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_denied`);
  }

  if (!code || !state) {
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_invalid`);
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

  const redirectUri = `${appUrl}/api/email-oauth/outlook/callback`;

  // Mock mode
  if (!MICROSOFT_CLIENT_ID || !MICROSOFT_CLIENT_SECRET) {
    const admin = getSupabaseAdmin();
    const mockEmail = `user-${userId.slice(0, 8)}@outlook.com`;

    await admin.from("rk_email_oauth_connections").upsert(
      {
        user_id: userId,
        provider: "outlook",
        email: mockEmail,
        access_token: "mock_access_token_outlook",
        refresh_token: "mock_refresh_token_outlook",
        token_expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
        status: "connected",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,provider" }
    );

    await logAudit(userId, "email_oauth_connected", { provider: "outlook", email: mockEmail, mock: true });
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?connected=outlook`);
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: MICROSOFT_CLIENT_ID,
        client_secret: MICROSOFT_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenRes.ok) {
      console.error("[outlook-oauth] Token exchange failed:", await tokenRes.text());
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_token_failed`);
    }

    const tokens = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokens;

    if (!access_token || !refresh_token) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_no_refresh`);
    }

    // Fetch user email from Microsoft Graph
    const meRes = await fetch("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!meRes.ok) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_userinfo_failed`);
    }

    const meData = await meRes.json();
    const email = meData.mail || meData.userPrincipalName;

    if (!email) {
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_no_email`);
    }

    // Store in database
    const admin = getSupabaseAdmin();
    const { error: dbError } = await admin.from("rk_email_oauth_connections").upsert(
      {
        user_id: userId,
        provider: "outlook",
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
      console.error("[outlook-oauth] DB upsert failed:", dbError);
      return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_db_failed`);
    }

    await logAudit(userId, "email_oauth_connected", { provider: "outlook", email });
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?connected=outlook`);
  } catch (err) {
    console.error("[outlook-oauth] Callback error:", err);
    return NextResponse.redirect(`${appUrl}/dashboard/email-setup?error=outlook_unknown`);
  }
}
