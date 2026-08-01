import React from 'react';

export default function CookiePolicyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[var(--color-text)] mb-4">Cookie Policy</h1>
        <p className="text-[var(--color-muted)]">Effective Date: August 1, 2026</p>
      </div>

      <div className="space-y-8 text-[var(--color-text)]/90 leading-relaxed">
        <section>
          <p className="mb-4">
            This Cookie Policy explains how PosNaija uses cookies and similar technologies to recognize you when you visit our website and use our application. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">1. What are cookies?</h2>
          <p className="mb-4">
            Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
          </p>
          <p className="mb-4">
            Cookies set by the website owner (in this case, PosNaija) are called "first-party cookies". Cookies set by parties other than the website owner are called "third-party cookies".
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">2. Why do we use cookies?</h2>
          <p className="mb-4">
            We use first and third-party cookies for several reasons. Some cookies are required for technical reasons in order for our website and application to operate, and we refer to these as "essential" or "strictly necessary" cookies. Other cookies also enable us to track and target the interests of our users to enhance the experience on our properties.
          </p>
          <p className="mb-4">
            Specifically, PosNaija uses local storage and cookies to:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Keep you logged in across sessions securely.</li>
            <li>Store your offline sales, inventory, and cart data so you can work without an internet connection.</li>
            <li>Remember your preferences (such as theme and language settings).</li>
            <li>Understand how you use our application so we can improve its performance and features.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">3. How can I control cookies?</h2>
          <p className="mb-4">
            You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide you with services.
          </p>
          <p className="mb-4">
            You can also set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">4. Updates to this Cookie Policy</h2>
          <p className="mb-4">
            We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-[var(--color-text)] mb-4">5. Contact Us</h2>
          <p className="mb-4">
            If you have any questions about our use of cookies or other technologies, please contact us at: <a href="mailto:tradebetter98@gmail.com" className="text-[var(--color-accent)] hover:underline">tradebetter98@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
