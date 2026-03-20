import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

/**
 * DELETE — GDPR account deletion.
 * Deletes all user data from all tables, then deletes the auth user.
 * Uses the service role key to perform admin-level deletions.
 */
export async function DELETE() {
  const supabase = await createServerComponentClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey);

  try {
    // Delete all user data from every table (order matters for FK constraints)
    const tables = [
      "rk_audit_log",
      "rk_sent_emails",
      "rk_recovery_attempts",
      "rk_dunning_emails",
      "rk_dunning_sequences",
      "rk_payment_update_pages",
      "rk_recovery_campaigns",
      "rk_stripe_connections",
      "rk_email_domains",
      "rk_subscriptions",
      "rk_profiles",
    ];

    // Also try without prefix for backwards compat
    const tablesNonPrefixed = [
      "audit_log",
      "sent_emails",
      "recovery_attempts",
      "dunning_emails",
      "dunning_sequences",
      "payment_update_pages",
      "recovery_campaigns",
      "stripe_connections",
      "email_domains",
      "subscriptions",
      "profiles",
    ];

    for (const table of [...tables, ...tablesNonPrefixed]) {
      await adminClient.from(table).delete().eq("user_id", user.id);
    }

    // Delete the auth user
    const { error: authError } = await adminClient.auth.admin.deleteUser(
      user.id
    );

    if (authError) {
      console.error("[Account Delete] Auth deletion failed:", authError.message);
      return NextResponse.json(
        { error: "Failed to delete account. Please contact support." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Account Delete] Error:", err);
    return NextResponse.json(
      { error: "Failed to delete account. Please contact support." },
      { status: 500 }
    );
  }
}
