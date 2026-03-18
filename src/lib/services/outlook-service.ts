/**
 * Outlook send service — sends emails via Microsoft Graph API using stored OAuth tokens.
 * Handles token refresh automatically.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const AZURE_CLIENT_ID = process.env.AZURE_CLIENT_ID!;
const AZURE_CLIENT_SECRET = process.env.AZURE_CLIENT_SECRET!;
const AZURE_TENANT_ID = process.env.AZURE_TENANT_ID!;

interface OutlookSendParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface OutlookSendResult {
  success: boolean;
  message_id?: string;
  error?: string;
}

/**
 * Refresh an expired Outlook access token using the refresh token.
 */
async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  // Use 'common' to support any Microsoft account type
  const res = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: AZURE_CLIENT_ID,
      client_secret: AZURE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
      scope: "https://graph.microsoft.com/Mail.Send openid email offline_access",
    }),
  });

  if (!res.ok) {
    console.error("[outlook-service] Token refresh failed:", await res.text());
    return null;
  }

  return res.json();
}

/**
 * Send an email via Microsoft Graph API using the user's stored OAuth tokens.
 * Automatically refreshes expired access tokens.
 */
export async function sendViaOutlook(userId: string, params: OutlookSendParams): Promise<OutlookSendResult> {
  const admin = getSupabaseAdmin();

  // Fetch stored tokens
  const { data: tokenRow, error: fetchError } = await admin
    .from("rk_email_oauth_tokens")
    .select("*")
    .eq("user_id", userId)
    .eq("provider", "outlook")
    .single();

  if (fetchError || !tokenRow) {
    return { success: false, error: "No Outlook OAuth tokens found for user" };
  }

  let accessToken = tokenRow.access_token;

  // Refresh if expired (with 60s buffer)
  const expiresAt = new Date(tokenRow.expires_at).getTime();
  if (Date.now() > expiresAt - 60_000) {
    const refreshed = await refreshAccessToken(tokenRow.refresh_token);
    if (!refreshed) {
      return { success: false, error: "Failed to refresh Outlook access token" };
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
      .eq("provider", "outlook");
  }

  // Send email via Microsoft Graph
  try {
    const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: params.subject,
          body: {
            contentType: "HTML",
            content: params.html,
          },
          toRecipients: [
            {
              emailAddress: {
                address: params.to,
              },
            },
          ],
        },
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("[outlook-service] Send failed:", errBody);
      return { success: false, error: `Microsoft Graph API error: ${res.status}` };
    }

    // Microsoft Graph sendMail returns 202 with no body on success
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}
