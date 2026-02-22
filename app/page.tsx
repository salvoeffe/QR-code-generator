import { getPosts } from '@/lib/posts';
import GeneratorPageContent from '@/components/GeneratorPageContent';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generatemyqrcode.com';

export const metadata = {
  title: {
    absolute: 'Free QR Code Generator — No Sign-Up, Instant Download',
  },
  alternates: {
    canonical: baseUrl,
  },
};

export default async function Home() {
  const allPosts = await getPosts();
  const latestPosts = allPosts.slice(0, 3);
  return <GeneratorPageContent latestPosts={latestPosts} />;
}
