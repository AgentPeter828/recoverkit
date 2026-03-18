/**
 * Email service — sends dunning emails via Resend, Gmail OAuth, or Outlook OAuth.
 * Falls back to mock when RESEND_API_KEY is not set.
 * Uses verified customer domain when available, otherwise defaults to RecoverKit sender.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const DEFAULT_FROM_EMAIL = process.env.FROM_EMAIL || "RecoverKit <noreply@mail.recoverkit.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string; // Override sender (e.g. "AppName <billing@theirapp.com>")
}

interface SendEmailResult {
  success: boolean;
  message_id?: string;
  error?: string;
  sent_via?: "resend" | "gmail" | "outlook" | "mock";
}

interface OAuthConnection {
  id: string;
  user_id: string;
  provider: "gmail" | "outlook";
  email: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  status: string;
}

/**
 * Send an email, automatically choosing the best available channel.
 * Priority: OAuth (Gmail/Outlook) → Resend → Mock
 */
export async function sendEmail(params: SendEmailParams & { userId?: string }): Promise<SendEmailResult> {
  // If we have a userId, check for an active OAuth connection
  if (params.userId) {
    const oauthResult = await trySendViaOAuth(params.userId, params);
    if (oauthResult) return oauthResult;
  }

  // Fall back to Resend
  return sendViaResend(params);
}

/**
 * Try to send via OAuth. Returns null if no active connection exists.
 */
async function trySendViaOAuth(userId: string, params: SendEmailParams): Promise<SendEmailResult | null> {
  try {
    const admin = getSupabaseAdmin();
    const { data: connections } = await admin
      .from("rk_email_oauth_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "connected")
      .order("updated_at", { ascending: false })
      .limit(1);

    if (!connections || connections.length === 0) return null;

    const connection = connections[0] as OAuthConnection;

    // Refresh token if expired
    const refreshedConnection = await ensureFreshToken(connection);
    if (!refreshedConnection) return null;

    if (refreshedConnection.provider === "gmail") {
      return await sendViaGmail(refreshedConnection, params);
    } else if (refreshedConnection.provider === "outlook") {
      return await sendViaOutlook(refreshedConnection, params);
    }

    return null;
  } catch (err) {
    console.error("[email-service] OAuth send attempt failed, falling back:", err);
    return null;
  }
}

/**
 * Ensure the OAuth token is fresh. Refreshes if expired.
 * Returns the updated connection or null if refresh failed.
 */
async function ensureFreshToken(connection: OAuthConnection): Promise<OAuthConnection | null> {
  const expiresAt = new Date(connection.token_expires_at).getTime();
  const now = Date.now();

  // Token still valid (with 5-min buffer)
  if (expiresAt > now + 5 * 60 * 1000) {
    return connection;
  }

  // Mock tokens don't need refreshing
  if (connection.access_token.startsWith("mock_")) {
    return connection;
  }

  try {
    const refreshed = await refreshOAuthToken(connection);
    return refreshed;
  } catch (err) {
    console.error(`[email-service] Token refresh failed for ${connection.provider}:`, err);

    // Mark connection as expired
    const admin = getSupabaseAdmin();
    await admin
      .from("rk_email_oauth_connections")
      .update({ status: "expired", updated_at: new Date().toISOString() })
      .eq("id", connection.id);

    return null;
  }
}

/**
 * Refresh an OAuth token and update the database.
 */
async function refreshOAuthToken(connection: OAuthConnection): Promise<OAuthConnection> {
  if (connection.provider === "gmail") {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("Google OAuth not configured");

    const res = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: connection.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) throw new Error(`Google token refresh failed: ${await res.text()}`);
    const data = await res.json();

    const newExpiry = new Date(Date.now() + data.expires_in * 1000).toISOString();
    const admin = getSupabaseAdmin();
    await admin
      .from("rk_email_oauth_connections")
      .update({
        access_token: data.access_token,
        token_expires_at: newExpiry,
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

    return { ...connection, access_token: data.access_token, token_expires_at: newExpiry };
  } else {
    // Outlook
    const clientId = process.env.MICROSOFT_CLIENT_ID;
    const clientSecret = process.env.MICROSOFT_CLIENT_SECRET;
    if (!clientId || !clientSecret) throw new Error("Microsoft OAuth not configured");

    const res = await fetch("https://login.microsoftonline.com/common/oauth2/v2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: connection.refresh_token,
        grant_type: "refresh_token",
      }),
    });

    if (!res.ok) throw new Error(`Microsoft token refresh failed: ${await res.text()}`);
    const data = await res.json();

    const newExpiry = new Date(Date.now() + data.expires_in * 1000).toISOString();
    const admin = getSupabaseAdmin();
    await admin
      .from("rk_email_oauth_connections")
      .update({
        access_token: data.access_token,
        refresh_token: data.refresh_token || connection.refresh_token,
        token_expires_at: newExpiry,
        updated_at: new Date().toISOString(),
      })
      .eq("id", connection.id);

    return {
      ...connection,
      access_token: data.access_token,
      refresh_token: data.refresh_token || connection.refresh_token,
      token_expires_at: newExpiry,
    };
  }
}

