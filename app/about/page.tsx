import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'About | QR Code Generator',
  description: 'About QR Code Generator. Learn about our free, simple QR code creation tool.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">About</h1>

        <div className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6 md:p-8">
          <div className="prose prose-zinc dark:prose-invert max-w-none space-y-6">
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            QR Code Generator is a free, simple web tool that lets anyone create QR codes instantly. Enter a URL or text,
            and get a downloadable PNG image—no sign-up, no fees.
          </p>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Our Mission</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              We believe everyone should have access to a reliable, easy-to-use QR code generator. Whether you need a
              code for your website, business card, menu, or event, we want the process to be fast and hassle-free.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">How It Works</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Our tool runs entirely in your browser and on our servers. You type or paste your content, we generate the
              QR code image in real time, and you can download it immediately. We don&apos;t store the content you encode,
              and we keep the interface minimal so you can focus on getting your code.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Learn More</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Check out our{' '}
              <Link href="/blog" className="text-emerald-600 hover:underline">
                Blog
              </Link>{' '}
              for tips on QR code best practices, use cases, and more. If you have questions or feedback, you can reach
              out through our contact form or the contact information listed on this site.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mt-8 mb-4">Legal</h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Please review our{' '}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Privacy Policy
              </Link>{' '}
              and{' '}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Terms of Service
              </Link>{' '}
              for details on how we handle your data and your use of the service.
            </p>
          </section>
          </div>
        </div>
      </main>
    </div>
  );
}
