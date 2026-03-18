/**
 * Gmail send service — sends emails via Gmail API using stored OAuth tokens.
 * Handles token refresh automatically.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

interface GmailSendParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface GmailSendResult {
  success: boolean;
  message_id?: string;
  error?: string;
}

/**
 * Build an RFC 2822 email message and base64url-encode it for the Gmail API.
 */
function buildRawEmail(from: string, to: string, subject: string, html: string, text?: string): string {
  const boundary = `boundary_${crypto.randomUUID().replace(/-/g, "")}`;

  const parts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    `Content-Type: text/plain; charset="UTF-8"`,
    "",
    text || html.replace(/<[^>]*>/g, ""),
    `--${boundary}`,
    `Content-Type: text/html; charset="UTF-8"`,
    "",
    html,
    `--${boundary}--`,
  ];

  const rawMessage = parts.join("\r\n");

  // Base64url encode
  const encoded = Buffer.from(rawMessage)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encoded;
}

/**
 * Refresh an expired Gmail access token using the refresh token.
 */
async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    console.error("[gmail-service] Token refresh failed:", await res.text());
    return null;
  }

  return res.json();
}

/**
 * Send an email via Gmail API using the user's stored OAuth tokens.
 * Automatically refreshes expired access tokens.
 */
export async function sendViaGmail(userId: string, params: GmailSendParams): Promise<GmailSendResult> {
  const admin = getSupabaseAdmin();

  // Fetch stored tokens
  const { data: tokenRow, error: fetchError } = await admin
    .from("rk_email_oauth_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "gmail")
    .single();

  if (fetchError || !tokenRow) {
    return { success: false, error: "No Gmail OAuth tokens found for user" };
  }

  let accessToken = tokenRow.access_token;

  // Refresh if expired (with 60s buffer)
  const expiresAt = new Date(tokenRow.expires_at).getTime();
  if (Date.now() > expiresAt - 60_000) {
    const refreshed = await refreshAccessToken(tokenRow.refresh_token);
    if (!refreshed) {
      return { success: false, error: "Failed to refresh Gmail access token" };
    }

    accessToken = refreshed.access_token;
    const newExpiresAt = new Date(Date.now() + refreshed.expires_in * 1000).toISOString();

    await admin
      .from("rk_email_oauth_tokens")
      .update({
        access_token: accessToken,
        expires_at: newExpiresAt,
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", userId)
      .eq("provider", "gmail");
  }

  // Build and send email
  const raw = buildRawEmail(tokenRow.email, params.to, params.subject, params.html, params.text);

  try {
    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[gmail-service] Send failed:", errBody);
      return { success: false, error: `Gmail API error: ${res.status}` };
    }

    const data = await res.json();
    return { success: true, message_id: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
