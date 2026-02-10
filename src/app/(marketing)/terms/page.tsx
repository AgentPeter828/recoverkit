import type { Metadata } from "next";

const appName = process.env.NEXT_PUBLIC_APP_NAME || "Firestorm App";

export const metadata: Metadata = {
  title: "Terms of Service",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>
      <div
        className="prose prose-lg max-w-none space-y-6"
        style={{ color: "var(--color-text-secondary)" }}
      >
        <p>
          <strong>Last updated:</strong> {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          1. Acceptance of Terms
        </h2>
        <p>
          By accessing or using {appName}, you agree to be bound by these Terms of
          Service. If you do not agree to these terms, please do not use our
          service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          2. Description of Service
        </h2>
        <p>
          {appName} provides a software-as-a-service platform. We reserve the right
          to modify, suspend, or discontinue the service at any time with
          reasonable notice.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          3. User Accounts
        </h2>
        <p>
          You are responsible for maintaining the confidentiality of your account
          credentials and for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          4. Payment Terms
        </h2>
        <p>
          Paid subscriptions are billed in advance on a monthly basis. You may
          cancel your subscription at any time, and cancellation will take effect at
          the end of the current billing period.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          5. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law, {appName} shall not be liable for
          any indirect, incidental, special, consequential, or punitive damages
          resulting from your use of the service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Changes to Terms
        </h2>
        <p>
          We may update these terms from time to time. We will notify you of
          significant changes by posting a notice on our website or sending you an
          email.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          7. Contact Us
        </h2>
        <p>
          If you have questions about these terms, please contact us at the email
          address provided on our website.
        </p>
      </div>
    </div>
  );
}
