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
  const [justDownloaded, setJustDownloaded] = useState(false);
  const downloadSuccessTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const effectiveText = contentType === 'wifi'
    ? buildWifiString(wifiSsid, wifiPassword, wifiAuth)
    : input;
  const hasContent = contentType === 'wifi' ? wifiSsid.trim() !== '' : input.trim() !== '';

  const generateQr = useCallback(async (text: string, width: number) => {
    if (!text.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/qr?text=${encodeURIComponent(text)}&size=${width}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate QR code');
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      setQrUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
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
      generateQr(effectiveText, size);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [effectiveText, hasContent, size, generateQr]);

  const handleDownload = useCallback(() => {
    if (!qrUrl) return;
    if (downloadSuccessTimerRef.current) clearTimeout(downloadSuccessTimerRef.current);
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qrcode.png';
    a.click();
    setJustDownloaded(true);
    downloadSuccessTimerRef.current = setTimeout(() => setJustDownloaded(false), 2500);
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
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">3. Download</p>
        <div className="min-h-[200px] sm:min-h-[260px] md:min-h-[280px] md:sticky md:top-24 flex flex-col items-center justify-center rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-md)] border border-zinc-200/60 dark:border-zinc-700/60 p-6 transition-shadow duration-200">
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
            <div className="flex flex-col items-center gap-2">
              {justDownloaded && (
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                  Success!
                </p>
              )}
              <button
                type="button"
                onClick={handleDownload}
                disabled={justDownloaded}
                className={`px-6 py-2.5 min-h-[44px] rounded-xl text-white font-medium transition-all duration-200 shadow-[var(--shadow-sm)] ${
                  justDownloaded
                    ? 'bg-emerald-500 cursor-default'
                    : 'bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98]'
                }`}
              >
                {justDownloaded ? 'Downloaded!' : 'Download PNG'}
              </button>
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
  );
}
