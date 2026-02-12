/**
 * Email service — sends dunning emails via Resend.
 * Falls back to mock when RESEND_API_KEY is not set.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "RecoverKit <noreply@recoverkit.dev>";

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface SendEmailResult {
  success: boolean;
  message_id?: string;
  error?: string;
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  if (!RESEND_API_KEY) {
    console.warn("[email-service] No RESEND_API_KEY, mock sending email to:", params.to);
    return {
      success: true,
      message_id: "mock_msg_" + Math.random().toString(36).slice(2, 12),
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
        from: FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      return { success: false, error: errBody };
    }

    const data = await res.json();
    return { success: true, message_id: data.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
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
