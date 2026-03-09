/**
 * Default dunning email sequence — 5-step sequence provisioned for new users.
 * Uses merge tags: {{customer_name}}, {{amount}}, {{currency}}, {{business_name}}
 * The email-service wraps these in the branded HTML template with the CTA button.
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { logAudit } from "@/lib/audit";

interface DefaultEmailStep {
  step_number: number;
  delay_hours: number;
  subject: string;
  body_html: string;
  body_text: string;
}

export const DEFAULT_SEQUENCE_NAME = "Default Recovery Sequence";
export const DEFAULT_SEQUENCE_DESCRIPTION =
  "5-step email sequence with increasing urgency — from friendly reminder to final notice.";

/**
 * The 5 default dunning email steps.
 * Timing: 4h → 24h → 72h → 120h (5 days) → 240h (10 days)
 * Tone escalation: friendly → concerned → urgent → final
 */
export const DEFAULT_EMAIL_STEPS: DefaultEmailStep[] = [
  {
    step_number: 1,
    delay_hours: 4,
    subject: "Heads up — your payment didn't go through",
    body_html: `<p>Hi there,</p>
<p>We just tried to process your payment, but it was declined. This happens sometimes — expired cards, bank holds, the usual.</p>
<p>The good news: it only takes a minute to fix. Just update your payment method and you're all set.</p>
<p style="font-size:14px;color:#6b7280;margin-top:24px;">If you've already updated your card, feel free to ignore this — we'll retry automatically.</p>`,
    body_text: `Hi there,

We just tried to process your payment, but it was declined. This happens sometimes — expired cards, bank holds, the usual.

The good news: it only takes a minute to fix. Just update your payment method and you're all set.

If you've already updated your card, feel free to ignore this — we'll retry automatically.`,
  },
  {
    step_number: 2,
    delay_hours: 24,
    subject: "Your payment still needs attention",
    body_html: `<p>Hi there,</p>
<p>Just a quick follow-up — your recent payment is still outstanding. We'd hate for you to lose access to your account over a card issue.</p>
<p>Common reasons payments fail:</p>
<ul style="color:#374151;margin:12px 0;">
  <li>Expired credit card</li>
  <li>Insufficient funds</li>
  <li>Bank security hold</li>
</ul>
<p>Updating your payment method takes less than a minute — click the button below to get it sorted.</p>`,
    body_text: `Hi there,

Just a quick follow-up — your recent payment is still outstanding. We'd hate for you to lose access to your account over a card issue.

Common reasons payments fail:
- Expired credit card
- Insufficient funds
- Bank security hold

Updating your payment method takes less than a minute.`,
  },
  {
    step_number: 3,
    delay_hours: 72,
    subject: "Action needed: update your payment method",
    body_html: `<p>Hi there,</p>
<p>We've attempted to charge your card a few times now, but it keeps getting declined. Your subscription is still active, but we'll need a valid payment method to keep it going.</p>
<p><strong>Please update your payment details soon</strong> to avoid any interruption to your service.</p>
<p style="font-size:14px;color:#6b7280;margin-top:24px;">If you're having trouble or need to chat about your account, just reply to this email — we're happy to help.</p>`,
    body_text: `Hi there,

We've attempted to charge your card a few times now, but it keeps getting declined. Your subscription is still active, but we'll need a valid payment method to keep it going.

Please update your payment details soon to avoid any interruption to your service.

If you're having trouble or need to chat about your account, just reply to this email — we're happy to help.`,
  },
  {
    step_number: 4,
    delay_hours: 120,
    subject: "Your subscription is at risk",
    body_html: `<p>Hi there,</p>
<p>We've been trying to reach you about a failed payment on your account. Unfortunately, we still haven't been able to process the charge.</p>
<p style="background:#fef2f2;border-left:3px solid #ef4444;padding:12px 16px;border-radius:4px;color:#991b1b;">
  <strong>Your subscription will be cancelled soon</strong> if we can't collect payment. You'll lose access to all your data and features.
</p>
<p>We really don't want that to happen. Please take a moment to update your payment method now.</p>`,
    body_text: `Hi there,

We've been trying to reach you about a failed payment on your account. Unfortunately, we still haven't been able to process the charge.

Your subscription will be cancelled soon if we can't collect payment. You'll lose access to all your data and features.

We really don't want that to happen. Please take a moment to update your payment method now.`,
  },
  {
    step_number: 5,
    delay_hours: 240,
    subject: "Final notice: your account will be cancelled",
    body_html: `<p>Hi there,</p>
<p>This is our final attempt to recover your payment. After multiple tries, we haven't been able to charge your card.</p>
<p style="background:#fef2f2;border-left:3px solid #ef4444;padding:12px 16px;border-radius:4px;color:#991b1b;">
  <strong>Your account will be cancelled within 48 hours</strong> unless you update your payment method.
</p>
<p>Once cancelled:</p>
<ul style="color:#374151;margin:12px 0;">
  <li>You'll lose access to your account immediately</li>
  <li>Your data may be permanently deleted after 30 days</li>
  <li>Any active integrations will stop working</li>
</ul>
<p>If you'd like to keep your subscription, please update your payment now. It only takes a minute.</p>
<p style="font-size:14px;color:#6b7280;margin-top:24px;">If you've decided to cancel, no action needed — we understand, and thanks for being a customer.</p>`,
    body_text: `Hi there,

This is our final attempt to recover your payment. After multiple tries, we haven't been able to charge your card.

Your account will be cancelled within 48 hours unless you update your payment method.

Once cancelled:
- You'll lose access to your account immediately
- Your data may be permanently deleted after 30 days
- Any active integrations will stop working

If you'd like to keep your subscription, please update your payment now. It only takes a minute.

If you've decided to cancel, no action needed — we understand, and thanks for being a customer.`,
  },
];

