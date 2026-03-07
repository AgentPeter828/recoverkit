import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { dunningEmailSchema } from "@/lib/validators";

export const runtime = "nodejs";

// POST — create a dunning email in a sequence
export async function POST(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rawBody = await request.json();
  const parsed = dunningEmailSchema.safeParse(rawBody);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const { sequence_id, subject, body_html, body_text, step_number, delay_hours } = parsed.data;

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
      step_number,
      subject,
      body_html,
      body_text: body_text || body_html.replace(/<[^>]*>/g, ""),
      delay_hours,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ email: data }, { status: 201 });
}
