import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { trackServerEvent } from "@/lib/mixpanel-server";

export const runtime = "nodejs";

// 1x1 transparent GIF
const TRANSPARENT_GIF = Buffer.from(
  "R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
  "base64"
);

/**
 * GET /api/track/open?id=<dunning_email_id>
 * Records an email open and returns a 1x1 transparent GIF.
 */
export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (id) {
    const supabase = getSupabaseAdmin();

    await supabase
      .from("rk_dunning_emails")
      .update({ opened_at: new Date().toISOString() })
      .eq("id", id);

    await trackServerEvent("email_opened", { dunning_email_id: id });
  }

  return new NextResponse(TRANSPARENT_GIF, {
    status: 200,
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
