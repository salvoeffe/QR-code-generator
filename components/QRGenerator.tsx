'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import QRCodeStyling from 'qr-code-styling';
import type { DotType } from 'qr-code-styling';

const DEBOUNCE_MS = 400;

export type DotStyle = 'square' | 'dots' | 'rounded';

function dotStyleToQrType(style: DotStyle): DotType {
  switch (style) {
    case 'dots': return 'dots';
    case 'rounded': return 'extra-rounded';
    default: return 'square';
  }
}

async function generateQrWithStyling(
  text: string,
  width: number,
  fg: string,
  bg: string,
  dotStyle: DotStyle,
  cornersMatchPixels: boolean,
  logo: string | null,
  logoPercent: number,
  format: 'png' | 'svg'
): Promise<Blob> {
  const dotType = dotStyleToQrType(dotStyle);
  const cornerType = cornersMatchPixels ? dotType : 'square';

  const qr = new QRCodeStyling({
    width,
    height: width,
    type: format === 'svg' ? 'svg' : 'canvas',
    data: text,
    margin: 8,
    qrOptions: { errorCorrectionLevel: logo ? 'H' : 'M' },
    dotsOptions: { color: fg, type: dotType },
    backgroundOptions: { color: bg },
    cornersSquareOptions: { type: cornerType },
    cornersDotOptions: { type: cornerType },
    ...(logo && {
      image: logo,
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: (logoPercent / 100) * 0.5,
        margin: 4,
      },
    }),
  });

  const data = await qr.getRawData(format);
  if (!data) throw new Error('Failed to generate QR code');
  return data instanceof Blob ? data : new Blob([data as unknown as BlobPart]);
}
const PREVIEW_MAX_SIZE = 512;
const SIZES = [256, 384, 512, 1024, 2048, 4096];

export type ContentType = 'url' | 'text' | 'wifi' | 'vcard' | 'whatsapp' | 'sms';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-+().]+$/;

function escapeVcf(val: string): string {
  return val.replace(/[\\;,]/g, '\\$&').replace(/\n/g, '\\n');
}

