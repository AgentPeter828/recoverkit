import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RecoverKit Terms of Service — effective 15 February 2026.",
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
          <strong>Effective date:</strong> 15 February 2026
        </p>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of RecoverKit
          (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;), operated by The
          Beagles Curiosity Trust, a trust registered in Victoria, Australia. By
          creating an account or using RecoverKit you agree to these Terms in full.
          If you do not agree, do not use the Service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          1. The Service
        </h2>
        <p>
          RecoverKit is a SaaS platform that helps subscription businesses recover
          failed payments through automated dunning emails, smart retry logic, and
          churn-prevention workflows. The Service connects to your Stripe account
          via Stripe Connect OAuth and sends transactional emails on your behalf.
          We may update, modify, or discontinue features at any time with
          reasonable notice.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          2. Accounts
        </h2>
        <p>
          You must provide accurate information when registering. You are
          responsible for safeguarding your credentials and for all activity under
          your account. Notify us immediately if you suspect unauthorised access.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          3. Stripe Connect &amp; Data Access
        </h2>
        <p>
          To use RecoverKit, you authorise us to connect to your Stripe account via
          Stripe Connect OAuth. This grants us read access to your failed payment
          data, subscription information, and customer details (including email
          addresses) necessary to perform payment recovery. You may revoke this
          access at any time via your Stripe Dashboard or by disconnecting within
          RecoverKit. Revoking access will stop all recovery operations.
        </p>
        <p>
          We access and process your Stripe data solely to provide the Service. We
          do not use your Stripe data for any other purpose, share it with
          unrelated third parties, or retain it after you disconnect (subject to
          legal retention requirements).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          4. Emails Sent on Your Behalf
        </h2>
        <p>
          RecoverKit sends dunning and recovery emails to your customers on your
          behalf. You acknowledge and agree that:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>You are the data controller for your customer data — we act as a data processor</li>
          <li>You have the legal right to email your customers for payment recovery purposes</li>
          <li>Email content may be personalised using AI (OpenAI) based on payment context</li>
          <li>You are responsible for ensuring emails comply with applicable anti-spam laws (e.g., the Australian Spam Act 2003, CAN-SPAM, GDPR)</li>
          <li>We will include unsubscribe mechanisms where required by law</li>
        </ul>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          5. Data Processing
        </h2>
        <p>
          Where we process personal data on your behalf (as your data processor),
          we will:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Process data only on your documented instructions (i.e., to provide the Service)</li>
          <li>Ensure personnel are bound by confidentiality obligations</li>
          <li>Implement appropriate technical and organisational security measures</li>
          <li>Not engage sub-processors without your general authorisation (current sub-processors are listed in our Privacy Policy)</li>
          <li>Assist you in responding to data subject rights requests</li>
          <li>Delete or return your data upon termination (within 90 days)</li>
          <li>Make available information necessary to demonstrate compliance</li>
        </ul>
        <p>
          This section constitutes the data processing terms between you (controller) and us (processor) for the purposes of the GDPR and the Australian Privacy Act 1988.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Plans &amp; Pricing
        </h2>
        <p>
          RecoverKit offers a free tier and paid plans at A$29/month, A$79/month,
          and A$149/month (or as otherwise displayed at the time of purchase). All
          prices are in Australian Dollars (AUD) and are inclusive of GST where
          applicable.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          7. Billing &amp; Payments
        </h2>
        <p>
          Paid subscriptions are billed monthly in advance via Stripe. By
          subscribing you authorise us to charge your nominated payment method on
          each renewal date. If payment fails, we may downgrade or suspend your
          account after reasonable notice.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          8. Cancellation &amp; Refunds
        </h2>
        <p>
          You may cancel your subscription at any time from your dashboard.
          Cancellation takes effect at the end of the current billing period — you
          retain access until then. We do not provide pro-rata refunds for partial
          months. Nothing in these Terms excludes or limits your rights under the
          Australian Consumer Law, including any statutory right to a refund for a
          major failure.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          9. Acceptable Use
        </h2>
        <p>
          You must not: (a) use the Service for unlawful purposes; (b) attempt to
          gain unauthorised access to our systems; (c) use the Service to send spam
          or harass anyone; (d) provide false or misleading information to your
          customers via the Service; or (e) exceed rate limits or abuse the
          Service&apos;s infrastructure.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          10. Intellectual Property
        </h2>
        <p>
          All rights in the Service (code, design, branding) remain with The
          Beagles Curiosity Trust. These Terms do not grant you any rights to our
          trademarks or proprietary materials beyond what is needed to use the
          Service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          11. Third-Party Services
        </h2>
        <p>
          The Service integrates with third parties including Stripe &amp; Stripe
          Connect (payments &amp; account data), Supabase (authentication &amp;
          database), Resend (transactional email delivery), OpenAI (email
          personalisation), Mixpanel (analytics), and Vercel (hosting). Your use of
          those services is subject to their own terms and privacy policies.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          12. Limitation of Liability
        </h2>
        <p>
          To the maximum extent permitted by law (including the Australian Consumer
          Law), our total aggregate liability for any claim arising from or
          relating to the Service is limited to the amount you paid us in the 12
          months before the claim arose. We are not liable for indirect, incidental,
          special, consequential, or punitive damages, including loss of profits,
          revenue, or data. In particular, we are not liable for any revenue you
          fail to recover or any damages arising from emails sent on your behalf.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          13. Disclaimer
        </h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;.
          Except where prohibited by law, we disclaim all warranties, express or
          implied, including merchantability, fitness for a particular purpose, and
          non-infringement. We do not guarantee any specific recovery rate or
          revenue outcome.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          14. Termination
        </h2>
        <p>
          We may suspend or terminate your account if you breach these Terms. You
          may delete your account at any time. On termination, your right to use
          the Service ceases immediately, we will stop sending emails on your
          behalf, and we will delete your data within 90 days (subject to legal
          retention requirements — see our Privacy Policy).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          15. Governing Law
        </h2>
        <p>
          These Terms are governed by the laws of Victoria, Australia. Any disputes
          will be subject to the exclusive jurisdiction of the courts of Victoria.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          16. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. We will notify you of
          material changes by email or in-app notice at least 14 days before they
          take effect. Continued use after the effective date constitutes
          acceptance.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          17. Contact
        </h2>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:hello@recoverkit.com" className="underline">
            hello@recoverkit.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}
