import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CookieConsentBanner from "@/components/CookieConsent";
import AdSensePlaceholder from "@/components/AdSensePlaceholder";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://generatemyqrcode.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Free QR Code Generator No Sign Up | Create QR Codes Online",
    template: "%s | QR Code Generator",
  },
  description:
    "Create a free QR code with no sign up. Get a QR code for your website, link, or text in seconds. Download as PNG or SVG. No account, no expiration.",
  openGraph: {
    title: "Free QR Code Generator | No Sign Up | Create QR Codes Online",
    description: "Create a free QR code with no sign up. Get a QR code for your website, link, or text in seconds. Download as PNG or SVG. No account, no expiration.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Free QR Code Generator | No Sign Up | Create QR Codes Online",
    description: "Create a free QR code with no sign up. Get a QR code for your website, link, or text in seconds. Download as PNG or SVG. No account, no expiration.",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <CookieConsentBanner />
        <AdSensePlaceholder />
      </body>
    </html>
  );
}