function buildVCardString(data: {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  company: string;
  website: string;
}): string {
  const { firstName, lastName, phone, email, company, website } = data;
  const fn = [firstName, lastName].filter(Boolean).join(' ').trim() || 'Contact';
  const n = escapeVcf(lastName) + ';' + escapeVcf(firstName) + ';;;';

  const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
  lines.push('N:' + n);
  lines.push('FN:' + escapeVcf(fn));
  if (phone.trim()) lines.push('TEL:' + phone.trim());
  if (email.trim()) lines.push('EMAIL:' + email.trim());
  if (company.trim()) lines.push('ORG:' + escapeVcf(company.trim()));
  if (website.trim()) {
    let url = website.trim();
    if (!url.startsWith('http://') && !url.startsWith('https://')) url = 'https://' + url;
    lines.push('URL:' + url);
  }
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

function buildWifiString(ssid: string, password: string, auth: 'WPA' | 'WEP' | 'nopass'): string {
  const s = ssid.trim();
  if (!s) return '';
  if (auth === 'nopass') return `WIFI:T:nopass;S:${s};;`;
  return `WIFI:T:${auth};S:${s};P:${password};;`;
}

function buildWhatsAppString(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return '';
  const base = `https://wa.me/${digits}`;
  return message.trim() ? `${base}?text=${encodeURIComponent(message.trim())}` : base;
}

function buildSmsString(phone: string, message: string): string {
  const number = phone.trim();
  if (!number) return '';
  return message.trim() ? `SMSTO:${number}:${message.trim()}` : `SMSTO:${number}:`;
}

type QRGeneratorProps = {
  initialContentType?: ContentType;
  onContentTypeChange?: (type: ContentType) => void;
};

export default function QRGenerator({ initialContentType = 'url', onContentTypeChange }: QRGeneratorProps) {
  const [contentType, setContentType] = useState<ContentType>(initialContentType);
  const [input, setInput] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [vcardFirstName, setVcardFirstName] = useState('');
  const [vcardLastName, setVcardLastName] = useState('');
  const [vcardPhone, setVcardPhone] = useState('');
  const [vcardEmail, setVcardEmail] = useState('');
  const [vcardCompany, setVcardCompany] = useState('');
  const [vcardWebsite, setVcardWebsite] = useState('');
  const [whatsappPhone, setWhatsappPhone] = useState('');
  const [whatsappMessage, setWhatsappMessage] = useState('');
  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [logoDataUrl, setLogoDataUrl] = useState<string | null>(null);
  const [logoSizePercent, setLogoSizePercent] = useState(20);
  const [dotStyle, setDotStyle] = useState<DotStyle>('square');
  const [cornersMatchPixels, setCornersMatchPixels] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const downloadSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveText = contentType === 'wifi'
    ? buildWifiString(wifiSsid, wifiPassword, wifiAuth)
    : contentType === 'vcard'
      ? buildVCardString({
          firstName: vcardFirstName,
          lastName: vcardLastName,
          phone: vcardPhone,
          email: vcardEmail,
          company: vcardCompany,
          website: vcardWebsite,
        })
      : contentType === 'whatsapp'
        ? buildWhatsAppString(whatsappPhone, whatsappMessage)
        : contentType === 'sms'
          ? buildSmsString(smsPhone, smsMessage)
          : input;

  const vcardHasAny = [vcardFirstName, vcardLastName, vcardPhone, vcardEmail, vcardCompany, vcardWebsite]
    .some((v) => v.trim() !== '');
  const hasContent = contentType === 'wifi'
    ? wifiSsid.trim() !== ''
    : contentType === 'vcard'
      ? vcardHasAny
      : contentType === 'whatsapp'
        ? whatsappPhone.replace(/\D/g, '').length > 0
        : contentType === 'sms'
          ? smsPhone.trim() !== ''
          : input.trim() !== '';

  const vcardEmailError = vcardEmail.trim() && !EMAIL_REGEX.test(vcardEmail) ? 'Invalid email format' : null;
  const vcardPhoneError = vcardPhone.trim() && !PHONE_REGEX.test(vcardPhone)
    ? 'Use digits, +, -, spaces, or parentheses'
    : null;

  const generateQr = useCallback(async (
    text: string,
    width: number,
    fg: string,
    bg: string,
    logo: string | null,
    logoPercent: number,
    dotStyleVal: DotStyle,
    cornersMatch: boolean
  ) => {
    if (!text.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    const previewSize = Math.min(width, PREVIEW_MAX_SIZE);

    try {
      const blob = await generateQrWithStyling(
        text,
        previewSize,
        fg,
        bg,
        dotStyleVal,
        cornersMatch,
        logo,
        logoPercent,
        'png'
      );

      const objectUrl = URL.createObjectURL(blob);
      setQrUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return objectUrl;
      });
    } catch (err) {
      setQrUrl(null);
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasContent || !effectiveText.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }

    const t = setTimeout(() => {
      generateQr(effectiveText, size, fgColor, bgColor, logoDataUrl, logoSizePercent, dotStyle, cornersMatchPixels);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [effectiveText, hasContent, size, fgColor, bgColor, logoDataUrl, logoSizePercent, dotStyle, cornersMatchPixels, generateQr]);

  const [downloadingPng, setDownloadingPng] = useState(false);

  const handleDownloadPng = useCallback(async () => {
    if (!qrUrl && !hasContent) return;
    if (downloadSuccessTimerRef.current) clearTimeout(downloadSuccessTimerRef.current);

    const downloadAtSize = async (targetSize: number) => {
      const blob = await generateQrWithStyling(
        effectiveText,
        targetSize,
        fgColor,
        bgColor,
        dotStyle,
        cornersMatchPixels,
        logoDataUrl,
        logoSizePercent,
        'png'
      );
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'qrcode.png';
      a.click();
      URL.revokeObjectURL(blobUrl);
    };

    if (size <= PREVIEW_MAX_SIZE) {
      if (!qrUrl) return;
      const a = document.createElement('a');
      a.href = qrUrl;
      a.download = 'qrcode.png';
      a.click();
    } else {
      if (!hasContent || !effectiveText.trim()) return;
      setDownloadingPng(true);
      try {
        await downloadAtSize(size);
      } catch {
        setError('Could not download PNG');
      } finally {
        setDownloadingPng(false);
      }
    }

    setJustDownloaded(true);
    downloadSuccessTimerRef.current = setTimeout(() => setJustDownloaded(false), 2500);
  }, [qrUrl, hasContent, effectiveText, size, fgColor, bgColor, logoDataUrl, logoSizePercent, dotStyle, cornersMatchPixels]);

  const handleDownloadSvg = useCallback(async () => {
    if (!hasContent || !effectiveText.trim()) return;
    try {
      const blob = await generateQrWithStyling(
        effectiveText,
        size,
        fgColor,
        bgColor,
        dotStyle,
        cornersMatchPixels,
        logoDataUrl,
        logoSizePercent,
        'svg'
      );
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'qrcode.svg';
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError('Could not download SVG');
    }
  }, [effectiveText, hasContent, size, fgColor, bgColor, logoDataUrl, logoSizePercent, dotStyle, cornersMatchPixels]);

  const handleLogoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please choose a PNG or JPG image');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setLogoDataUrl(dataUrl);
      setError(null);
    };
    reader.onerror = () => setError('Could not read file');
    reader.readAsDataURL(file);
  }, []);

  const handleRemoveLogo = useCallback(() => {
    setLogoDataUrl(null);
    setError(null);
  }, []);

  useEffect(() => {
    return () => {
      if (downloadSuccessTimerRef.current) clearTimeout(downloadSuccessTimerRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-8 md:items-start space-y-6 md:space-y-0">
      <div className="space-y-6 md:pr-4">
        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            1. Enter URL or text
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {(['url', 'text', 'wifi', 'vcard', 'whatsapp', 'sms'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setContentType(mode);
                  onContentTypeChange?.(mode);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] sm:min-h-0 active:scale-[0.98] ${
                  contentType === mode
                    ? 'bg-emerald-600 text-white shadow-[var(--shadow-sm)]'
                    : 'bg-[var(--surface)] dark:bg-[var(--surface)] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-[var(--shadow-sm)] border border-zinc-200/80 dark:border-zinc-600/80'
                }`}
              >
                {mode === 'url' ? 'URL' : mode === 'text' ? 'Plain text' : mode === 'wifi' ? 'Wi-Fi' : mode === 'vcard' ? 'vCard' : mode === 'whatsapp' ? 'WhatsApp' : 'SMS'}
              </button>
            ))}
          </div>
          {contentType === 'vcard' ? (
            <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 p-4 shadow-[var(--shadow-sm)]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="vcard-first" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">First name</label>
                  <input
                    id="vcard-first"
                    type="text"
                    value={vcardFirstName}
                    onChange={(e) => setVcardFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="vcard-last" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Last name</label>
                  <input
                    id="vcard-last"
                    type="text"
                    value={vcardLastName}
                    onChange={(e) => setVcardLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="vcard-phone" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Phone</label>
                <input
                  id="vcard-phone"
                  type="tel"
                  value={vcardPhone}
                  onChange={(e) => setVcardPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className={`w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                    vcardPhoneError ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {vcardPhoneError && <p className="text-xs text-red-500 mt-1">{vcardPhoneError}</p>}
              </div>
              <div>
                <label htmlFor="vcard-email" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Email</label>
                <input
                  id="vcard-email"
                  type="email"
                  value={vcardEmail}
                  onChange={(e) => setVcardEmail(e.target.value)}
                  placeholder="john@example.com"
                  className={`w-full px-3 py-2.5 rounded-lg border bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm ${
                    vcardEmailError ? 'border-red-500 dark:border-red-500' : 'border-zinc-200 dark:border-zinc-700'
                  }`}
                />
                {vcardEmailError && <p className="text-xs text-red-500 mt-1">{vcardEmailError}</p>}
              </div>
              <div>
                <label htmlFor="vcard-company" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Company</label>
                <input
                  id="vcard-company"
                  type="text"
                  value={vcardCompany}
                  onChange={(e) => setVcardCompany(e.target.value)}
                  placeholder="Acme Inc."
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="vcard-website" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Website</label>
                <input
                  id="vcard-website"
                  type="url"
                  value={vcardWebsite}
                  onChange={(e) => setVcardWebsite(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">Scan to save contact on iPhone or Android.</p>
            </div>
          ) : contentType === 'whatsapp' ? (
            <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 p-4 shadow-[var(--shadow-sm)]">
              <div>
                <label htmlFor="whatsapp-phone" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Phone number (with country code)</label>
                <input
                  id="whatsapp-phone"
                  type="tel"
                  value={whatsappPhone}
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="whatsapp-message" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Default message</label>
                <input
                  id="whatsapp-message"
                  type="text"
                  value={whatsappMessage}
                  onChange={(e) => setWhatsappMessage(e.target.value)}
                  placeholder="Hello! I found this from your QR code."
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">Scan to open WhatsApp chat with pre-filled message.</p>
            </div>
          ) : contentType === 'sms' ? (
            <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 p-4 shadow-[var(--shadow-sm)]">
              <div>
                <label htmlFor="sms-phone" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Phone number</label>
                <input
                  id="sms-phone"
                  type="tel"
                  value={smsPhone}
                  onChange={(e) => setSmsPhone(e.target.value)}
                  placeholder="+1 234 567 8900"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="sms-message" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Message</label>
                <input
                  id="sms-message"
                  type="text"
                  value={smsMessage}
                  onChange={(e) => setSmsMessage(e.target.value)}
                  placeholder="Your text message here"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500">Scan to open SMS app with number and message pre-filled.</p>
            </div>
          ) : contentType !== 'wifi' ? (
            <input
              id="qr-input"
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={contentType === 'url' ? 'https://example.com' : 'Any text message'}
              className="w-full px-4 py-3.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-[var(--shadow-sm)]"
              autoFocus
            />
          ) : (
            <div className="space-y-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-100/80 dark:bg-zinc-800/80 p-4 shadow-[var(--shadow-sm)]">
              <div>
                <label htmlFor="wifi-ssid" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Network name (SSID)</label>
                <input
                  id="wifi-ssid"
                  type="text"
                  value={wifiSsid}
                  onChange={(e) => setWifiSsid(e.target.value)}
                  placeholder="My Network"
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
              </div>
              <div>
                <label htmlFor="wifi-auth" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Security</label>
                <select
                  id="wifi-auth"
                  value={wifiAuth}
                  onChange={(e) => setWifiAuth(e.target.value as 'WPA' | 'WEP' | 'nopass')}
                  className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="WPA">WPA/WPA2</option>
                  <option value="WEP">WEP</option>
                  <option value="nopass">None (open)</option>
                </select>
              </div>
              {wifiAuth !== 'nopass' && (
                <div>
                  <label htmlFor="wifi-password" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Password</label>
                  <input
                    id="wifi-password"
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Network password"
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900/80 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">2. Choose size</label>
          <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => {
            const tooltip =
              s === 2048 ? 'Recommended for posters and flyers.' : s === 4096 ? 'Best for billboards and large-scale printing.' : null;
            return (
              <div key={s} className="group/tooltip relative">
                <button
                  type="button"
                  onClick={() => setSize(s)}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] sm:min-h-0 active:scale-[0.98] ${
                    size === s
                      ? 'bg-emerald-600 text-white shadow-[var(--shadow-sm)]'
                      : 'bg-[var(--surface)] dark:bg-[var(--surface)] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-[var(--shadow-sm)] border border-zinc-200/80 dark:border-zinc-600/80'
                  }`}
                >
                  <span>{s === 1024 ? '1024px' : `${s}px`}</span>
                  {s === 2048 && <span className="text-[10px] opacity-90 font-normal">(Pro print)</span>}
                  {s === 4096 && <span className="text-[10px] opacity-90 font-normal">(Ultra-HD)</span>}
                </button>
                {tooltip && (
                  <span
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1.5 text-xs text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-sm opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap z-10"
                    role="tooltip"
                  >
                    {tooltip}
                  </span>
                )}
              </div>
            );
          })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            3. Add logo (optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg"
            onChange={handleLogoSelect}
            className="sr-only"
            aria-label="Upload logo image"
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload
            </button>
            {logoDataUrl && (
              <button
                type="button"
                onClick={handleRemoveLogo}
                className="px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Remove logo
              </button>
            )}
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">PNG or JPG. Adjust logo size in Settings.</p>
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
            aria-expanded={settingsOpen}
          >
            <svg
              className={`w-4 h-4 transition-transform ${settingsOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Settings
          </button>
          {settingsOpen && (
            <div className="mt-3 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50/50 dark:bg-zinc-800/30 space-y-4">
              <div>
                <label htmlFor="qr-fg" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">QR code color</label>
                <div className="flex items-center gap-3">
                  <input
                    id="qr-fg"
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-24 px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              {logoDataUrl && (
                <div>
                  <label htmlFor="logo-size" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">
                    Logo size
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      id="logo-size"
                      type="range"
                      min={10}
                      max={50}
                      step={1}
                      value={logoSizePercent}
                      onChange={(e) => setLogoSizePercent(Number(e.target.value))}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-600 accent-emerald-600"
                    />
                    <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 min-w-[2.5rem] tabular-nums">
                      {logoSizePercent}%
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                    Note: Larger logos (over 30%) may make the code harder to scan. Always test before printing.
                  </p>
                </div>
              )}
              <div>
                <label htmlFor="qr-bg" className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Background color</label>
                <div className="flex items-center gap-3">
                  <input
                    id="qr-bg"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="h-9 w-14 cursor-pointer rounded border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-900"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-24 px-2 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm font-mono text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
              <div>
                <p className="block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">QR Style</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(['square', 'dots', 'rounded'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDotStyle(s)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        dotStyle === s
                          ? 'bg-emerald-600 text-white shadow-[var(--shadow-sm)]'
                          : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-600'
                      }`}
                    >
                      {s === 'square' ? 'Square (Default)' : s === 'dots' ? 'Dots' : 'Rounded'}
                    </button>
                  ))}
                </div>
                <label className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={cornersMatchPixels}
                    onChange={(e) => setCornersMatchPixels(e.target.checked)}
                    className="rounded border-zinc-300 dark:border-zinc-600 text-emerald-600 focus:ring-emerald-500"
                  />
                  Match corner eyes to pixel style
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">4. Download</p>
        <div className="min-h-[200px] sm:min-h-[260px] md:min-h-[280px] md:sticky md:top-24 flex flex-col rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-md)] border border-zinc-200/60 dark:border-zinc-700/60 overflow-hidden transition-shadow duration-200">
        <div className="px-5 py-3 border-b border-zinc-200/60 dark:border-zinc-700/60 bg-zinc-50/50 dark:bg-zinc-800/30">
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Preview</h3>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center p-6">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <img
              src="/favicon.ico"
              alt=""
              className="h-12 w-12 animate-pulse"
            />
            <span className="text-sm">Generating…</span>
          </div>
        )}

        {error && !loading && (
          <p className="text-red-600 dark:text-red-400 text-sm text-center">{error}</p>
        )}

        {qrUrl && !loading && (
          <div className="flex flex-col items-center gap-5 qr-result-animate">
            <img
              src={qrUrl}
              alt="Generated QR code"
              className="max-w-full h-auto rounded-xl shadow-[var(--shadow-md)]"
              width={Math.min(size, PREVIEW_MAX_SIZE)}
              height={Math.min(size, PREVIEW_MAX_SIZE)}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
              Scan with your phone to test. <a href="/faq#why-not-scanning" className="text-emerald-600 hover:underline">Not scanning?</a>
            </p>
            {size > PREVIEW_MAX_SIZE && (
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                Preview scaled. Download at full {size}px.
              </p>
            )}
            <div className="flex flex-col items-center gap-3">
              {justDownloaded && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Success!
                </p>
              )}
              <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={justDownloaded || downloadingPng}
                  className={`px-5 py-2.5 min-h-[44px] rounded-xl text-white font-medium transition-all duration-200 shadow-[var(--shadow-sm)] ${
                    justDownloaded || downloadingPng
                      ? 'bg-emerald-500 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                  }`}
                >
                  {justDownloaded ? 'Downloaded!' : downloadingPng ? 'Preparing…' : 'PNG'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-[0.98]"
                >
                  SVG
                </button>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
                PNG for screens · SVG for print
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 mt-2 pt-4 border-t border-zinc-200/60 dark:border-zinc-700/60 w-full max-w-xs">
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  100% Privacy: Your data never leaves your browser
                </span>
                <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
                  No Expiration: Codes work forever
                </span>
              </div>
            </div>
          </div>
        )}

        {!qrUrl && !loading && !error && !hasContent && (
          <div className="flex flex-col items-center gap-4">
            <img
              src="/favicon.ico"
              alt=""
              className="h-16 w-16 opacity-30 dark:opacity-25"
            />
            <p className="text-zinc-400 dark:text-zinc-500 text-sm text-center">
              Enter a URL or text above to generate your free QR code
            </p>
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}
