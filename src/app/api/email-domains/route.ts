import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { createDomain } from "@/lib/services/resend-domains";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

/**
 * GET — list the user's email sending domains.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("rk_email_domains")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ domains: data });
}

/**
 * POST — add a new sending domain.
 */
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const domain = body.domain?.trim()?.toLowerCase();

  if (!domain || !domain.includes(".") || domain.length < 4) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  // Check if domain already exists for this user
  const { data: existing } = await supabase
    .from("rk_email_domains")
    .select("id")
    .eq("user_id", user.id)
    .eq("domain", domain)
    .single();

  if (existing) {
    return NextResponse.json({ error: "Domain already added" }, { status: 409 });
  }

  // Create domain in Resend
  const result = await createDomain(domain);
  if (!result.success || !result.domain) {
    return NextResponse.json({ error: result.error || "Failed to create domain" }, { status: 500 });
  }

  // Store in database
  const fromEmail = `billing@${domain}`;
  const { data: saved, error } = await supabase
    .from("rk_email_domains")
    .insert({
      user_id: user.id,
      domain,
      resend_domain_id: result.domain.id,
      status: "pending",
      dns_records: result.domain.records,
      from_name: body.from_name || null,
      from_email: fromEmail,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logAudit(user.id, "email_domain_added", { domain, resend_domain_id: result.domain.id });

  return NextResponse.json({ domain: saved }, { status: 201 });
}
