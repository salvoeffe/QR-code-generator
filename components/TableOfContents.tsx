'use client';

import { useState } from 'react';
import Link from 'next/link';

export type HeadingItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export default function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  if (headings.length < 3) return null;

  return (
    <nav className="mb-6" aria-label="On this page">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden w-full flex items-center justify-between rounded-lg border border-zinc-200/60 dark:border-zinc-700/50 bg-[var(--surface-elevated)] px-4 py-3 text-left font-medium text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
        aria-expanded={isOpen}
      >
        On this page
        <svg
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sticky top-24">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            On this page
          </h3>
          <ul className="space-y-2 text-sm">
            {headings.map((h) => (
              <li
                key={h.id}
                className={h.level === 3 ? 'pl-4 border-l-2 border-zinc-200 dark:border-zinc-600 ml-1' : ''}
              >
                <Link
                  href={`#${h.id}`}
                  className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors line-clamp-2"
                >
                  {h.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
