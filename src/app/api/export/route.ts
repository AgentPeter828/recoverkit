import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { rateLimitExport } from "@/lib/rate-limit";

export const runtime = "nodejs";

/**
 * GDPR data export endpoint.
 * Returns all user data as a JSON download.
 * Rate limited to 1 request per hour.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const limit = rateLimitExport(user.id);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. You can export data once per hour." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((limit.retryAfterMs ?? 0) / 1000)) } }
    );
  }

  // Fetch all user data in parallel
  const [
    campaigns,
    sequences,
    dunningEmails,
    paymentPages,
    sentEmails,
    connection,
    recoveryAttempts,
    auditLogs,
  ] = await Promise.all([
    supabase.from("recovery_campaigns").select("*").eq("user_id", user.id),
    supabase.from("dunning_sequences").select("*").eq("user_id", user.id),
    supabase.from("dunning_emails").select("*").eq("user_id", user.id),
    supabase.from("payment_update_pages").select("*").eq("user_id", user.id),
    supabase.from("sent_emails").select("*").eq("user_id", user.id),
    supabase.from("stripe_connections").select("stripe_account_id, business_name, livemode, scope, connected_at").eq("user_id", user.id),
    supabase.from("recovery_attempts").select("*").eq("user_id", user.id),
    supabase.from("audit_log").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const exportData = {
    exported_at: new Date().toISOString(),
    user: {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
    },
    stripe_connections: connection.data || [],
    recovery_campaigns: campaigns.data || [],
    recovery_attempts: recoveryAttempts.data || [],
    dunning_sequences: sequences.data || [],
    dunning_emails: dunningEmails.data || [],
    sent_emails: sentEmails.data || [],
    payment_update_pages: paymentPages.data || [],
    audit_log: auditLogs.data || [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="recoverkit-export-${user.id.slice(0, 8)}.json"`,
    },
  });
}
