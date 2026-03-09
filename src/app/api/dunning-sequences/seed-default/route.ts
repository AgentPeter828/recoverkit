import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { seedDefaultSequence } from "@/lib/services/default-sequence";

export const runtime = "nodejs";

/**
 * POST — seed the default dunning email sequence for the authenticated user.
 * Idempotent: returns existing sequence if already seeded.
 */
export async function POST() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const result = await seedDefaultSequence(supabase, user.id);
    return NextResponse.json({
      sequence_id: result.sequenceId,
      created: result.created,
    }, { status: result.created ? 201 : 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[seed-default] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
