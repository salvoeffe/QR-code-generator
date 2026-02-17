import Link from 'next/link';
import QRGenerator from '@/components/QRGenerator';
import { WebApplicationJsonLd } from '@/components/JsonLd';
import AdUnit from '@/components/AdUnit';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <WebApplicationJsonLd />
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

      <main className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">
            Free QR Code Generator
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Create QR codes for your website, link, or any text. No sign-up required. Instant download.
          </p>
        </div>

        <QRGenerator />

        {/* Ad unit - add slot from AdSense dashboard after approval */}
        <div className="mt-12 flex justify-center">
          <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} format="horizontal" className="w-full max-w-728px" />
        </div>

        <section className="mt-16 text-center text-zinc-600 dark:text-zinc-400 text-sm">
          <p>100% free. No account needed. Your data stays in your browser.</p>
        </section>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-24">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-zinc-500">
          <span>© {new Date().getFullYear()} QR Code Generator. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
