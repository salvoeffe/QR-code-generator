'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const isQRReader = pathname === '/qr-code-reader';

  const navLinkClass = (isActive: boolean) =>
    `transition-colors duration-200 py-2.5 px-2.5 min-h-[44px] flex items-center justify-center rounded-lg text-sm sm:text-base sm:min-h-0 sm:px-0 ${
      isActive
        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md shadow-[var(--shadow-sm)]">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors duration-200 tracking-tight"
        >
          <Image
            src="/favicon.ico"
            alt=""
            width={32}
            height={32}
            className="flex-shrink-0"
          />
          <span>QR Code Generator</span>
        </Link>
        <div className="flex flex-nowrap items-center gap-1 sm:gap-6 overflow-x-auto overflow-y-hidden py-1 -mx-1 sm:mx-0 sm:py-0">
          <Link href="/" className={`${navLinkClass(isHome)} whitespace-nowrap flex-shrink-0`}>
            QR Generator
          </Link>
          <Link href="/qr-code-reader" className={`${navLinkClass(isQRReader)} whitespace-nowrap flex-shrink-0`}>
            QR Reader
          </Link>
          <Link href="/blog" className={`${navLinkClass(pathname.startsWith('/blog'))} whitespace-nowrap flex-shrink-0`}>
            Blog
          </Link>
          <Link href="/faq" className={`${navLinkClass(pathname === '/faq')} whitespace-nowrap flex-shrink-0`}>
            FAQ
          </Link>
          <Link href="/about" className={`${navLinkClass(pathname === '/about')} whitespace-nowrap flex-shrink-0`}>
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
