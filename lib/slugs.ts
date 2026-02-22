export type SlugContentType = 'vcard' | 'whatsapp' | 'wifi' | 'sms';

export type SlugConfig = {
  contentType: SlugContentType;
  title: string;
  subtitle: string;
  description: string;
  metadataTitle: string;
};

export const SLUG_TO_CONFIG: Record<string, SlugConfig> = {
  'vcard-qr-generator': {
    contentType: 'vcard',
    title: 'Free vCard QR Code Generator',
    subtitle: 'No sign-up. No expiration. Instant download.',
    description: 'Create "Scan to Save Contact" QR codes for iPhone and Android.',
    metadataTitle: 'Free vCard QR Code Generator — Scan to Save Contact',
  },
  'whatsapp-qr-generator': {
    contentType: 'whatsapp',
    title: 'Free WhatsApp QR Code Generator',
    subtitle: 'No sign-up. No expiration. Instant download.',
    description: 'Create QR codes that open WhatsApp with a pre-filled message.',
    metadataTitle: 'Free WhatsApp QR Code Generator — Instant Link',
  },
  'wifi-qr-generator': {
    contentType: 'wifi',
    title: 'Free Wi-Fi QR Code Generator',
    subtitle: 'No sign-up. No expiration. Instant download.',
    description: 'Let guests connect to your Wi-Fi with one scan.',
    metadataTitle: 'Free Wi-Fi QR Code Generator — One-Scan Connect',
  },
  'sms-qr-generator': {
    contentType: 'sms',
    title: 'Free SMS QR Code Generator',
    subtitle: 'No sign-up. No expiration. Instant download.',
    description: 'Create QR codes that open the SMS app with number and message pre-filled.',
    metadataTitle: 'Free SMS QR Code Generator — Pre-filled Messages',
  },
};

export function getSlugConfig(slug: string): SlugConfig | null {
  return SLUG_TO_CONFIG[slug] ?? null;
}
