/**
 * Sends a one-time email when a user hits their plan's recovery limit.
 * Tracks via user metadata to avoid sending duplicates within a billing period.
 */

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { sendEmail } from "@/lib/services/email-service";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://recoverkit.dev";

export async function sendLimitReachedEmail(
  userId: string,
  planName: string,
  limit: number,
  queuedCount: number
): Promise<void> {
  const supabase = getSupabaseAdmin();

  // Check if we already sent this month
  const { data: { user } } = await supabase.auth.admin.getUserById(userId);
  if (!user) return;

  const lastSent = user.user_metadata?.limit_email_sent_at;
  if (lastSent) {
    const sentDate = new Date(lastSent);
    const now = new Date();
    // Same month and year = already sent
    if (sentDate.getMonth() === now.getMonth() && sentDate.getFullYear() === now.getFullYear()) {
      return;
    }
  }

  const email = user.email;
  if (!email) return;

  const upgradeUrl = `${APP_URL}/pricing`;
  const displayName = user.user_metadata?.full_name || email.split("@")[0];

  await sendEmail({
    to: email,
    subject: `You've hit your ${planName} recovery limit`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;padding:20px;color:#1a1a1a;">
  <div style="border-bottom:2px solid #6366f1;padding-bottom:16px;margin-bottom:24px;">
    <h2 style="margin:0;color:#6366f1;">RecoverKit</h2>
  </div>
  <p>Hi ${displayName},</p>
  <p>You've hit your <strong>${planName}</strong> plan limit of <strong>${limit} recoveries</strong> this month.</p>
  <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:16px;margin:24px 0;">
    <p style="margin:0;color:#991b1b;font-weight:600;">
      ${queuedCount} failed payment${queuedCount !== 1 ? "s are" : " is"} queued but NOT being recovered.
    </p>
    <p style="margin:8px 0 0;color:#991b1b;font-size:14px;">
      These customers have payment issues, but RecoverKit can't help them until you upgrade.
    </p>
  </div>
  <p>Upgrade your plan to immediately start recovering these payments.</p>
  <div style="margin-top:32px;text-align:center;">
    <a href="${upgradeUrl}" style="display:inline-block;background:#6366f1;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;">Upgrade Now</a>
  </div>
  <p style="margin-top:32px;font-size:13px;color:#6b7280;">
    You're on the ${planName} plan (${limit} recoveries/month). Upgrading will automatically activate your queued recoveries.
  </p>
</body>
</html>`,
    text: `Hi ${displayName}, you've hit your ${planName} plan limit of ${limit} recoveries this month. ${queuedCount} failed payment(s) are queued but NOT being recovered. Upgrade at ${upgradeUrl} to start recovering them.`,
  });

  // Mark as sent for this month
  await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      ...user.user_metadata,
      limit_email_sent_at: new Date().toISOString(),
    },
  });

  console.log(`[limit-notifications] Sent limit-reached email to ${email}`);
}
