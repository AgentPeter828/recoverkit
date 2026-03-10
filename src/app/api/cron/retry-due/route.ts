import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { retryPayment, getNextRetryTime } from "@/lib/services/retry-scheduler";
import { sendEmail, buildDunningEmailHtml } from "@/lib/services/email-service";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

const MAX_PER_RUN = 50;

/**
 * Cron endpoint — runs every 5 minutes (configured in vercel.json).
 * For each active campaign:
 *   1. Send the next dunning email if due
 *   2. Retry the Stripe payment if due
 * Authenticated via CRON_SECRET header.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date();
  const nowIso = now.toISOString();

  // ─── 1. SEND DUNNING EMAILS ───────────────────────────────────
  const emailResults = await processDunningEmails(supabase, now);

  // ─── 2. RETRY PAYMENTS ────────────────────────────────────────
  const retryResults = await processRetries(supabase, nowIso);

  console.log(
    `[cron] Emails sent: ${emailResults.sent}, skipped: ${emailResults.skipped}. ` +
    `Retries: ${retryResults.succeeded} recovered, ${retryResults.failed} failed.`
  );

  return NextResponse.json({
    emails: emailResults,
    retries: retryResults,
  });
}

/**
 * Find campaigns that are due for their next dunning email and send it.
 */
async function processDunningEmails(supabase: ReturnType<typeof getSupabaseAdmin>, now: Date) {
  let sent = 0;
  let skipped = 0;
  let errors = 0;

  // Get active campaigns with customer info
  const { data: campaigns } = await supabase
    .from("rk_recovery_campaigns")
    .select("id, user_id, customer_email, customer_name, amount_due, currency, created_at, stripe_invoice_id")
    .eq("status", "active")
    .not("customer_email", "is", null)
    .limit(MAX_PER_RUN);

  if (!campaigns || campaigns.length === 0) return { sent, skipped, errors };

  for (const campaign of campaigns) {
    try {
      // Get the user's default dunning sequence
      const { data: sequence } = await supabase
        .from("rk_dunning_sequences")
        .select("id")
        .eq("user_id", campaign.user_id)
        .eq("is_active", true)
        .eq("is_default", true)
        .single();

      if (!sequence) {
        skipped++;
        continue;
      }

      // Get all emails in the sequence, ordered by step
      const { data: emailSteps } = await supabase
        .from("rk_dunning_emails")
        .select("id, step_number, subject, body_html, body_text, delay_hours")
        .eq("sequence_id", sequence.id)
        .order("step_number", { ascending: true });

      if (!emailSteps || emailSteps.length === 0) {
        skipped++;
        continue;
      }

      // Check which emails have already been sent for this campaign
      const { data: sentEmails } = await supabase
        .from("rk_sent_emails")
        .select("dunning_email_id")
        .eq("campaign_id", campaign.id);

      const sentEmailIds = new Set((sentEmails || []).map((s) => s.dunning_email_id));

      // Find the next email to send
      const campaignCreated = new Date(campaign.created_at);
      let emailToSend = null;

      for (const step of emailSteps) {
        // Already sent this step
        if (sentEmailIds.has(step.id)) continue;

        // Check if enough time has passed since campaign creation
        const sendAfter = new Date(campaignCreated.getTime() + step.delay_hours * 60 * 60 * 1000);
        if (now >= sendAfter) {
          emailToSend = step;
          break; // Send the earliest unsent email that's due
        }
      }

      if (!emailToSend) {
        skipped++;
        continue;
      }

      // Get the user's verified email domain (if any)
      const { data: emailDomain } = await supabase
        .from("rk_email_domains")
        .select("from_name, from_email")
        .eq("user_id", campaign.user_id)
        .eq("status", "verified")
        .single();

      // Get the user's payment page for the CTA link
      const { data: paymentPage } = await supabase
        .from("rk_payment_update_pages")
        .select("slug")
        .eq("user_id", campaign.user_id)
        .eq("is_active", true)
        .single();

      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://recoverkit.dev";
      const paymentUpdateUrl = paymentPage
        ? `${baseUrl}/pay/${paymentPage.slug}?invoice=${campaign.stripe_invoice_id}`
        : `${baseUrl}/pay/update?invoice=${campaign.stripe_invoice_id}`;

      // Build the email
      const amountFormatted = (campaign.amount_due / 100).toFixed(2);
      const html = buildDunningEmailHtml({
        customerName: campaign.customer_name || undefined,
        amount: amountFormatted,
        currency: campaign.currency,
        paymentUpdateUrl,
        bodyHtml: emailToSend.body_html,
      });

      // Determine sender
      const from = emailDomain
        ? `${emailDomain.from_name || "Billing"} <${emailDomain.from_email}>`
        : undefined; // Falls back to default in email service

      // Send it
      const result = await sendEmail({
        to: campaign.customer_email!,
        subject: emailToSend.subject,
        html,
        text: emailToSend.body_text || undefined,
        from,
      });

      // Record the sent email
      await supabase.from("rk_sent_emails").insert({
        user_id: campaign.user_id,
        campaign_id: campaign.id,
        dunning_email_id: emailToSend.id,
        to_email: campaign.customer_email!,
        subject: emailToSend.subject,
        status: result.success ? "sent" : "failed",
        resend_message_id: result.message_id || null,
      });

      if (result.success) {
        sent++;
        await logAudit(campaign.user_id, "email_sent", {
          campaign_id: campaign.id,
          step_number: emailToSend.step_number,
          to: campaign.customer_email,
          source: "cron",
        });
      } else {
        errors++;
        console.error(
          `[cron] Failed to send email for campaign ${campaign.id}: ${result.error}`
        );
      }
    } catch (err) {
      errors++;
      console.error(`[cron] Error processing email for campaign ${campaign.id}:`, err);
    }
  }

  return { sent, skipped, errors };
}

