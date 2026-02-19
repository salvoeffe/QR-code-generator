import Link from 'next/link';
import Header from '@/components/Header';

export const metadata = {
  title: 'FAQ | QR Code Generator',
  description:
    'Frequently asked questions about QR codes: safety, data privacy, how long they last, and more. Create free QR codes at GenerateMyQRCode.com.',
};

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4">
          <section className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Are these QR codes safe? Does this site track my data?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Yes, the QR codes you generate here are safe to use. We do not store the text or URLs you encode. Your
              input is sent to our server only to generate the QR image and is not saved, logged, or shared. Once the
              image is sent back to you, that data is discarded. For more details, see our{' '}
              <Link href="/privacy" className="text-emerald-600 hover:underline">
                Privacy Policy
              </Link>
              .
            </p>
          </section>

          <section className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              How long does a QR code last?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Static QR codes (like the ones we generate) last forever. The data is encoded directly into the image, so
              as long as the code is intact and the destination URL or content still exists, it will continue to work.
              There is no expiration date. The only thing that can break a QR code is if the linked website goes offline
              or the printed code is damaged.
            </p>
          </section>

          <section id="why-not-scanning" className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Why is my QR code not scanning?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
              Common reasons and fixes:
            </p>
            <ul className="list-disc pl-6 text-zinc-600 dark:text-zinc-400 space-y-2">
              <li>
                <strong>Too small:</strong> Make the QR code at least 1 inch (2.5 cm) per side for print, or 200×200
                pixels for digital use.
              </li>
              <li>
                <strong>Poor contrast:</strong> Use dark modules on a light background. Light-on-dark or low-contrast
                designs can fail to scan.
              </li>
              <li>
                <strong>Damaged or obscured:</strong> Avoid covering the code with text, logos, or folds. Keep a clear
                &quot;quiet zone&quot; (margin) around it.
              </li>
              <li>
                <strong>Wrong URL:</strong> Double-check the link before generating. Try our tool with a simple URL like
                https://example.com first to confirm your phone scanner works.
              </li>
            </ul>
          </section>

          <section className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              What is the difference between static and dynamic QR codes?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              <strong>Static QR codes</strong> (like ours) encode the data directly. The URL or text is fixed in the
              image. They are free, simple, and never expire. <strong>Dynamic QR codes</strong> encode a short redirect
              URL that points to a server. You can change where that redirect goes without reprinting the code, and you
              can track scans. Dynamic codes usually require a paid service. For most use cases (business cards, menus,
              flyers), static codes are sufficient. Use our{' '}
              <Link href="/" className="text-emerald-600 hover:underline">
                free QR code generator
              </Link>{' '}
              to create static codes.
            </p>
          </section>

          <section className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              Is this QR code generator really free?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Yes. You can create as many QR codes as you need at no cost. No sign-up, no account, and no premium
              tier. We keep the tool free and simple. Optional advertising helps us cover hosting costs.
            </p>
          </section>

          <section className="rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
              What file format do I get?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              You get a PNG image file. PNG works everywhere: print, web, documents, and design tools. You can resize it
              as needed, but avoid making it too small or it may not scan well.
            </p>
          </section>
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
