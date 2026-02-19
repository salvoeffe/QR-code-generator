import Link from 'next/link';
import QRGenerator from '@/components/QRGenerator';
import { WebApplicationJsonLd } from '@/components/JsonLd';
import AdUnit from '@/components/AdUnit';
import Header from '@/components/Header';

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <WebApplicationJsonLd />
      {/* Optional hero accent: faint emerald glow at top */}
      <div
        className="absolute inset-0 top-0 left-0 right-0 h-[40vh] max-h-[320px] pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 70% 0%, rgb(5, 150, 105), transparent 60%)',
        }}
        aria-hidden
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-20 relative">
        <div className="text-center mb-10 sm:mb-12 hero-animate rounded-2xl p-6 sm:p-8 bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Free QR Code Generator — No Sign-Up, Instant Download
          </h1>
          <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Create QR codes for your website, link, or any text. No sign-up required. Instant download.
          </p>
          <p className="mt-4 text-sm font-normal text-zinc-500 dark:text-zinc-500">
            No expiration · Unlimited scans · No account · We don&apos;t store your data
          </p>
        </div>

        <QRGenerator />

        {/* Ad unit - add slot from AdSense dashboard after approval */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} format="horizontal" className="w-full max-w-[728px]" />
        </div>

        <section className="mt-12 sm:mt-16 text-center text-zinc-500 dark:text-zinc-500 text-sm">
          <p className="font-medium">100% free · No account needed · Your data stays in your browser</p>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 mt-16 sm:mt-24 shadow-[var(--shadow-sm)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</span>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            <Link href="/faq" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
              FAQ
            </Link>
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
