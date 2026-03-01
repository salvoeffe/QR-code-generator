import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const canonicalHost =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/^https?:\/\//, '').split('/')[0] ||
  'generatemyqrcode.com';

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const host = request.headers.get('host') ?? '';

  // Skip redirects on localhost so npm run dev works
  const isLocalhost =
    host.startsWith('localhost') || host.startsWith('127.0.0.1') || host === '[::1]';
  if (isLocalhost) {
    return NextResponse.next();
  }

  // Redirect HTTP to HTTPS
  if (request.headers.get('x-forwarded-proto') === 'http' || url.protocol === 'http:') {
    const httpsUrl = new URL(request.url);
    httpsUrl.protocol = 'https:';
    return NextResponse.redirect(httpsUrl, 301);
  }

  // Optional: redirect www to non-www when canonical host is non-www
  if (host.startsWith('www.')) {
    const nonWwwHost = host.replace(/^www\./, '');
    if (canonicalHost && nonWwwHost === canonicalHost) {
      const nonWww = new URL(request.url);
      nonWww.host = canonicalHost;
      return NextResponse.redirect(nonWww, 301);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
};
