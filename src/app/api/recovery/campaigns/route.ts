import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET — list all recovery campaigns for the authenticated user
export async function GET(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = request.nextUrl.searchParams.get("status");
  const limit = parseInt(request.nextUrl.searchParams.get("limit") || "50");
  const offset = parseInt(request.nextUrl.searchParams.get("offset") || "0");

  let query = supabase
    .from("recovery_campaigns")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (status) {
    query = query.eq("status", status);
  }

  const { data, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ campaigns: data, total: count });
}
