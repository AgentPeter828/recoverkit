import { redirect } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default async function PaymentUpdateFallback({
  searchParams,
}: {
  searchParams: Promise<{ invoice?: string }>;
}) {
  const { invoice } = await searchParams;

  if (!invoice) {
    return <ErrorMessage />;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    return <ErrorMessage />;
  }

  const supabase = createClient(url, serviceKey);

  // Find the recovery campaign by invoice ID
  const { data: campaign } = await supabase
    .from("rk_recovery_campaigns")
    .select("user_id")
    .eq("stripe_invoice_id", invoice)
    .single();

  if (!campaign) {
    return <ErrorMessage />;
  }

  // Find the user's payment update page
  const { data: page } = await supabase
    .from("rk_payment_update_pages")
    .select("slug")
    .eq("user_id", campaign.user_id)
    .eq("is_active", true)
    .single();

  if (!page) {
    return <ErrorMessage />;
  }

  redirect(`/pay/${page.slug}?invoice=${invoice}`);
}

function ErrorMessage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#f9fafb" }}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: "#fef2f2" }}>
          <span className="text-2xl">!</span>
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Link Unavailable</h1>
        <p className="text-gray-600 text-sm">
          This payment link has expired or is invalid. Please contact the business directly for assistance.
        </p>
      </div>
    </div>
  );
}
