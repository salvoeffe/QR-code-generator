import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm">
      <nav className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <Image
            src="/icon.png"
            alt=""
            width={32}
            height={32}
            className="flex-shrink-0"
          />
          <span>QR Code Generator</span>
        </Link>
        <div className="flex gap-4 sm:gap-6">
          <Link
            href="/blog"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1 min-h-[44px] min-w-[44px] flex items-center sm:min-h-0 sm:min-w-0"
          >
            Blog
          </Link>
          <Link
            href="/faq"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1 min-h-[44px] min-w-[44px] flex items-center sm:min-h-0 sm:min-w-0"
          >
            FAQ
          </Link>
          <Link
            href="/about"
            className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors py-1 min-h-[44px] min-w-[44px] flex items-center sm:min-h-0 sm:min-w-0"
          >
            About
          </Link>
        </div>
      </nav>
    </header>
  );
}
