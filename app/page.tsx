import { getPosts } from '@/lib/posts';
import GeneratorPageContent from '@/components/GeneratorPageContent';

export const metadata = {
  title: {
    absolute: 'Free QR Code Generator — No Sign-Up, Instant Download',
  },
};

export default async function Home() {
  const allPosts = await getPosts();
  const latestPosts = allPosts.slice(0, 3);
  return <GeneratorPageContent latestPosts={latestPosts} />;
}