/**
 * Provision the default dunning sequence for a user.
 * Idempotent — skips if user already has a default sequence.
 * Returns the sequence ID.
 */
export async function seedDefaultSequence(
  supabase: SupabaseClient,
  userId: string
): Promise<{ sequenceId: string; created: boolean }> {
  // Check if user already has a default sequence
  const { data: existing } = await supabase
    .from("rk_dunning_sequences")
    .select("id")
    .eq("user_id", userId)
    .eq("is_default", true)
    .single();

  if (existing) {
    return { sequenceId: existing.id, created: false };
  }

  // Create the sequence
  const { data: sequence, error: seqError } = await supabase
    .from("rk_dunning_sequences")
    .insert({
      user_id: userId,
      name: DEFAULT_SEQUENCE_NAME,
      description: DEFAULT_SEQUENCE_DESCRIPTION,
      is_default: true,
      is_active: true,
    })
    .select("id")
    .single();

  if (seqError || !sequence) {
    console.error("[default-sequence] Failed to create sequence:", seqError?.message);
    throw new Error(`Failed to create default sequence: ${seqError?.message}`);
  }

  // Insert all 5 email steps
  const emailRows = DEFAULT_EMAIL_STEPS.map((step) => ({
    user_id: userId,
    sequence_id: sequence.id,
    step_number: step.step_number,
    subject: step.subject,
    body_html: step.body_html,
    body_text: step.body_text,
    delay_hours: step.delay_hours,
    is_ai_generated: false,
  }));

  const { error: emailError } = await supabase
    .from("rk_dunning_emails")
    .insert(emailRows);

  if (emailError) {
    console.error("[default-sequence] Failed to create emails:", emailError.message);
    // Clean up the sequence if emails failed
    await supabase.from("rk_dunning_sequences").delete().eq("id", sequence.id);
    throw new Error(`Failed to create default emails: ${emailError.message}`);
  }

  await logAudit(userId, "default_sequence_seeded", {
    sequence_id: sequence.id,
    email_count: DEFAULT_EMAIL_STEPS.length,
  });

  console.log(`[default-sequence] Seeded default sequence ${sequence.id} with ${DEFAULT_EMAIL_STEPS.length} emails for user ${userId}`);

  return { sequenceId: sequence.id, created: true };
}
