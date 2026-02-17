import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'Privacy Policy | QR Code Generator',
  description: 'Privacy Policy for QR Code Generator. Learn how we collect, use, and protect your data.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">Privacy Policy</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-6">Last updated: {new Date().toLocaleDateString('en-US')}</p>

        <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">1. Introduction</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              QR Code Generator (&quot;we&quot;, &quot;our&quot;, or &quot;the site&quot;) is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, and safeguard information when you use our free QR code
              generation tool.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              When you use our QR code generator, we may collect:
            </p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Text/URL you encode:</strong> The content you submit to generate a QR code is processed on our
                servers to produce the image. We do not permanently store this content.
              </li>
              <li>
                <strong>Usage data:</strong> We may collect non-personally identifiable information such as IP address,
                browser type, and timestamps for rate limiting and security purposes.
              </li>
              <li>
                <strong>Cookies:</strong> We use cookies for functionality (e.g., cookie consent preferences) and, when
                you consent, for advertising via Google AdSense.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">3. Google AdSense</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We use Google AdSense to display advertisements. Google and its partners may use cookies and similar
              technologies to personalize ads based on your interests and browsing activity. You can learn more about
              how Google uses your data and manage ad settings at{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-600 hover:underline"
              >
                Google&apos;s Advertising Policy
              </a>
              . We will only load advertising scripts after you accept non-essential cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">4. How We Use Your Information</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We use the information we collect to: provide and improve the QR code generation service; prevent abuse
              through rate limiting; display relevant advertisements (with your consent); and comply with legal
              obligations.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">5. Data Retention</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We do not store the text or URLs you submit for QR generation beyond the time needed to process the
              request and return the image. Logs and analytics data may be retained for a limited period for security
              and optimization.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">6. Your Rights</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Depending on your location, you may have the right to access, correct, or delete your personal data; object
              to processing; or withdraw consent for cookies. You can manage cookie preferences through our cookie
              consent banner.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">7. Contact</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              For questions about this Privacy Policy, please visit our{' '}
              <Link href="/about" className="text-emerald-600 hover:underline">
                About
              </Link>{' '}
              page for contact information.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
