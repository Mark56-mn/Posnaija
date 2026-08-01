import React from 'react';

export default function FAQPage() {
  const faqs = [
    {
      question: "Do I need internet access to use PosNaija?",
      answer: "No! If you are on the Pro or Lifetime plan, PosNaija is truly offline-first. You only need internet access to log in initially, sync your data to the cloud for backup, or access your dashboard from another device. You can keep making sales completely offline."
    },
    {
      question: "How does the Lifetime plan work?",
      answer: "The Lifetime plan allows you to pay a one-time fee of ₦10,000 and get access to all Pro features forever. There are no recurring monthly or annual charges."
    },
    {
      question: "Can I manage multiple shops?",
      answer: "Yes, you can create multiple branches under one administrator account, assign staff to specific branches, and track inventory and sales for each location separately."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use industry-standard encryption to protect your data. Your data is synced securely to our cloud databases ensuring you never lose your sales records or inventory data even if your device gets lost or broken."
    },
    {
      question: "What hardware do I need?",
      answer: "PosNaija works on any modern device with a web browser. You can use it on your smartphone, tablet, laptop, or desktop computer. It supports standard Bluetooth and USB barcode scanners, as well as thermal receipt printers."
    }
  ];

  return (
    <div className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl">
          Frequently Asked Questions
        </h1>
        <p className="mt-4 text-xl text-[var(--color-muted)]">
          Got questions? We've got answers. If you have some other questions, see our contact page.
        </p>
      </div>

      <div className="space-y-8">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[var(--color-surface)] border border-[var(--color-muted)]/10 rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-3">{faq.question}</h3>
            <p className="text-[var(--color-muted)] text-lg leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
