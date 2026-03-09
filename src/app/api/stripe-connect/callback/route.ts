import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { exchangeCode, getAccountInfo, validateOAuthState } from "@/lib/services/stripe-connect";
import { seedDefaultSequence } from "@/lib/services/default-sequence";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/connect?error=" + encodeURIComponent(error), request.url));
  }

  // Validate CSRF state parameter
  const stateValid = await validateOAuthState(state);
  if (!stateValid) {
    console.error("[stripe-connect/callback] Invalid OAuth state — possible CSRF attack");
    return NextResponse.redirect(new URL("/dashboard/connect?error=invalid_state", request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/dashboard/connect?error=missing_code", request.url));
  }

  try {
    const result = await exchangeCode(code);
    const accountInfo = await getAccountInfo(result.stripe_account_id);

    const { error: dbError } = await supabase.from("rk_stripe_connections").upsert(
      {
        user_id: user.id,
        stripe_account_id: result.stripe_account_id,
        access_token: result.access_token,
        refresh_token: result.refresh_token,
        livemode: result.livemode,
        scope: result.scope,
        business_name: accountInfo.business_name,
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" }
    );

    if (dbError) {
      console.error("[stripe-connect/callback] DB error:", dbError.message);
      return NextResponse.redirect(new URL("/dashboard/connect?error=db_error", request.url));
    }

    await logAudit(user.id, "stripe_connected", {
      stripe_account_id: result.stripe_account_id,
      business_name: accountInfo.business_name,
      livemode: result.livemode,
    });

    // Auto-seed default dunning sequence on first Stripe connect
    try {
      await seedDefaultSequence(supabase, user.id);
    } catch (seedErr) {
      // Non-blocking — user can still proceed without default sequence
      console.warn("[stripe-connect/callback] Failed to seed default sequence:", seedErr);
    }

    return NextResponse.redirect(new URL("/dashboard/connect?success=true", request.url));
  } catch (err) {
    console.error("[stripe-connect/callback] Error:", err);
    return NextResponse.redirect(new URL("/dashboard/connect?error=exchange_failed", request.url));
  }
}
