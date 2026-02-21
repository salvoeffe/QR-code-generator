export default function HowToUseSection() {
  return (
    <section className="mt-12 sm:mt-16" aria-labelledby="how-to-heading">
      <h2 id="how-to-heading" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
        How to Generate a Free QR Code
      </h2>

      <div className="space-y-8">
        <div id="step-1">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Step 1: Enter Your URL, Text, or Wi‑Fi Details
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Use the input field in the generator above. Choose between a URL (for websites and links), plain text (for
            short messages or vCards), or Wi‑Fi (to share your network credentials). Paste your content or fill in the
            details. The QR code generates instantly as you type.
          </p>
        </div>

        <div id="step-2">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Step 2: Choose Your QR Code Size
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Select a size that fits your use case: 256px or 384px for digital use (screens, emails), 512px for general
            print, or 1024px for high-quality print. Larger sizes ensure reliable scanning. The generator above updates
            the preview in real time.
          </p>
        </div>

        <div id="step-3">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
            Step 3: Download Your QR Code
          </h3>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Click the Download PNG button to save your QR code. You receive a PNG file that works everywhere: print,
            web, documents, and design tools. No sign-up required. Scan with your phone to test before printing.
          </p>
        </div>
      </div>
    </section>
  );
}
