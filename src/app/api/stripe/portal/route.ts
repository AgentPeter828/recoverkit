import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { getSubscription } from "@/lib/stripe/billing";
import { createServerComponentClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase not configured" },
        { status: 500 }
      );
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await getSubscription(user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 404 }
      );
    }

    const origin =
      request.headers.get("origin") ?? "http://localhost:3000";

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${origin}/dashboard`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[Stripe Portal] Error:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
