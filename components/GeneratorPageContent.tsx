'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import QRGenerator, { type ContentType } from '@/components/QRGenerator';
import HowToUseSection from '@/components/HowToUseSection';
import HomepageFAQAccordion from '@/components/HomepageFAQAccordion';
import LatestGuides from '@/components/LatestGuides';
import { WebApplicationJsonLd, FAQJsonLd } from '@/components/JsonLd';
import AdUnit from '@/components/AdUnit';
import Header from '@/components/Header';
import { TOP_HOMEPAGE_FAQS } from '@/lib/faq';
import { getContentByType, QR_SOLUTIONS } from '@/lib/content';
import type { PostMeta } from '@/lib/posts';

export type HeroConfig = {
  title: string;
  subtitle: string;
  description: string;
};

const DEFAULT_HERO: HeroConfig = {
  title: 'Free QR Code Generator',
  subtitle: 'No sign-up. No expiration. Instant download.',
  description: 'Create QR codes for your website, link, or any text.',
};

type GeneratorPageContentProps = {
  hero?: HeroConfig;
  initialContentType?: ContentType;
  latestPosts: PostMeta[];
};

export default function GeneratorPageContent({
  hero = DEFAULT_HERO,
  initialContentType,
  latestPosts,
}: GeneratorPageContentProps) {
  const [activeContentType, setActiveContentType] = useState<ContentType>(initialContentType ?? 'url');

  useEffect(() => {
    setActiveContentType(initialContentType ?? 'url');
  }, [initialContentType]);

  const { bodyContent, howToSteps } = getContentByType(activeContentType);

  return (
    <div className="min-h-screen relative">
      <WebApplicationJsonLd />
      <FAQJsonLd items={TOP_HOMEPAGE_FAQS} id="faq-homepage-jsonld" />
      <div
        className="absolute inset-0 top-0 left-0 right-0 h-[40vh] max-h-[320px] pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          background: 'radial-gradient(ellipse 80% 70% at 70% 0%, rgb(5, 150, 105), transparent 60%)',
        }}
        aria-hidden
      />
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-8 sm:pb-12 md:pb-20 relative">
        <div className="text-center mb-10 sm:mb-12 hero-animate rounded-2xl p-6 sm:p-8 bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-2 tracking-tight">
            {hero.title}
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-4 leading-relaxed">
            {hero.subtitle}
          </p>
          <p className="text-base text-zinc-500 dark:text-zinc-500 max-w-2xl mx-auto">
            {hero.description}
          </p>
        </div>

        <QRGenerator
          initialContentType={initialContentType}
          onContentTypeChange={setActiveContentType}
        />

        <div key={activeContentType} className="animate-in fade-in duration-200">
          {bodyContent.length > 0 && (
            <article className="mt-12 sm:mt-16 space-y-10">
              {bodyContent.map((section, i) => (
                <section key={i}>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                    {section.subheading}
                  </h3>
                  <div className="space-y-4">
                    {section.paragraphs.map((p, j) => (
                      <p key={j} className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        {p}
                      </p>
                    ))}
                  </div>
                </section>
              ))}
            </article>
          )}

          <HowToUseSection steps={howToSteps} />
        </div>

        <div className="mt-10 sm:mt-12 flex justify-center">
          <AdUnit slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT} format="horizontal" className="w-full max-w-[728px]" />
        </div>

        <HomepageFAQAccordion items={TOP_HOMEPAGE_FAQS} />

        <LatestGuides posts={latestPosts} />

        <section className="mt-12 sm:mt-16 text-center text-zinc-500 dark:text-zinc-500 text-sm">
          <p className="font-medium">100% free · No account needed · Your data stays in your browser</p>
        </section>
      </main>

      <footer className="border-t border-zinc-200/80 dark:border-zinc-800/80 mt-16 sm:mt-24 shadow-[var(--shadow-sm)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:justify-between gap-8 sm:gap-12">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3">QR Solutions</h3>
              <ul className="flex flex-wrap gap-x-4 gap-y-2">
                {QR_SOLUTIONS.map(({ slug, label }) => (
                  <li key={slug}>
                    <Link href={`/${slug}`} className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap gap-4 sm:gap-6">
              <Link href="/faq" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
                FAQ
              </Link>
              <Link href="/privacy" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors py-2 min-h-[44px] flex items-center sm:min-h-0 sm:py-0">
                Terms of Service
              </Link>
            </div>
          </div>
          <span className="text-sm text-zinc-500">© {new Date().getFullYear()} QR Code Generator. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}
