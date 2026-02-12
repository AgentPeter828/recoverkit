import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// GET — get sequence with all emails
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sequence, error } = await supabase
    .from("dunning_sequences")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !sequence) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: emails } = await supabase
    .from("dunning_emails")
    .select("*")
    .eq("sequence_id", id)
    .order("step_number", { ascending: true });

  return NextResponse.json({ sequence, emails: emails || [] });
}

// PATCH — update sequence
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowedFields = ["name", "description", "is_default", "is_active"];
  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const field of allowedFields) {
    if (body[field] !== undefined) updates[field] = body[field];
  }

  const { data, error } = await supabase
    .from("dunning_sequences")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sequence: data });
}

// DELETE — delete sequence and its emails
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("dunning_sequences")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
