import React from 'react';
import { Link } from 'react-router-dom';

export default function RefundPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Refund Policy</h1>
        <p className="text-[var(--color-muted)]">Effective Date: August 1, 2026</p>
      </div>

      <div className="space-y-8 text-[var(--color-text)]/90 leading-relaxed">
        <section>
          <p className="mb-4">
            Thank you for choosing PosNaija. We strive to ensure our customers are satisfied with the product they have purchased from us. If you are not entirely satisfied with your purchase, we're here to help.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">1. Monthly Subscriptions</h2>
          <p className="mb-4">
            If you are not satisfied with your monthly subscription, you may cancel it at any time. We do not offer prorated refunds for canceled subscriptions. Your access to the paid features will remain active until the end of your current billing cycle.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">2. Lifetime Purchases</h2>
          <p className="mb-4">
            For the "Lifetime" plan, we offer a 14-day money-back guarantee. If you are not completely satisfied with your purchase within the first 14 days, please contact us for a full refund. After 14 days, no refunds will be issued for Lifetime purchases.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">3. Exceptional Circumstances</h2>
          <p className="mb-4">
            We understand that exceptional circumstances can take place regarding the character of the product we supply. Therefore, we do honor requests for a refund in situations such as:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Non-delivery of the product: Due to some mailing issues of your e-mail provider or your own mail server you might not receive a delivery e-mail from us.</li>
            <li>Major defects: Although all our products are thoroughly tested before release, unexpected errors may occur. You should contact us for such issues. We keep the right to rectify the error or defect within 72 hours.</li>
            <li>Product not-as-described: Such issues should be reported to our technical support department within 14 days from the date of the purchase.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">4. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our Returns and Refunds Policy, please contact us at: <a href="mailto:tradebetter98@gmail.com" className="text-[var(--color-accent)] hover:underline">tradebetter98@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
