import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "RecoverKit Terms of Service — effective 21 March 2026.",
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
          <strong>Effective date:</strong> 21 March 2026
        </p>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of RecoverKit
          (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;), operated by Act Two Pty Ltd (ACN 674 342 486, ABN 56 674 342 486), a company registered in Victoria, Australia. By
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
        <p>
          <strong>Stripe Data Usage Commitment:</strong> We access your Stripe
          data solely to provide payment recovery services. We do not: (a) use
          customer email addresses for our own marketing purposes; (b) share
          Stripe data with unrelated third parties; (c) build profiles on or
          train AI models using your Stripe data beyond what is required to
          personalise recovery emails for the current campaign. We comply with
          Stripe&apos;s Connected Account Agreement and Platform Requirements.
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
          <li>For Canadian recipients, you must ensure express or implied consent exists before dunning emails are sent, in compliance with CASL</li>
        </ul>
        <p>
          All emails sent via RecoverKit include accurate sender identification,
          a clear subject line, a physical postal address, and a working
          unsubscribe link, in compliance with the CAN-SPAM Act (US), the
          Australian Spam Act 2003, and CASL (Canada). Opt-out requests are
          honoured within 10 business days.
        </p>

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
          <li>Provide at least 14 days advance written notice of any new sub-processor or material change to existing sub-processor arrangements, with a right to object</li>
          <li>Maintain a formal sub-processor register (see Privacy Policy Section 3) with explicit authorisation</li>
          <li>Upon request, make available information necessary for audits and inspections to demonstrate compliance with data protection obligations</li>
          <li>Cooperate with supervisory authorities where required</li>
        </ul>
        <p>
          This section, together with any Data Processing Agreement executed
          between the parties, constitutes the data processing terms between you
          (controller) and us (processor) for the purposes of GDPR Article 28,
          the Australian Privacy Act 1988, PIPEDA, and applicable US state
          privacy laws. A formal Data Processing Agreement (DPA) with detailed
          schedules covering processing scope, duration, nature, purpose, and
          Standard Contractual Clauses is available upon request at{" "}
          <a href="mailto:privacy@recoverkit.com" className="underline">
            privacy@recoverkit.com
          </a>
          .
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          6. Plans &amp; Pricing
        </h2>
        <p>
          RecoverKit offers a free tier and paid subscription plans as displayed
          on our{" "}
          <a href="/pricing" className="underline">pricing page</a>.
          All prices are in Australian Dollars (AUD) unless otherwise stated.
          Prices are exclusive of applicable taxes (including VAT, GST, and sales
          tax), which will be calculated and added at checkout based on your
          billing location via Stripe Tax.
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
          retain access until then. We do not generally provide pro-rata refunds
          for partial months. However, if you are an EU/EEA consumer, you have a
          14-day right of withdrawal from the date of purchase. To exercise this
          right, contact us at{" "}
          <a href="mailto:hello@recoverkit.com" className="underline">hello@recoverkit.com</a>{" "}
          within 14 days. Nothing in these Terms excludes or limits your rights
          under the Australian Consumer Law, including any statutory right to a
          refund for a major failure.
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
          10. Feedback &amp; Ideas
        </h2>
        <p>
          If you submit comments, ideas, suggestions, or feedback about the
          Service (&quot;Feedback&quot;), you grant Act Two Pty Ltd a worldwide,
          perpetual, irrevocable, royalty-free, fully sublicensable right and
          licence to use, reproduce, modify, adapt, publish, and incorporate the
          Feedback into any product or service without restriction, attribution,
          or compensation to you. You acknowledge that Feedback is provided
          voluntarily and on a non-confidential basis, and that Act Two Pty Ltd
          is under no obligation to use any Feedback.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          11. Software Licence
        </h2>
        <p>
          Subject to your compliance with these Terms, we grant you a limited,
          non-exclusive, non-transferable, non-sublicensable, revocable licence
          to access and use the Service solely for your internal business
          purposes during the term of your subscription. You may not: (a) copy,
          modify, or create derivative works of the Service; (b) reverse-engineer,
          decompile, or disassemble any part of the Service; (c) sublicence,
          sell, resell, or redistribute the Service; or (d) use the Service to
          build a competing product or service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          12. Confidentiality
        </h2>
        <p>
          Each party (&quot;Receiving Party&quot;) agrees to hold in confidence
          all non-public information disclosed by the other party
          (&quot;Disclosing Party&quot;) that is designated as confidential or
          that reasonably should be understood to be confidential
          (&quot;Confidential Information&quot;). The Receiving Party will: (a)
          use Confidential Information only as necessary to exercise its rights
          or perform its obligations under these Terms; (b) not disclose
          Confidential Information to any third party except employees,
          contractors, or advisors who need to know and are bound by
          confidentiality obligations at least as restrictive as these.
        </p>
        <p>
          Confidential Information excludes information that: (i) is or becomes
          publicly available through no fault of the Receiving Party; (ii) was
          known to the Receiving Party prior to disclosure; (iii) is
          independently developed without use of Confidential Information; or
          (iv) is lawfully received from a third party without restriction.
          Either party may disclose Confidential Information if required by law,
          provided it gives prompt written notice (where legally permitted) to
          allow the Disclosing Party to seek protective measures.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          13. Intellectual Property
        </h2>
        <p>
          All rights in the Service (code, design, branding) remain with
          Act Two Pty Ltd. These Terms do not grant you any rights to our
          trademarks or proprietary materials beyond what is needed to use the
          Service.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          14. Third-Party Services
        </h2>
        <p>
          The Service integrates with third parties including Stripe &amp; Stripe
          Connect (payments &amp; account data), Supabase (authentication &amp;
          database), Resend (transactional email delivery), OpenAI (email
          personalisation), Mixpanel (analytics), and Vercel (hosting). Your use of
          those services is subject to their own terms and privacy policies.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          15. Data Aggregation
        </h2>
        <p>
          We may collect, compile, and use anonymised and aggregated data derived
          from your use of the Service (&quot;Aggregated Data&quot;) for purposes
          including but not limited to: benchmarking, product improvement,
          industry reports, and marketing materials (e.g., average recovery rates
          or churn benchmarks). Aggregated Data will not identify you, your
          business, or your customers. You retain all rights to your raw,
          non-aggregated data.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          16. Limitation of Liability
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
          17. Disclaimer
        </h2>
        <p>
          The Service is provided &quot;as is&quot; and &quot;as available&quot;.
          Except where prohibited by law, we disclaim all warranties, express or
          implied, including merchantability, fitness for a particular purpose, and
          non-infringement. We do not guarantee any specific recovery rate or
          revenue outcome.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          18. Free Trials
        </h2>
        <p>
          If we offer a free trial, you may use the Service at no charge for the
          specified trial period. At the end of the trial, your account will be
          downgraded to the free tier unless you subscribe to a paid plan. We will
          not charge you without your explicit consent.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          19. Indemnification
        </h2>
        <p>
          You agree to indemnify and hold harmless Act Two Pty Ltd, its officers,
          directors, and employees from any claims, damages, losses, liabilities,
          and expenses (including reasonable legal fees) arising from: (a) your use
          of the Service; (b) emails sent to your customers via the Service; (c)
          your violation of these Terms or any applicable law; or (d) any third-party
          claim related to the content of emails sent on your behalf. This
          indemnification obligation survives termination of your account.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          20. Business Transfers
        </h2>
        <p>
          If Act Two Pty Ltd, or substantially all of its assets, is acquired by
          or merged with another entity, or in the unlikely event that Act Two
          Pty Ltd goes out of business or enters administration, user information
          (including personal data) may be among the assets transferred to the
          acquiring entity. You acknowledge and consent to such transfer. The
          acquiring entity will be bound by the terms of this agreement and our
          Privacy Policy with respect to your data. We will notify you by email
          or prominent notice on the Service before your personal data is
          transferred and becomes subject to a different privacy policy.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          21. Copyright &amp; DMCA
        </h2>
        <p>
          We respect the intellectual property rights of others. If you believe
          that content available through the Service infringes your copyright,
          please send a notice to{" "}
          <a href="mailto:hello@recoverkit.com" className="underline">
            hello@recoverkit.com
          </a>{" "}
          containing: (a) identification of the copyrighted work claimed to be
          infringed; (b) identification of the allegedly infringing material and
          its location within the Service; (c) your contact information; (d) a
          statement that you have a good-faith belief that the use is not
          authorised by the copyright owner; and (e) a statement, under penalty
          of perjury, that the information in the notice is accurate and that you
          are the copyright owner or authorised to act on their behalf. We may
          remove or disable access to allegedly infringing material and may
          terminate the accounts of repeat infringers.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          22. Force Majeure
        </h2>
        <p>
          Neither party shall be liable for any failure or delay in performing its
          obligations where such failure or delay results from circumstances beyond
          the reasonable control of that party, including but not limited to natural
          disasters, acts of government, internet or infrastructure outages, cyber
          attacks, pandemics, or failures of third-party service providers
          (including Stripe, Supabase, or email delivery providers).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          23. Termination
        </h2>
        <p>
          We may suspend or terminate your account if you breach these Terms. You
          may delete your account at any time. On termination, your right to use
          the Service ceases immediately, we will stop sending emails on your
          behalf, and we will delete your data within 90 days (subject to legal
          retention requirements — see our Privacy Policy).
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          24. Governing Law
        </h2>
        <p>
          These Terms are governed by the laws of Victoria, Australia. Any disputes
          will be subject to the exclusive jurisdiction of the courts of Victoria.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          25. Changes to These Terms
        </h2>
        <p>
          We may update these Terms from time to time. We will notify you of
          material changes by email or in-app notice at least 14 days before they
          take effect. Continued use after the effective date constitutes
          acceptance.
        </p>

        <h2 className="text-2xl font-semibold" style={{ color: "var(--color-text)" }}>
          26. Contact
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
