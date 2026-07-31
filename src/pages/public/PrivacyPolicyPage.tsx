import { Link } from 'react-router-dom';

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Privacy Policy</h1>
        <p className="text-[var(--color-muted)]">Effective Date: July 31, 2026</p>
      </div>

      <div className="space-y-8 text-[var(--color-text)]/90 leading-relaxed">
        <section>
          <p className="mb-4">
            At POSNaija, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our application ("Service"). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">1. Information We Collect</h2>
          <p className="mb-4">We may collect information about you in a variety of ways. The information we may collect via the Service includes:</p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">Personal Data</h3>
          <p className="mb-4">
            Personally identifiable information, such as your name, email address, phone number, and demographic information that you voluntarily give to us when you register with the Service or when you choose to participate in various activities related to the Service.
          </p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">Business Data</h3>
          <p className="mb-4">
            Information regarding your business, including inventory, sales records, customer details, branch locations, and staff profiles that you upload or input into the POS system to manage your operations.
          </p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">Derivative Data</h3>
          <p className="mb-4">
            Information our servers automatically collect when you access the Service, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">2. How We Use Your Information</h2>
          <p className="mb-4">
            Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Service to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Create and manage your account and subscriptions.</li>
            <li>Process your transactions, inventory updates, and synchronize data across your devices (including cloud backup for supported plans).</li>
            <li>Provide customer support and respond to inquiries.</li>
            <li>Compile anonymous statistical data and analysis for use internally or with third parties to improve our Service.</li>
            <li>Deliver targeted advertising, newsletters, and other information regarding promotions and the Service to you.</li>
            <li>Monitor and analyze usage and trends to improve your experience with the Service.</li>
            <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">3. Disclosure of Your Information</h2>
          <p className="mb-4">
            We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
          </p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">By Law or to Protect Rights</h3>
          <p className="mb-4">
            If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">Third-Party Service Providers</h3>
          <p className="mb-4">
            We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </p>
          <h3 className="text-lg font-medium text-[var(--color-text)] mb-2 mt-4">Business Transfers</h3>
          <p className="mb-4">
            We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">4. Data Security and Retention</h2>
          <p className="mb-4">
            We use administrative, technical, and physical security measures to help protect your personal and business information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable.
          </p>
          <p className="mb-4">
            We will only retain your personal information for as long as necessary to fulfil the purposes we collected it for, including for the purposes of satisfying any legal, accounting, or reporting requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">5. Your Privacy Rights</h2>
          <p className="mb-4">
            You may at any time review or change the information in your account or terminate your account by:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Logging into your account settings and updating your account.</li>
            <li>Contacting us using the contact information provided below.</li>
          </ul>
          <p className="mb-4">
            Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">6. Cookies and Tracking Technologies</h2>
          <p className="mb-4">
            We may use cookies, web beacons, tracking pixels, and other tracking technologies on the Service to help customize the Site and improve your experience. For more information on how we use cookies, please refer to our <Link to="/cookie-policy" className="text-[var(--color-accent)] hover:underline">Cookie Policy</Link>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">7. Changes to This Privacy Policy</h2>
          <p className="mb-4">
            We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Effective Date" of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">8. Contact Us</h2>
          <p className="mb-4">
            If you have questions or comments about this Privacy Policy, please <Link to="/contact" className="text-[var(--color-accent)] hover:underline">contact us</Link>.
          </p>
        </section>
      </div>
    </div>
  );
}
