import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

/**
 * GET — list emails in a dunning sequence.
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify the sequence belongs to this user
  const { data: seq } = await supabase
    .from("rk_dunning_sequences")
    .select("id")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (!seq) return NextResponse.json({ error: "Sequence not found" }, { status: 404 });

  const { data: emails, error } = await supabase
    .from("rk_dunning_emails")
    .select("id, step_number, subject, body_html, body_text, delay_hours, is_ai_generated")
    .eq("sequence_id", id)
    .order("step_number", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ emails });
}
