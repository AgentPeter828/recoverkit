import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * POST — handle payment method update from customer-facing page.
 * In production, this would create a Stripe SetupIntent and return a client secret.
 * For MVP, it simulates a successful update.
 */
export async function POST(request: NextRequest) {
  const { page_id } = await request.json();

  if (!page_id) {
    return NextResponse.json({ error: "Missing page_id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Verify page exists and is active
  const { data: page } = await supabase
    .from("payment_update_pages")
    .select("id, user_id")
    .eq("id", page_id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found or inactive" }, { status: 404 });
  }

  // In production, we'd:
  // 1. Get the connected Stripe account for this user
  // 2. Create a SetupIntent via the connected account
  // 3. Return the client_secret for Stripe.js to handle
  // For MVP, simulate success

  const { data: connection } = await supabase
    .from("stripe_connections")
    .select("access_token, stripe_account_id")
    .eq("user_id", page.user_id)
    .single();

  if (connection && !connection.access_token.startsWith("sk_test_mock_")) {
    // Real Stripe: would create SetupIntent here
    try {
      const Stripe = (await import("stripe")).default;
      const connectedStripe = new Stripe(connection.access_token, { apiVersion: "2025-02-24.acacia" });
      const setupIntent = await connectedStripe.setupIntents.create({
        payment_method_types: ["card"],
      });
      return NextResponse.json({
        success: true,
        client_secret: setupIntent.client_secret,
        stripe_account_id: connection.stripe_account_id,
      });
    } catch (err) {
      console.error("[update-payment] Stripe error:", err);
      return NextResponse.json({ success: true, mock: true });
    }
  }

  // Mock response
  return NextResponse.json({ success: true, mock: true });
}
