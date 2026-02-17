'use client';

import { useState, useCallback, useEffect } from 'react';

const DEBOUNCE_MS = 400;
const SIZES = [256, 384, 512];

export default function QRGenerator() {
  const [input, setInput] = useState('');
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [size, setSize] = useState(256);

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
    if (!input.trim()) {
      setQrUrl(null);
      setError(null);
      return;
    }

    const t = setTimeout(() => {
      generateQr(input, size);
    }, DEBOUNCE_MS);

    return () => clearTimeout(t);
  }, [input, size, generateQr]);

  const handleDownload = useCallback(() => {
    if (!qrUrl) return;
    const a = document.createElement('a');
    a.href = qrUrl;
    a.download = 'qrcode.png';
    a.click();
  }, [qrUrl]);

  return (
    <div className="w-full max-w-lg mx-auto space-y-6">
      <div>
        <label htmlFor="qr-input" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
          Enter URL or text
        </label>
        <input
          id="qr-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com or any text"
          className="w-full px-4 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Size</label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 active:scale-[0.98] ${
                size === s
                  ? 'bg-emerald-600 text-white'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
            >
              {s}px
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[200px] sm:min-h-[260px] flex flex-col items-center justify-center rounded-2xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 transition-shadow duration-200 hover:shadow-md">
        {loading && (
          <div className="flex flex-col items-center gap-3 text-zinc-500">
            <img
              src="/icon.png"
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
              className="max-w-full h-auto rounded-xl shadow-md"
              width={size}
              height={size}
            />
            <button
              type="button"
              onClick={handleDownload}
              className="px-6 py-2.5 min-h-[44px] rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-medium transition-all duration-200 shadow-sm hover:shadow"
            >
              Download PNG
            </button>
          </div>
        )}

        {!qrUrl && !loading && !error && input.trim() === '' && (
          <div className="flex flex-col items-center gap-4">
            <img
              src="/icon.png"
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
  );
}