/**
 * Send email via Gmail API using RFC 2822 MIME message.
 */
async function sendViaGmail(connection: OAuthConnection, params: SendEmailParams): Promise<SendEmailResult> {
  // Mock mode
  if (connection.access_token.startsWith("mock_")) {
    console.warn("[email-service] Mock Gmail send to:", params.to);
    return {
      success: true,
      message_id: "mock_gmail_" + Math.random().toString(36).slice(2, 12),
      sent_via: "mock",
    };
  }

  try {
    // Build RFC 2822 MIME message
    const fromHeader = params.from || connection.email;
    const boundary = "boundary_" + Math.random().toString(36).slice(2, 12);

    const mimeLines = [
      `From: ${fromHeader}`,
      `To: ${params.to}`,
      `Subject: ${params.subject}`,
      `MIME-Version: 1.0`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      "",
    ];

    if (params.text) {
      mimeLines.push(
        `--${boundary}`,
        "Content-Type: text/plain; charset=UTF-8",
        "",
        params.text,
        ""
      );
    }

    mimeLines.push(
      `--${boundary}`,
      "Content-Type: text/html; charset=UTF-8",
      "",
      params.html,
      "",
      `--${boundary}--`
    );

    const mimeMessage = mimeLines.join("\r\n");

    // Base64url encode the MIME message
    const base64url = Buffer.from(mimeMessage)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: base64url }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[email-service] Gmail send failed:", errText);
      return { success: false, error: `Gmail API error: ${errText}`, sent_via: "gmail" };
    }

    const data = await res.json();
    return { success: true, message_id: data.id, sent_via: "gmail" };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Gmail send failed",
      sent_via: "gmail",
    };
  }
}

/**
 * Send email via Microsoft Graph API.
 */
async function sendViaOutlook(connection: OAuthConnection, params: SendEmailParams): Promise<SendEmailResult> {
  // Mock mode
  if (connection.access_token.startsWith("mock_")) {
    console.warn("[email-service] Mock Outlook send to:", params.to);
    return {
      success: true,
      message_id: "mock_outlook_" + Math.random().toString(36).slice(2, 12),
      sent_via: "mock",
    };
  }

  try {
    const message = {
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
      saveToSentItems: true,
    };

    const res = await fetch("https://graph.microsoft.com/v1.0/me/sendMail", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${connection.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("[email-service] Outlook send failed:", errText);
      return { success: false, error: `Outlook API error: ${errText}`, sent_via: "outlook" };
    }

    // Microsoft Graph sendMail returns 202 with no body on success
    return {
      success: true,
      message_id: "outlook_" + Math.random().toString(36).slice(2, 12),
      sent_via: "outlook",
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Outlook send failed",
      sent_via: "outlook",
    };
  }
}

/**
 * Send email via Resend API (original behavior).
 */
async function sendViaResend(params: SendEmailParams): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.warn("[email-service] No RESEND_API_KEY, mock sending email to:", params.to);
    return {
      success: true,
      message_id: "mock_msg_" + Math.random().toString(36).slice(2, 12),
      sent_via: "mock",
    };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: params.from || DEFAULT_FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: errBody, sent_via: "resend" };
    }

    const data = await res.json();
    return { success: true, message_id: data.id, sent_via: "resend" };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error", sent_via: "resend" };
  }
}

/**
 * Build dunning email HTML with payment update link.
 */
export function buildDunningEmailHtml(params: {
  customerName?: string;
  amount: string;
  currency: string;
  paymentUpdateUrl: string;
  businessName?: string;
  bodyHtml: string;
}): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="border-bottom:2px solid #6366f1;padding-bottom:16px;margin-bottom:24px;">
    <h2 style="margin:0;color:#6366f1;">${params.businessName || "RecoverKit"}</h2>
  </div>
  ${params.bodyHtml}
  <div style="margin-top:32px;text-align:center;">
    <a href="${params.paymentUpdateUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Update Payment Method</a>
  </div>
  <p style="margin-top:32px;font-size:13px;color:#6b7280;">
    This email was sent regarding a failed payment of ${params.amount} ${params.currency.toUpperCase()}.
    If you believe this is an error, please contact support.
  </p>
</body>
</html>`;
}
