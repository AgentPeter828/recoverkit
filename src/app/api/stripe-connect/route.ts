import { NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { getOAuthUrl } from "@/lib/services/stripe-connect";

export const runtime = "nodejs";

// GET — returns the OAuth URL to redirect user to Stripe Connect
export async function GET() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = getOAuthUrl();
  return NextResponse.json({ url });
}

// DELETE — disconnect Stripe account
export async function DELETE() {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabase
    .from("stripe_connections")
    .delete()
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
