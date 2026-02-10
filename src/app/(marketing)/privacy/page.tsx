import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
      <div
        className="prose prose-lg max-w-none space-y-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          1. Information We Collect
        </h2>
        <p>
          {appName} collects information you provide directly, such as your email
          address when you create an account, and usage data collected
          automatically when you use our service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          2. How We Use Your Information
        </h2>
        <p>
          We use the information we collect to provide, maintain, and improve our
          services, to communicate with you, and to comply with legal obligations.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          3. Data Sharing
        </h2>
        <p>
          We do not sell your personal information. We may share information with
          third-party service providers who assist in operating our service (e.g.,
          payment processing via Stripe, authentication via Supabase).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          4. Data Security
        </h2>
        <p>
          We implement appropriate technical and organizational measures to protect
          your personal information against unauthorized access, alteration,
          disclosure, or destruction.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          5. Your Rights
        </h2>
        <p>
          You have the right to access, correct, or delete your personal
          information. You may also request a copy of your data or restrict its
          processing.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Contact Us
        </h2>
        <p>
          If you have questions about this privacy policy, please contact us at the
          email address provided on our website.
        </p>
      </div>
    </div>
  );
}
