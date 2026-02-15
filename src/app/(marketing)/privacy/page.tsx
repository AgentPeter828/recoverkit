import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RecoverKit Privacy Policy — effective 15 February 2026.",
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
          <strong>Effective date:</strong> 15 February 2026
        </p>
        <p>
          This Privacy Policy explains how RecoverKit (&quot;Service&quot;,
          &quot;we&quot;, &quot;us&quot;), operated by Act Two Pty Ltd (ACN 674 342 486, ABN 56 674 342 486), a company registered in Victoria, Australia, collects, uses, and protects personal information.
          We comply with the Australian Privacy Act 1988 (Cth), the Australian
          Privacy Principles (APPs), and the EU General Data Protection Regulation
          (GDPR) where applicable.
        </p>
        <p>
          RecoverKit operates in two capacities: as a <strong>data controller</strong> for
          our users&apos; account data, and as a <strong>data processor</strong> when
          handling your customers&apos; data on your behalf (e.g., customer email
          addresses and payment data accessed via Stripe Connect).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          1. Information We Collect
        </h2>
        <p><strong>From you (our users):</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Name and email address (account registration)</li>
          <li>Payment information (processed by Stripe — we do not store card numbers)</li>
          <li>Stripe account data accessed via Stripe Connect OAuth (account ID, business info)</li>
          <li>Usage data (pages viewed, features used, timestamps)</li>
        </ul>
        <p><strong>From your customers (as your data processor):</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Customer email addresses (from Stripe)</li>
          <li>Failed payment and subscription data (from Stripe)</li>
          <li>Email interaction data (opens, clicks) for recovery campaigns</li>
        </ul>
        <p><strong>Collected automatically:</strong></p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Device and browser information (user agent, screen size, OS)</li>
          <li>IP address and approximate geolocation</li>
          <li>Cookies and similar tracking technologies (see Section 6)</li>
        </ul>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          2. How We Use Your Information
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>To provide and operate the Service (including sending dunning emails on your behalf)</li>
          <li>To connect to your Stripe account and access failed payment data</li>
          <li>To personalise recovery emails using AI (OpenAI)</li>
          <li>To process payments and manage subscriptions</li>
          <li>To communicate with you (account notices, support, product updates)</li>
          <li>To analyse usage and improve the Service</li>
          <li>To detect and prevent fraud or abuse</li>
          <li>To comply with legal obligations</li>
        </ul>
        <p>
          Under the GDPR, our lawful bases are: performance of a contract,
          legitimate interests, consent (for marketing and cookies), and compliance
          with legal obligations. When processing your customers&apos; data, we act
          on your instructions as data processor.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          3. Third-Party Services &amp; Sub-Processors
        </h2>
        <p>We share data with the following service providers to operate the Service:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Stripe &amp; Stripe Connect</strong> — payment processing, account data access</li>
          <li><strong>Supabase</strong> — authentication and database hosting</li>
          <li><strong>Resend</strong> — transactional email delivery (dunning emails)</li>
          <li><strong>OpenAI</strong> — email content personalisation</li>
          <li><strong>Vercel</strong> — application hosting</li>
          <li><strong>Mixpanel</strong> — product analytics</li>
          <li><strong>Meta Pixel, Google Ads, Reddit Pixel</strong> — advertising measurement and retargeting</li>
        </ul>
        <p>
          These providers act as our sub-processors. Each processes data under
          their own privacy policy. We do not sell personal information to third
          parties.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          4. AI Processing
        </h2>
        <p>
          RecoverKit uses OpenAI to personalise dunning email content based on
          payment context (e.g., plan name, failure reason). We send minimal data
          to OpenAI — only what is necessary for personalisation. We do not send
          full customer profiles. OpenAI processes this data under their data
          processing agreement and does not use it to train models.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          5. International Data Transfers
        </h2>
        <p>
          Some of our service providers are located outside Australia and the EU
          (primarily in the United States). Where personal data is transferred
          internationally, we ensure appropriate safeguards are in place, including
          Standard Contractual Clauses (SCCs) where required by the GDPR.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Cookies &amp; Tracking
        </h2>
        <p>
          We use cookies and similar technologies for authentication, analytics,
          and advertising:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Essential cookies</strong> — required for login and core functionality</li>
          <li><strong>Analytics cookies</strong> — Mixpanel, to understand how the Service is used</li>
          <li><strong>Advertising cookies</strong> — Meta Pixel, Google Ads tag, Reddit Pixel for ad measurement and retargeting</li>
        </ul>
        <p>
          You can manage cookie preferences in your browser settings. Disabling
          non-essential cookies will not affect core functionality.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          7. Data Retention
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Your account data:</strong> retained while your account is active and deleted within 90 days of account deletion</li>
          <li><strong>Your customers&apos; data:</strong> retained only while your Stripe Connect integration is active. Deleted within 90 days of disconnection or account termination</li>
          <li><strong>Financial records:</strong> retained for 7 years as required by Australian tax law</li>
          <li><strong>Email delivery logs:</strong> retained for 12 months for deliverability and debugging</li>
        </ul>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          8. Data Security
        </h2>
        <p>
          We use industry-standard measures to protect data, including encryption
          in transit (TLS) and at rest, access controls, and regular security
          reviews. Stripe Connect tokens are stored securely and encrypted. No
          system is 100% secure — we cannot guarantee absolute security but will
          notify you of any breach as required by law.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          9. Your Rights
        </h2>
        <p>Depending on your jurisdiction, you may have the right to:</p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion of your data (&quot;right to be forgotten&quot;)</li>
          <li>Restrict or object to processing</li>
          <li>Data portability (receive your data in a structured format)</li>
          <li>Withdraw consent at any time (where consent is the lawful basis)</li>
          <li>Lodge a complaint with a supervisory authority (e.g., the OAIC in Australia, or your local EU DPA)</li>
        </ul>
        <p>
          <strong>If you are a customer of one of our users</strong> (i.e., you
          received a dunning email), please contact the business that sent the
          email directly. They are the data controller for your information. If you
          need our help, email us and we will assist.
        </p>
        <p>
          To exercise your rights, email us at{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          . We will respond within 30 days.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          10. Children
        </h2>
        <p>
          RecoverKit is a business tool not directed at children under 16. We do
          not knowingly collect personal information from children.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          11. Changes to This Policy
        </h2>
        <p>
          We may update this policy from time to time. We will notify you of
          material changes by email or in-app notice at least 14 days before they
          take effect. The &quot;Effective date&quot; at the top will be updated
          accordingly.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          12. Contact
        </h2>
        <p>
          For privacy enquiries, contact us at{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          .
        </p>
        <p>
          Act Two Pty Ltd (ACN 674 342 486, ABN 56 674 342 486)
          <br />
          Victoria, Australia
        </p>
      </div>
    </div>
  );
}
