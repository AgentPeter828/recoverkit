import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

/**
 * POST — handle payment method update from customer-facing page.
 * Creates a Stripe SetupIntent for the connected account's customer,
 * or falls back to a mock response in development.
 */
export async function POST(request: NextRequest) {
  const { page_id, campaign_id } = await request.json();

  if (!page_id) {
    return NextResponse.json({ error: "Missing page_id" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();

  // Verify page exists and is active
  const { data: page } = await supabase
    .from("rk_payment_update_pages")
    .select("id, user_id")
    .eq("id", page_id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return NextResponse.json({ error: "Page not found or inactive" }, { status: 404 });
  }

  // Get the connected Stripe account for this page's user
  const { data: connection } = await supabase
    .from("rk_stripe_connections")
    .select("access_token, stripe_account_id")
    .eq("user_id", page.user_id)
    .single();

  if (connection && !connection.access_token.startsWith("sk_test_mock_")) {
    try {
      const Stripe = (await import("stripe")).default;
      const connectedStripe = new Stripe(connection.access_token, { apiVersion: "2025-02-24.acacia" });

      // If we have a campaign_id, try to get the customer and create a portal session
      if (campaign_id) {
        const { data: campaign } = await supabase
          .from("recovery_campaigns")
          .select("stripe_customer_id")
          .eq("id", campaign_id)
          .single();

        if (campaign?.stripe_customer_id) {
          // Try Stripe Customer Portal for card update
          try {
            const portalSession = await connectedStripe.billingPortal.sessions.create({
              customer: campaign.stripe_customer_id,
              return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/pay/success`,
              flow_data: {
                type: "payment_method_update",
              },
            });
            return NextResponse.json({
              success: true,
              portal_url: portalSession.url,
            });
          } catch {
            // Fall through to SetupIntent
          }
        }
      }

      // Create a SetupIntent for card update
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
