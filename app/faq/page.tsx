import Link from 'next/link';
import Header from '@/components/Header';
import { FAQJsonLd } from '@/components/JsonLd';
import { FAQ_ITEMS } from '@/lib/faq';

export const metadata = {
  title: 'FAQ | QR Code Generator',
  description:
    'Frequently asked questions about QR codes: safety, data privacy, how long they last, and more. Create free QR codes at GenerateMyQRCode.com.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <FAQJsonLd items={FAQ_ITEMS} />
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          {FAQ_ITEMS.map((item) => (
            <section
              key={item.question}
              id={item.id}
              className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                {item.question}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.answer}
              </p>
            </section>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
          <p className="text-zinc-600 dark:text-zinc-400 text-sm">
            Ready to create your QR code?{' '}
            <Link href="/" className="text-emerald-600 font-medium hover:underline">
              Generate one now →
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
