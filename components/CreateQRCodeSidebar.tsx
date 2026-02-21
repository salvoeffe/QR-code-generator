import Link from 'next/link';

export default function CreateQRCodeSidebar() {
  return (
    <aside>
      <div className="sticky top-24 rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 overflow-hidden">
        <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-lg">
          Create Your QR Code
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 leading-relaxed">
          Free, instant, no sign-up.
        </p>
        <Link
          href="/"
          className="mt-4 inline-flex items-center justify-center w-full rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-4 transition-colors duration-200"
        >
          Get Started
        </Link>
      </div>
    </aside>
  );
}
