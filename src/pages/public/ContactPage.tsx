import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ContactPage() {
  return (
    <div className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--color-text)] sm:text-5xl">
          Contact Us
        </h1>
        <p className="mt-4 text-xl text-[var(--color-muted)] max-w-2xl mx-auto">
          We're here to help. Get in touch with our support team or send us a message.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold mb-6">Get in touch</h2>
          <div className="space-y-6">
            <Card className="border-[var(--color-muted)]/20 shadow-sm">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-[var(--color-accent)]/10 p-3 rounded-lg">
                  <Mail className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email Support</h3>
                  <p className="text-[var(--color-muted)] mb-2">Our team is ready to help you with any questions.</p>
                  <a href="mailto:tradebetter98@gmail.com" className="text-[var(--color-accent)] hover:underline font-medium">
                    tradebetter98@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[var(--color-muted)]/20 shadow-sm">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-[var(--color-accent)]/10 p-3 rounded-lg">
                  <Phone className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Phone Support</h3>
                  <p className="text-[var(--color-muted)] mb-2">Mon-Fri from 9am to 6pm WAT.</p>
                  <a href="tel:+2348000000000" className="text-[var(--color-accent)] hover:underline font-medium">
                    +234 (0) 800 000 0000
                  </a>
                </div>
              </CardContent>
            </Card>
            <Card className="border-[var(--color-muted)]/20 shadow-sm">
              <CardContent className="p-6 flex items-start space-x-4">
                <div className="bg-[var(--color-accent)]/10 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Headquarters</h3>
                  <p className="text-[var(--color-muted)]">
                    Lagos, Nigeria
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="border-[var(--color-muted)]/20 shadow-xl">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Message sent successfully!'); }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">First Name</label>
                    <Input required placeholder="John" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Last Name</label>
                    <Input required placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Email</label>
                  <Input type="email" required placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-muted)] mb-1">Message</label>
                  <textarea 
                    required 
                    rows={4} 
                    className="flex w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm placeholder:text-[var(--color-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="How can we help you?"
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
