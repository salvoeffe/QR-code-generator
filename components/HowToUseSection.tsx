import Link from 'next/link';
import type { HowToStep } from '@/lib/content';

const DEFAULT_STEPS: HowToStep[] = [
  {
    stepTitle: 'Step 1: Enter Your URL, Text, or Wi‑Fi Details',
    stepDescription:
      'Use the input field in the generator above. Choose between a URL (for websites and links), plain text (for short messages or vCards), or Wi‑Fi (to share your network credentials). Paste your content or fill in the details. The QR code generates instantly as you type.',
  },
  {
    stepTitle: 'Step 2: Choose Your QR Code Size',
    stepDescription:
      'Select a size that fits your use case: 256px or 384px for digital use (screens, emails), 512px for general print, or 1024px for high-quality print. Larger sizes ensure reliable scanning. The generator above updates the preview in real time.',
  },
  {
    stepTitle: 'Step 3: Download Your QR Code',
    stepDescription:
      'Click the Download PNG button to save your QR code. You receive a PNG file that works everywhere: print, web, documents, and design tools. No sign-up required. Scan with your phone to test before printing.',
  },
];

type HowToUseSectionProps = {
  steps?: HowToStep[];
};

export default function HowToUseSection({ steps }: HowToUseSectionProps) {
  const displaySteps = steps && steps.length > 0 ? steps : DEFAULT_STEPS;

  return (
    <section className="mt-12 sm:mt-16 animate-in fade-in duration-200" aria-labelledby="how-to-heading">
      <h2 id="how-to-heading" className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
        How to Generate a Free QR Code
      </h2>

      <div className="space-y-8">
        {displaySteps.map((step, i) => (
          <div key={i} id={`step-${i + 1}`}>
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">{step.stepTitle}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{step.stepDescription}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Looking for something specific? Try our{' '}
        <Link href="/vcard-qr-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
          vCard Generator
        </Link>{' '}
        or{' '}
        <Link href="/whatsapp-qr-generator" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
          WhatsApp Link Tool
        </Link>
        .
      </p>
    </section>
  );
}
