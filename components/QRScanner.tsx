'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import jsQR from 'jsqr';

const ACCEPTED_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];

function isUrl(text: string): boolean {
  return text.startsWith('http://') || text.startsWith('https://');
}

function decodeFromCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): string | null {
  const imageData = ctx.getImageData(0, 0, width, height);
  const code = jsQR(imageData.data, width, height, { inversionAttempts: 'attemptBoth' });
  return code?.data ?? null;
}

export default function QRScanner() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setCameraActive(false);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, []);

  useEffect(() => {
    return () => stopCamera();
  }, [stopCamera]);

  const tryDecodeFromFile = useCallback((file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        resolve(null);
        return;
      }
      const url = URL.createObjectURL(file);
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = canvasRef.current;
        if (!canvas) {
          resolve(null);
          return;
        }
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(null);
          return;
        }
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img, 0, 0);
        const decoded = decodeFromCanvas(ctx, canvas.width, canvas.height);
        resolve(decoded);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(null);
      };
      img.src = url;
    });
  }, []);

  const handleFile = useCallback(
    async (file: File | null) => {
      if (!file) return;
      setError(null);
      setResult(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError('Please use PNG, JPG, or SVG files.');
        return;
      }
      const decoded = await tryDecodeFromFile(file);
      if (decoded) {
        setResult(decoded);
      } else {
        setError('No QR code found in this image.');
      }
    },
    [tryDecodeFromFile]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      e.target.value = '';
      handleFile(file ?? null);
    },
    [handleFile]
  );

  const handleCamera = useCallback(async () => {
    if (cameraActive) {
      stopCamera();
      return;
    }
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) return;
      video.srcObject = stream;
      await video.play();
      setCameraActive(true);

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const tick = () => {
        if (!streamRef.current || !videoRef.current || !ctx) return;
        if (video.readyState !== video.HAVE_ENOUGH_DATA) {
          rafRef.current = requestAnimationFrame(tick);
          return;
        }
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0);
        const decoded = decodeFromCanvas(ctx, canvas.width, canvas.height);
        if (decoded) {
          setResult(decoded);
          stopCamera();
          return;
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError('Camera access denied or not available.');
    }
  }, [cameraActive, stopCamera]);

  const handleCopy = useCallback(async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError('Could not copy to clipboard.');
    }
  }, [result]);

  const handleVisit = useCallback(() => {
    if (result && isUrl(result)) {
      window.open(result, '_blank', 'noopener,noreferrer');
    }
  }, [result]);

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      <canvas ref={canvasRef} className="hidden" aria-hidden />
      <video ref={videoRef} className="hidden" playsInline muted aria-hidden />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragging
            ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30'
            : 'border-zinc-300 dark:border-zinc-600 bg-[var(--surface-elevated)] hover:border-zinc-400 dark:hover:border-zinc-500'
        } shadow-[var(--shadow-sm)]`}
      >
        <label className="cursor-pointer block">
          <span className="block text-zinc-600 dark:text-zinc-400 mb-2">
            Drag and drop an image, or click to choose
          </span>
          <span className="text-sm text-zinc-500 dark:text-zinc-500">
            PNG, JPG, or SVG
          </span>
          <input
            type="file"
            accept={ACCEPTED_TYPES.join(',')}
            onChange={handleFileInputChange}
            className="sr-only"
          />
        </label>
      </div>

      <div className="flex justify-center">
        <button
          type="button"
          onClick={handleCamera}
          className={`min-h-[44px] px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 active:scale-[0.98] ${
            cameraActive
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[var(--shadow-sm)]'
          }`}
        >
          {cameraActive ? 'Stop camera' : 'Scan with Camera'}
        </button>
      </div>

      {cameraActive && (
        <p className="text-center text-sm text-zinc-500 dark:text-zinc-500">
          Point your camera at a QR code. Scanning automatically.
        </p>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/80 dark:bg-red-950/30 p-4 text-sm text-red-700 dark:text-red-300"
        >
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-2xl bg-[var(--surface-elevated)] border border-zinc-200/60 dark:border-zinc-700/50 p-5 sm:p-6 shadow-[var(--shadow-sm)]">
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
            Decoded content
          </p>
          <pre className="break-all text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-100/80 dark:bg-zinc-800/80 rounded-lg p-3 mb-4 overflow-x-auto">
            {result}
          </pre>
          <div className="flex flex-wrap gap-2">
            {isUrl(result) ? (
              <button
                type="button"
                onClick={handleVisit}
                className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                Visit Website
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCopy}
                className="min-h-[44px] px-4 py-2 rounded-lg text-sm font-medium bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 text-zinc-900 dark:text-zinc-100 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
