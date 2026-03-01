import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { sendEmail, buildDunningEmailHtml } from "@/lib/services/email-service";
import { trackServerEvent } from "@/lib/mixpanel-server";

export const runtime = "nodejs";

/**
 * POST — send a dunning email for a campaign.
 * Body: { campaign_id: string, dunning_email_id: string }
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { campaign_id, dunning_email_id } = await request.json();
  if (!campaign_id || !dunning_email_id) {
    return NextResponse.json({ error: "Missing campaign_id or dunning_email_id" }, { status: 400 });
  }

  // Get campaign
  const { data: campaign } = await supabase
    .from("rk_recovery_campaigns")
    .select("*")
    .eq("id", campaign_id)
    .eq("user_id", user.id)
    .single();

  if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
  if (!campaign.customer_email) return NextResponse.json({ error: "No customer email" }, { status: 400 });

  // Get dunning email template
  const { data: template } = await supabase
    .from("rk_dunning_emails")
    .select("*")
    .eq("id", dunning_email_id)
    .eq("user_id", user.id)
    .single();

  if (!template) return NextResponse.json({ error: "Email template not found" }, { status: 404 });

  // Get payment update page for link
  const { data: updatePage } = await supabase
    .from("rk_payment_update_pages")
    .select("slug")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const paymentUpdateUrl = updatePage
    ? `${appUrl}/pay/${updatePage.slug}?campaign=${campaign.id}`
    : `${appUrl}/pay/default?campaign=${campaign.id}`;

  const amount = (campaign.amount_due / 100).toFixed(2);
  const html = buildDunningEmailHtml({
    customerName: campaign.customer_name || undefined,
    amount,
    currency: campaign.currency,
    paymentUpdateUrl,
    bodyHtml: template.body_html,
  });

  const result = await sendEmail({
    to: campaign.customer_email,
    subject: template.subject,
    html,
    text: template.body_text || undefined,
  });

  // Log sent email
  await supabase.from("rk_sent_emails").insert({
    user_id: user.id,
    campaign_id: campaign.id,
    dunning_email_id: template.id,
    to_email: campaign.customer_email,
    subject: template.subject,
    status: result.success ? "sent" : "failed",
    resend_message_id: result.message_id || null,
  });

  // Record as attempt
  await supabase.from("rk_recovery_attempts").insert({
    user_id: user.id,
    campaign_id: campaign.id,
    attempt_number: campaign.retry_count + 1,
    attempt_type: "email",
    status: result.success ? "success" : "failed",
    error_message: result.error || null,
    executed_at: new Date().toISOString(),
  });

  // Track in Mixpanel
  if (result.success) {
    await trackServerEvent("dunning_email_sent", {
      step_number: template.step_number,
      campaign_id: campaign.id,
      customer_email: campaign.customer_email,
      subject: template.subject,
      is_ai_generated: template.is_ai_generated,
    }, user.id);
  }

  return NextResponse.json({
    success: result.success,
    message_id: result.message_id,
    error: result.error,
  });
}
