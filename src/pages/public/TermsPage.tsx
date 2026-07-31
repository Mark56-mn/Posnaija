import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Terms and Conditions</h1>
        <p className="text-[var(--color-muted)]">Last updated: July 31, 2026</p>
      </div>

      <div className="space-y-8 text-[var(--color-text)]/90 leading-relaxed">
        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">1. Acceptance of Terms</h2>
          <p className="mb-4">
            By accessing or using the POSNaija application ("the Service"), you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, then you may not access the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">2. Account Registration</h2>
          <p className="mb-4">
            You must register for an account to access our POS features. When creating an account, you must provide accurate, complete, and current information. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
          </p>
          <p className="mb-4">
            You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">3. Subscription, Payments, and Billing</h2>
          <p className="mb-4">
            Some parts of the Service are billed on a subscription basis ("Pro", "Lifetime"). You will be billed in advance on a recurring and periodic basis (except for Lifetime plans). 
          </p>
          <p className="mb-4">
            All payments are non-refundable unless otherwise explicitly stated in our <Link to="/refund-policy" className="text-[var(--color-accent)] hover:underline">Refund Policy</Link>. We reserve the right to change our subscription fees upon prior notice to you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">4. Acceptable Use and Conduct</h2>
          <p className="mb-4">
            You agree not to use the Service:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent.</li>
            <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity.</li>
            <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">5. Data Ownership and Security</h2>
          <p className="mb-4">
            You retain all rights to the business data, products, and customer information you upload or process through the Service. We claim no ownership over your data.
          </p>
          <p className="mb-4">
            We implement industry-standard security measures to protect your data, but we cannot guarantee absolute security. You agree to notify us immediately of any unauthorized access to your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">6. Intellectual Property</h2>
          <p className="mb-4">
            The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of POSNaija and its licensors. The Service is protected by copyright, trademark, and other laws.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">7. Termination</h2>
          <p className="mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="mb-4">
            Upon termination, your right to use the Service will immediately cease. If you wish to terminate your account, you may simply discontinue using the Service or contact support to request account deletion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">8. Limitation of Liability</h2>
          <p className="mb-4">
            In no event shall POSNaija, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Your access to or use of or inability to access or use the Service.</li>
            <li>Any conduct or content of any third party on the Service.</li>
            <li>Any content obtained from the Service.</li>
            <li>Unauthorized access, use or alteration of your transmissions or content.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">9. Changes to Terms</h2>
          <p className="mb-4">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">10. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about these Terms, please <Link to="/contact" className="text-[var(--color-accent)] hover:underline">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
