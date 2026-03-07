import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type AuditAction =
  | "campaign_created"
  | "retry_attempted"
  | "email_sent"
  | "sequence_created"
  | "sequence_edited"
  | "sequence_deleted"
  | "payment_page_created"
  | "payment_page_deleted"
  | "stripe_connected"
  | "stripe_disconnected";

/**
 * Log an audit event to the audit_log table.
 * Non-blocking — errors are logged but don't propagate.
 */
export async function logAudit(
  userId: string,
  action: AuditAction,
  details?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = getSupabaseAdmin();
    await supabase.from("audit_log").insert({
      user_id: userId,
      action,
      details: details ?? {},
    });
  } catch (err) {
    console.error("[audit] Failed to log:", action, err);
  }
}
