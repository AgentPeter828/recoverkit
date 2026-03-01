import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { PaymentUpdateForm } from "./PaymentUpdateForm";

// This page is public — no auth required. It's where customers update their payment method.

async function getPage(slug: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;

  const supabase = createClient(url, serviceKey);
  const { data } = await supabase
    .from("rk_payment_update_pages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  return data;
}

export default async function PaymentUpdatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: "#f9fafb" }}>
      <div className="w-full max-w-md">
        <div className="rounded-2xl shadow-lg p-8" style={{ background: "#fff" }}>
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: page.brand_color + "20" }}>
              <span className="text-2xl">💳</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{page.title}</h1>
            <p className="text-gray-600 mt-2 text-sm">{page.message}</p>
          </div>

          <PaymentUpdateForm brandColor={page.brand_color} pageId={page.id} />

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Secured by Stripe. Your payment information is encrypted and never stored on our servers.
            </p>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by <strong>RecoverKit</strong>
        </p>
      </div>
    </div>
  );
}
