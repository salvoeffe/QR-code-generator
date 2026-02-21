'use client';

import { useState } from 'react';
import Link from 'next/link';

type FAQItem = { question: string; answer: string };

export default function HomepageFAQAccordion({ items }: { items: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div
              key={item.question}
              className={`rounded-xl border transition-colors duration-200 ${
                isOpen
                  ? 'border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20'
                  : 'border-zinc-200/80 dark:border-zinc-700/60 bg-[var(--surface-elevated)]'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${index}`}
                id={`faq-question-${index}`}
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 shrink-0 text-zinc-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                id={`faq-answer-${index}`}
                role="region"
                aria-labelledby={`faq-question-${index}`}
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-5 pb-4 pt-0">
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-[15px]">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
        <Link href="/faq" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
          View all FAQs →
        </Link>
      </p>
    </section>
  );
}
