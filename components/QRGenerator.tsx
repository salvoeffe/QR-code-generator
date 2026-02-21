'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const DEBOUNCE_MS = 400;
const SIZES = [256, 384, 512, 1024];

type ContentType = 'url' | 'text' | 'wifi';

function buildWifiString(ssid: string, password: string, auth: 'WPA' | 'WEP' | 'nopass'): string {
  const s = ssid.trim();
  if (!s) return '';
  if (auth === 'nopass') return `WIFI:T:nopass;S:${s};;`;
  return `WIFI:T:${auth};S:${s};P:${password};;`;
}

function buildQrUrl(text: string, width: number, fg: string, bg: string, format: 'png' | 'svg'): string {
  const params = new URLSearchParams({
    text,
    size: String(width),
    fg: fg.replace(/^#/, ''),
    bg: bg.replace(/^#/, ''),
  });
  if (format === 'svg') params.set('format', 'svg');
  return `/api/qr?${params.toString()}`;
}

export default function QRGenerator() {
  const [contentType, setContentType] = useState<ContentType>('url');
  const [input, setInput] = useState('');
  const [wifiSsid, setWifiSsid] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiAuth, setWifiAuth] = useState<'WPA' | 'WEP' | 'nopass'>('WPA');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [justDownloaded, setJustDownloaded] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const downloadSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveText = contentType === 'wifi'
    ? buildWifiString(wifiSsid, wifiPassword, wifiAuth)
    : input;
  const hasContent = contentType === 'wifi' ? wifiSsid.trim() !== '' : input.trim() !== '';

  const generateQr = useCallback(async (text: string, width: number, fg: string, bg: string) => {
    if (!text.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = buildQrUrl(text, width, fg, bg, 'png');
      const res = await fetch(url);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate QR code');
      }
      const blob = await res.blob();
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
      generateQr(effectiveText, size, fgColor, bgColor);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [effectiveText, hasContent, size, fgColor, bgColor, generateQr]);

  const handleDownloadPng = useCallback(() => {
    if (!qrUrl) return;
    if (downloadSuccessTimerRef.current) clearTimeout(downloadSuccessTimerRef.current);
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qrcode.png';
    a.click();
    setJustDownloaded(true);
    downloadSuccessTimerRef.current = setTimeout(() => setJustDownloaded(false), 2500);
  }, [qrUrl]);

  const handleDownloadSvg = useCallback(async () => {
    if (!hasContent || !effectiveText.trim()) return;
    try {
      const url = buildQrUrl(effectiveText, size, fgColor, bgColor, 'svg');
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to generate SVG');
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = 'qrcode.svg';
      a.click();
      URL.revokeObjectURL(blobUrl);
    } catch {
      setError('Could not download SVG');
    }
  }, [effectiveText, hasContent, size, fgColor, bgColor]);

  const handleCopyToClipboard = useCallback(async () => {
    if (!qrUrl) return;
    try {
      const res = await fetch(qrUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setJustCopied(true);
      setTimeout(() => setJustCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard');
    }
  }, [qrUrl]);

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
            {(['url', 'text', 'wifi'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setContentType(mode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] sm:min-h-0 active:scale-[0.98] ${
                  contentType === mode
                    ? 'bg-emerald-600 text-white shadow-[var(--shadow-sm)]'
                    : 'bg-[var(--surface)] dark:bg-[var(--surface)] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-[var(--shadow-sm)] border border-zinc-200/80 dark:border-zinc-600/80'
                }`}
              >
                {mode === 'url' ? 'URL' : mode === 'text' ? 'Plain text' : 'Wi-Fi'}
              </button>
            ))}
          </div>
          {contentType !== 'wifi' ? (
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
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 active:scale-[0.98] ${
                size === s
                  ? 'bg-emerald-600 text-white shadow-[var(--shadow-sm)]'
                  : 'bg-[var(--surface)] dark:bg-[var(--surface)] text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 shadow-[var(--shadow-sm)] border border-zinc-200/80 dark:border-zinc-600/80'
              }`}
            >
              {s === 1024 ? '1024px (print)' : `${s}px`}
            </button>
          ))}
          </div>
        </div>

        <div>
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
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">3. Download</p>
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
              width={size}
              height={size}
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-500 text-center">
              Scan with your phone to test. <a href="/faq#why-not-scanning" className="text-emerald-600 hover:underline">Not scanning?</a>
            </p>
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
                  disabled={justDownloaded}
                  className={`px-5 py-2.5 min-h-[44px] rounded-xl text-white font-medium transition-all duration-200 shadow-[var(--shadow-sm)] ${
                    justDownloaded
                      ? 'bg-emerald-500 cursor-default'
                      : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                  }`}
                >
                  {justDownloaded ? 'Downloaded!' : 'PNG'}
                </button>
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-[0.98]"
                >
                  SVG
                </button>
                <button
                  type="button"
                  onClick={handleCopyToClipboard}
                  disabled={!qrUrl || justCopied}
                  className="px-5 py-2.5 min-h-[44px] rounded-xl border border-zinc-200 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white dark:disabled:hover:bg-zinc-800"
                >
                  {justCopied ? 'Copied!' : 'Copy'}
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
