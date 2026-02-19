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
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        alignItems: 'center',
        padding: '1rem 1.25rem 1.25rem',
        borderRadius: '1rem 1rem 0 0',
        boxShadow: 'var(--shadow-lg)',
        borderTop: '1px solid rgba(63, 63, 70, 0.5)',
      }}
      buttonStyle={{
        background: '#059669',
        color: '#fff',
        padding: '0.5rem 1rem',
        borderRadius: '0.75rem',
        border: 'none',
        boxShadow: 'var(--shadow-sm)',
        fontWeight: 500,
        transition: 'background 0.2s',
      }}
      declineButtonStyle={{
        background: 'transparent',
        color: '#a1a1aa',
        border: '1px solid rgba(82, 82, 91, 0.8)',
        borderRadius: '0.75rem',
        padding: '0.5rem 1rem',
        fontWeight: 500,
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
