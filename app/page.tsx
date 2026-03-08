import { getPosts } from '@/lib/posts';
import GeneratorPageContent from '@/components/GeneratorPageContent';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generatemyqrcode.com';

export const metadata = {
  title: {
    absolute: 'Free QR Code Generator No Sign Up — Get a QR Code for Your Website',
  },
  description:
    'Create a free QR code with no sign up. Get a QR code for your website, link, or text in seconds. Download as PNG or SVG. No account, no expiration.',
  alternates: {
    canonical: baseUrl,
  },
};

export default async function Home() {
  const allPosts = await getPosts();
  const latestPosts = allPosts.slice(0, 3);
  return <GeneratorPageContent latestPosts={latestPosts} />;
}
