'use client';

import CookieConsent from 'react-cookie-consent';
import Link from 'next/link';

export default function CookieConsentBanner() {
  return (
    <CookieConsent
      location="bottom"
      buttonText="Accept"
      declineButtonText="Decline"
      enableDeclineButton
      cookieName="qr-code-generator-cookie-consent"
      style={{
        background: 'rgba(24, 24, 27, 0.95)',
        alignItems: 'center',
        padding: '1rem 1.5rem',
      }}
      buttonStyle={{
        background: '#059669',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '0.5rem',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#a1a1aa',
        border: '1px solid #52525b',
      }}
      expires={365}
    >
      We use cookies for functionality and, with your consent, for advertising. See our{' '}
      <Link href="/privacy" className="underline hover:text-white">
        Privacy Policy
      </Link>
      .
    </CookieConsent>
  );
}
