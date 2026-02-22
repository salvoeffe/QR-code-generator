import Link from 'next/link';
import Header from '@/components/Header';
import QRScanner from '@/components/QRScanner';
import { getReaderPageContent } from '@/lib/content';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generatemyqrcode.com';

export async function generateMetadata() {
  const content = getReaderPageContent();
  if (!content) return {};
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: {
      canonical: `${baseUrl}/qr-code-reader`,
    },
  };
}

export default function QRCodeReaderPage() {
  const content = getReaderPageContent();

  if (!content) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-12 md:pb-20">
        <div className="text-center mb-10 sm:mb-12 hero-animate rounded-2xl p-6 sm:p-8 bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
            {content.h1}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            {content.heroSubtitle}
          </p>
          <p className="text-base text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto">
            {content.heroDescription}
          </p>
        </div>

        <QRScanner />

        <article className="mt-12 sm:mt-16 space-y-10">
          {content.bodyContent.map((section, i) => (
            <section key={i}>
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                {section.subheading}
              </h3>
              <div className="space-y-4">
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    className="text-zinc-600 dark:text-zinc-400 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </article>

        <div className="mt-12 rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Need to create a QR code?{' '}
            <Link
              href="/"
              className="text-emerald-600 font-medium hover:underline"
            >
              Generate one now
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
