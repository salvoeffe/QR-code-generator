'use client';

/**
 * Ad unit placeholder for Google AdSense. Add NEXT_PUBLIC_ADSENSE_CLIENT_ID and
 * create ad units in AdSense dashboard, then set the data-ad-slot prop.
 * This component only renders when cookies are accepted (parent should ensure).
 */
type AdUnitProps = {
  slot?: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
};

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  if (!clientId || !slot) {
    return null;
  }

  return (
    <div className={`min-h-[100px] flex items-center justify-center bg-zinc-100 dark:bg-zinc-800/50 rounded-lg ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientId}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
