import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service | QR Code Generator',
  description: 'Terms of Service for QR Code Generator. Rules and guidelines for using our free QR code tool.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            QR Code Generator
          </Link>
          <div className="flex gap-6">
            <Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
              Blog
            </Link>
            <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Terms of Service</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              By accessing or using QR Code Generator (&quot;the service&quot;), you agree to be bound by these Terms of
              Service. If you do not agree, please do not use the service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">2. Description of Service</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We provide a free, web-based tool that generates QR code images from URLs or text that you provide. The
              service is offered &quot;as is&quot; for personal and commercial use, subject to these terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">3. Acceptable Use</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">You agree not to use the service to:</p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>Generate QR codes that link to illegal, harmful, or malicious content</li>
              <li>Distribute malware, phishing links, or content that harms others</li>
              <li>Circumvent rate limits or otherwise abuse the service</li>
              <li>Violate any applicable laws or third-party rights</li>
            </ul>
            <p className="text-zinc-600 dark:text-zinc-400 mt-4">
              We reserve the right to block access or terminate service for violations of acceptable use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">4. Disclaimer of Warranties</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              The service is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not warrant that the service will be
              uninterrupted, error-free, or free of harmful components. You use the service at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">5. Limitation of Liability</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special,
              consequential, or punitive damages arising from your use of the service. Our total liability shall not
              exceed the amount you paid to use the service (which is zero for the free tier).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">6. Intellectual Property</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              The QR code images you generate using the service are yours to use. The service itself, including its
              design, code, and branding, remains our property. You may not copy, modify, or reverse-engineer the
              service without permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">7. Changes</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We may update these Terms of Service from time to time. Continued use of the service after changes
              constitutes acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">8. Contact</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              For questions about these terms, please visit our{' '}
              <Link href="/about" className="text-emerald-600 hover:underline">
                About
              </Link>{' '}
              page.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