/**
 * Find campaigns due for a payment retry and attempt them.
 */
async function processRetries(supabase: ReturnType<typeof getSupabaseAdmin>, nowIso: string) {
  let succeeded = 0;
  let failed = 0;

  const { data: campaigns } = await supabase
    .from("rk_recovery_campaigns")
    .select("id, user_id, stripe_invoice_id, retry_count, max_retries, amount_due, currency")
    .eq("status", "active")
    .lte("next_retry_at", nowIso)
    .order("next_retry_at", { ascending: true })
    .limit(MAX_PER_RUN);

  const dueCampaigns = (campaigns || []).filter(
    (c) => c.retry_count < c.max_retries
  );

  for (const campaign of dueCampaigns) {
    try {
      const { data: connection } = await supabase
        .from("rk_stripe_connections")
        .select("access_token")
        .eq("user_id", campaign.user_id)
        .single();

      if (!connection) {
        failed++;
        continue;
      }

      const attemptNumber = campaign.retry_count + 1;
      const result = await retryPayment(campaign.stripe_invoice_id, connection.access_token);

      // Record attempt
      await supabase.from("rk_recovery_attempts").insert({
        user_id: campaign.user_id,
        campaign_id: campaign.id,
        attempt_number: attemptNumber,
        attempt_type: "retry",
        status: result.success ? "success" : "failed",
        stripe_payment_intent_id: result.payment_intent_id || null,
        error_code: result.error || null,
        error_message: result.error || null,
        scheduled_at: nowIso,
        executed_at: new Date().toISOString(),
      });

      if (result.success) {
        await supabase
          .from("rk_recovery_campaigns")
          .update({
            status: "recovered",
            retry_count: attemptNumber,
            recovered_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", campaign.id);

        await logAudit(campaign.user_id, "retry_attempted", {
          campaign_id: campaign.id,
          attempt_number: attemptNumber,
          result: "recovered",
          amount: campaign.amount_due,
          currency: campaign.currency,
          source: "cron",
        });
        succeeded++;
      } else {
        const nextRetry =
          attemptNumber < campaign.max_retries
            ? getNextRetryTime(attemptNumber + 1)
            : null;

        await supabase
          .from("rk_recovery_campaigns")
          .update({
            retry_count: attemptNumber,
            status: attemptNumber >= campaign.max_retries ? "failed" : "active",
            next_retry_at: nextRetry?.toISOString() || null,
            failure_code: result.error || null,
            updated_at: new Date().toISOString(),
          })
          .eq("id", campaign.id);

        await logAudit(campaign.user_id, "retry_attempted", {
          campaign_id: campaign.id,
          attempt_number: attemptNumber,
          result: "failed",
          error: result.error,
          source: "cron",
        });
        failed++;
      }
    } catch (err) {
      console.error(`[cron] Retry error for campaign ${campaign.id}:`, err);
      failed++;
    }
  }

  return { processed: dueCampaigns.length, succeeded, failed };
}
