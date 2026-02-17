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
