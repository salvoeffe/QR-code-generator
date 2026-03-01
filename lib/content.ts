import type { ContentType } from '@/components/QRGenerator';

import contentData from '@/content.json';

export type BodySection = {
  subheading: string;
  paragraphs: string[];
};

export type HowToStep = {
  stepTitle: string;
  stepDescription: string;
};

export type PageContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  heroDescription: string;
  contentType: ContentType;
  bodyContent: BodySection[];
  howToSteps?: HowToStep[];
  /** Blog post slugs for contextual internal links on this solution page */
  relatedBlogSlugs?: string[];
};

export type ReaderPageContent = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSubtitle: string;
  heroDescription: string;
  bodyContent: BodySection[];
};

const data = contentData as Record<string, PageContent | ReaderPageContent>;

export const QR_SOLUTIONS: { slug: string; label: string }[] = [
  { slug: 'vcard-qr-generator', label: 'vCard Generator' },
  { slug: 'whatsapp-qr-generator', label: 'WhatsApp QR Code' },
  { slug: 'wifi-qr-generator', label: 'Wi-Fi QR Code' },
  { slug: 'sms-qr-generator', label: 'SMS QR Code' },
];

const CONTENT_TYPE_TO_SLUG: Record<ContentType, string> = {
  url: 'url',
  text: 'url',
  vcard: 'vcard-qr-generator',
  wifi: 'wifi-qr-generator',
  whatsapp: 'whatsapp-qr-generator',
  sms: 'sms-qr-generator',
};

export function getPageContent(slug: string): PageContent | null {
  const entry = data[slug];
  if (!entry || !('contentType' in entry)) return null;
  return entry as PageContent;
}

export function getReaderPageContent(): ReaderPageContent | null {
  const entry = data['qr-code-reader'];
  if (!entry || typeof entry !== 'object') return null;
  const c = entry as Record<string, unknown>;
  if (
    typeof c.slug !== 'string' ||
    typeof c.metaTitle !== 'string' ||
    typeof c.metaDescription !== 'string' ||
    typeof c.h1 !== 'string' ||
    typeof c.heroSubtitle !== 'string' ||
    typeof c.heroDescription !== 'string' ||
    !Array.isArray(c.bodyContent)
  ) {
    return null;
  }
  return entry as ReaderPageContent;
}

export function getContentByType(
  contentType: ContentType
): { bodyContent: BodySection[]; howToSteps: HowToStep[] } {
  const slug = CONTENT_TYPE_TO_SLUG[contentType];
  const entry = data[slug] as PageContent | undefined;
  const fallback = data['url'] as PageContent | undefined;

  const bodyContent = (entry?.bodyContent ?? fallback?.bodyContent ?? []) as BodySection[];
  const howToSteps = (entry?.howToSteps ?? fallback?.howToSteps ?? []) as HowToStep[];

  return { bodyContent, howToSteps };
}
