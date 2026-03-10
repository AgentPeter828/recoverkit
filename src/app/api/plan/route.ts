import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getUserPlan } from "@/lib/plan-limits";

export const runtime = "nodejs";

/**
 * GET — return the current user's plan tier and feature access.
 */
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const plan = await getUserPlan(user.id);
  return NextResponse.json(plan);
}
