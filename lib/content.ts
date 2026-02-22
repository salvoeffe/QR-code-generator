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
};

const data = contentData as Record<string, PageContent>;

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
  return data[slug] ?? null;
}

export function getContentByType(
  contentType: ContentType
): { bodyContent: BodySection[]; howToSteps: HowToStep[] } {
  const slug = CONTENT_TYPE_TO_SLUG[contentType];
  const entry = data[slug];
  const fallback = data['url'];

  const bodyContent = (entry?.bodyContent ?? fallback?.bodyContent ?? []) as BodySection[];
  const howToSteps = (entry?.howToSteps ?? fallback?.howToSteps ?? []) as HowToStep[];

  return { bodyContent, howToSteps };
}
