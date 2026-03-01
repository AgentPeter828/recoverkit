import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// POST — create a dunning email in a sequence
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { sequence_id, subject, body_html, body_text, delay_hours, step_number } = body;

  if (!sequence_id || !subject || !body_html) {
    return NextResponse.json({ error: "Missing required fields: sequence_id, subject, body_html" }, { status: 400 });
  }

  // Verify sequence belongs to user
  const { data: seq } = await supabase
    .from("rk_dunning_sequences")
    .select("id")
    .eq("id", sequence_id)
    .eq("user_id", user.id)
    .single();

  if (!seq) return NextResponse.json({ error: "Sequence not found" }, { status: 404 });

  const { data, error } = await supabase
    .from("rk_dunning_emails")
    .insert({
      user_id: user.id,
      sequence_id,
      step_number: step_number || 1,
      subject,
      body_html,
      body_text: body_text || body_html.replace(/<[^>]*>/g, ""),
      delay_hours: delay_hours || 24,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ email: data }, { status: 201 });
}
