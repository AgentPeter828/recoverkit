import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "RecoverKit Privacy Policy — effective 21 March 2026.",
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
          <strong>Effective date:</strong> 21 March 2026
        </p>
        <p>
          This Privacy Policy explains how RecoverKit (&quot;Service&quot;,
          &quot;we&quot;, &quot;us&quot;), operated by Act Two Pty Ltd (ACN 674 342 486, ABN 56 674 342 486), a company registered in Victoria, Australia, collects, uses, and protects personal information.
          We comply with the Australian Privacy Act 1988 (Cth), the Australian
          Privacy Principles (APPs), the EU General Data Protection Regulation
          (GDPR), the California Consumer Privacy Act / California Privacy Rights
          Act (CCPA/CPRA), and the Canadian Personal Information Protection and
          Electronic Documents Act (PIPEDA) where applicable.
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
          <li><strong>Mixpanel</strong> — product analytics (requires cookie consent)</li>
          <li><strong>PostHog</strong> — product analytics (requires cookie consent)</li>
          <li><strong>Plausible Analytics</strong> — privacy-friendly, cookie-free web analytics</li>
          <li><strong>Meta Pixel, Google Ads, Reddit Pixel</strong> — advertising measurement and retargeting (requires cookie consent)</li>
        </ul>
        <p>
          These providers act as our sub-processors. Each processes data under
          their own privacy policy. We do not sell personal information to third
          parties.
        </p>
        <p>
          We will provide at least 14 days advance written notice (by email) of
          any new sub-processor or material change to existing sub-processor
          arrangements. You may object within 14 days. If you object, we will
          either address your concerns or offer to terminate your account
          without penalty.
        </p>
        <p>
          We may use anonymised and aggregated data derived from the Service for
          benchmarking, product improvement, and industry reporting (e.g.,
          average recovery rates or churn benchmarks). Such data will not
          identify you, your business, or your customers.
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
        <p>
          For users in the EU, in compliance with the EU AI Act: (a) dunning
          emails generated with AI assistance are clearly disclosed as
          AI-personalised; (b) you may request non-AI email alternatives or
          manual review of email content; (c) we maintain processing logs for
          audit and transparency purposes. To opt out of AI personalisation,
          contact{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          5. International Data Transfers
        </h2>
        <p>
          Some of our service providers are located outside Australia and the EU
          (primarily in the United States). All international transfers to the
          US and non-EU countries are governed by the EU Standard Contractual
          Clauses (SCCs) approved by the EU Commission. Additionally, we
          implement supplementary technical safeguards including encryption in
          transit and at rest. Each sub-processor listed in Section 3 has
          executed SCCs where required. For copies of applicable SCCs, contact{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Cookies &amp; Tracking
        </h2>
        <p>
          We use cookies and similar technologies for authentication, analytics,
          and advertising:
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Essential cookies</strong> — required for login and core functionality (always active, no consent needed)</li>
          <li><strong>Analytics cookies</strong> — Mixpanel and PostHog, to understand how the Service is used (requires consent)</li>
          <li><strong>Advertising cookies</strong> — Meta Pixel, Google Ads tag, Reddit Pixel for ad measurement and retargeting (requires consent)</li>
          <li><strong>Cookie-free analytics</strong> — Plausible Analytics runs without cookies and does not require consent</li>
        </ul>
        <p>
          When you first visit RecoverKit, a cookie consent banner will ask for
          your permission before loading any non-essential cookies. You can change
          your cookie preferences at any time from the Settings page in your
          dashboard, or by clearing the <code>rk_cookie_consent</code> value from
          your browser&apos;s local storage. Rejecting non-essential cookies will
          not affect core functionality.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          7. Email Compliance
        </h2>
        <p>
          All commercial emails sent via RecoverKit include: (a) accurate sender
          identity (From and Reply-To); (b) clear, non-deceptive subject lines;
          (c) the sender business physical postal address; (d) a working
          unsubscribe/opt-out link; and (e) opt-out requests are honoured within
          10 business days. This applies under the CAN-SPAM Act (US), the
          Australian Spam Act 2003, and CASL (Canada). For Canadian recipients,
          we require that customers have express or implied consent before
          sending commercial electronic messages, in compliance with CASL.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          8. Data Retention
        </h2>
        <ul className="list-disc pl-6 space-y-1">
          <li><strong>Your account data:</strong> retained while your account is active and deleted within 90 days of account deletion</li>
          <li><strong>Your customers&apos; data:</strong> retained only while your Stripe Connect integration is active. Deleted within 90 days of disconnection or account termination</li>
          <li><strong>Financial records:</strong> retained for 7 years as required by Australian tax law</li>
          <li><strong>Email delivery logs:</strong> retained for 12 months for deliverability and debugging</li>
        </ul>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          9. Data Security
        </h2>
        <p>
          We use industry-standard measures to protect data, including encryption
          in transit (TLS) and at rest, access controls, and regular security
          reviews. Stripe Connect tokens are stored securely and encrypted. No
          system is 100% secure — we cannot guarantee absolute security. In the
          event of a data breach affecting your personal data, we will notify
          affected users and the relevant supervisory authority within 72 hours of
          becoming aware of the breach, as required by the GDPR. We will also
          comply with the Notifiable Data Breaches scheme under the Australian
          Privacy Act.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          10. Business Transfers
        </h2>
        <p>
          If Act Two Pty Ltd, or substantially all of its assets, is acquired by
          or merged with another entity, or in the unlikely event that Act Two
          Pty Ltd goes out of business or enters administration, personal data
          may be among the assets transferred to the successor entity. We will
          notify affected users by email before any such transfer takes effect.
          The successor entity will be bound by this Privacy Policy with respect
          to any personal data transferred to it.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          11. Your Rights
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
        <h3 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          California Residents (CCPA/CPRA)
        </h3>
        <p>
          Under the California Consumer Privacy Act and California Privacy
          Rights Act, California residents have the right to: (1) know what
          personal information is collected, used, and shared; (2) delete
          personal information; (3) correct inaccurate information; (4) opt out
          of the sale or sharing of personal information for cross-context
          behavioural advertising; (5) limit use of sensitive personal
          information; (6) non-discrimination for exercising these rights. We do
          not sell personal information. However, certain analytics and
          advertising cookies (Meta Pixel, Google Ads, Reddit Pixel) may
          constitute sharing under CPRA. You may opt out via our cookie consent
          banner or by contacting{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          . We will respond within 45 days.
        </p>

        <h3 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          Virginia Residents (VCDPA)
        </h3>
        <p>
          Under the Virginia Consumer Data Protection Act, Virginia residents
          have the right to access, correct, delete, and obtain a portable copy
          of their personal data, and to opt out of the sale of personal data,
          targeted advertising, and profiling. Contact{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>{" "}
          to exercise these rights.
        </p>

        <h3 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          Colorado &amp; Connecticut Residents
        </h3>
        <p>
          Residents of Colorado (under the Colorado Privacy Act) and Connecticut
          (under the Connecticut Data Privacy Act) have similar rights to
          access, correct, delete, and port their personal data, and to opt out
          of targeted advertising and the sale of personal data. Contact{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>{" "}
          to exercise these rights.
        </p>

        <h3 className="text-xl font-semibold" style={{ color: "var(--color-text)" }}>
          Canadian Residents (PIPEDA)
        </h3>
        <p>
          Under PIPEDA, Canadian residents have the right to access their
          personal information held by us, request corrections, and withdraw
          consent. We comply with PIPEDA&apos;s 10 fair information principles.
          Contact{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>{" "}
          to exercise these rights.
        </p>

        <p>
          To exercise your rights, email us at{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          . We will respond within 30 days.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          12. Children
        </h2>
        <p>
          RecoverKit is a business tool not directed at children under 16. We do
          not knowingly collect personal information from children.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          13. Changes to This Policy
        </h2>
        <p>
          We may update this policy from time to time. We will notify you of
          material changes by email or in-app notice at least 14 days before they
          take effect. The &quot;Effective date&quot; at the top will be updated
          accordingly.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          14. Contact
        </h2>
        <p>
          <strong>Data Protection Contact:</strong> For all privacy enquiries,
          data subject access requests, or to exercise any of your rights, contact
          our Data Protection Officer at{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          . We will respond within 30 days.
        </p>
        <p>
          Act Two Pty Ltd (ACN 674 342 486, ABN 56 674 342 486)
          <br />
          Melbourne, Victoria 3000, Australia
        </p>
        <p>
          <strong>EU/EEA Representative (GDPR Art. 27):</strong> If you are
          located in the EU/EEA and wish to exercise your data protection rights,
          you may also contact us via{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          . We are in the process of appointing a formal EU representative and
          will update this policy with their details once confirmed.
        </p>
      </div>
    </div>
  );
}
