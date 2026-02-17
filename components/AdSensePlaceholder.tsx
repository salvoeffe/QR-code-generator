'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

const CONSENT_COOKIE = 'qr-code-generator-cookie-consent';

function hasConsent(): boolean {
  if (typeof document === 'undefined') return false;
  const match = document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]+)`));
  return match?.[1] === 'true';
}

/**
 * AdSense script. Loads only when:
 * 1. NEXT_PUBLIC_ADSENSE_CLIENT_ID is set (after AdSense approval)
 * 2. User has accepted cookies (consent cookie present)
 */
export default function AdSensePlaceholder() {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const [canLoad, setCanLoad] = useState(false);

  useEffect(() => {
    if (!clientId) return;
    setCanLoad(hasConsent());
    const interval = setInterval(() => {
      if (hasConsent()) {
        setCanLoad(true);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [clientId]);

  if (!clientId || !canLoad) {
    return null;
  }

  return (
    <Script
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
