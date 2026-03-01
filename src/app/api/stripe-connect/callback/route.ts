import { NextRequest, NextResponse } from "next/server";
import { createServerComponentClient } from "@/lib/supabase/server";
import { exchangeCode, getAccountInfo } from "@/lib/services/stripe-connect";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const supabase = await createServerComponentClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL("/dashboard/connect?error=" + encodeURIComponent(error), request.url));
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

    return NextResponse.redirect(new URL("/dashboard/connect?success=true", request.url));
  } catch (err) {
    console.error("[stripe-connect/callback] Error:", err);
    return NextResponse.redirect(new URL("/dashboard/connect?error=exchange_failed", request.url));
  }
}
