# QR Code Generator - Web Tool

Free, simple QR code generator with blog and AdSense-ready structure.

## Features

- **QR Code Generator** — Enter URL or text, get PNG instantly
- **Blog** — SEO-friendly articles on QR code best practices
- **Legal pages** — Privacy Policy, Terms of Service, About
- **Cookie consent** — GDPR-friendly banner
- **AdSense-ready** — Structure in place for post-approval integration

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub
2. In Vercel, **Add New Project** → import the repo
3. Set **Root Directory** to `web`
4. Add environment variables (see `.env.example`)
5. Deploy

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SITE_URL` | Base URL (e.g. `https://yoursite.com`) |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | AdSense client ID (after approval) |
| `NEXT_PUBLIC_ADSENSE_SLOT` | Ad unit slot ID (after approval) |

## Request indexing (Google Search Console)

To help new or updated pages get recrawled and improve impressions:

1. Open [Google Search Console](https://search.google.com/search-console) and select the property.
2. Use **URL Inspection** (top search bar).
3. Enter each URL and click **Request indexing** for:
   - Homepage: `https://generatemyqrcode.com/`
   - Solution pages: `/vcard-qr-generator`, `/whatsapp-qr-generator`, `/wifi-qr-generator`, `/sms-qr-generator`
   - Top blog posts that match your target queries (e.g. business card, website QR, security, restaurant QR).
4. Repeat after major content or schema updates.

## Core Web Vitals

The app uses `min-height` on ad placeholders to reduce layout shift (CLS). For ongoing checks, run [PageSpeed Insights](https://pagespeed.web.dev/) or Lighthouse on the homepage and key pages after deployment.
