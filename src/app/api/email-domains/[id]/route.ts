import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { deleteDomain } from "@/lib/services/resend-domains";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * DELETE — remove a sending domain.
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: domainRecord } = await supabase
    .from("rk_email_domains")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!domainRecord) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  // Delete from Resend
  if (domainRecord.resend_domain_id) {
    await deleteDomain(domainRecord.resend_domain_id);
  }

  // Delete from database
  const { error } = await supabase
    .from("rk_email_domains")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit(user.id, "email_domain_deleted", { domain: domainRecord.domain });

  return NextResponse.json({ deleted: true });
}
