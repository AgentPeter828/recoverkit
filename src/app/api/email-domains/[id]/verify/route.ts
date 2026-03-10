import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { verifyDomain } from "@/lib/services/resend-domains";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * POST — trigger domain verification check.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get the domain record
  const { data: domainRecord } = await supabase
    .from("rk_email_domains")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!domainRecord) {
    return NextResponse.json({ error: "Domain not found" }, { status: 404 });
  }

  if (!domainRecord.resend_domain_id) {
    return NextResponse.json({ error: "No Resend domain ID" }, { status: 400 });
  }

  // Trigger verification in Resend
  const result = await verifyDomain(domainRecord.resend_domain_id);
  if (!result.success) {
    return NextResponse.json({ error: result.error || "Verification failed" }, { status: 500 });
  }

  const isVerified = result.status === "verified";

  // Update database
  const { error } = await supabase
    .from("rk_email_domains")
    .update({
      status: isVerified ? "verified" : "pending",
      dns_records: result.records || domainRecord.dns_records,
      verified_at: isVerified ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (isVerified) {
    await logAudit(user.id, "email_domain_verified", { domain: domainRecord.domain });
  }

  return NextResponse.json({
    status: isVerified ? "verified" : "pending",
    records: result.records || domainRecord.dns_records,
  });
}
