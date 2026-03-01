import { getFeaturedPost, getPosts, getPostsByCategory, readPostContent } from '@/lib/posts';
import { getReadingTimeMinutes } from '@/lib/reading-time';
import Header from '@/components/Header';
import BlogIndexContent from '@/components/BlogIndexContent';

export const metadata = {
  title: 'Blog | QR Code Generator',
  description: 'Tips, guides, and best practices for QR codes. Learn how to create and use QR codes effectively.',
};

export default async function BlogPage() {
  const [posts, featuredPost, postsByCategory] = await Promise.all([
    getPosts(),
    getFeaturedPost(),
    getPostsByCategory(),
  ]);

  const postsWithReadingTime = await Promise.all(
    posts.map(async (p) => {
      try {
        const content = await readPostContent(p.slug);
        return { ...p, readingTimeMinutes: getReadingTimeMinutes(content) };
      } catch {
        return { ...p, readingTimeMinutes: 1 };
      }
    })
  );

  const postsByCategoryObj = Object.fromEntries(postsByCategory);
  const featuredWithReading = featuredPost
    ? { ...featuredPost, readingTimeMinutes: postsWithReadingTime.find((p) => p.slug === featuredPost.slug)?.readingTimeMinutes ?? 1 }
    : undefined;

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <BlogIndexContent
          posts={postsWithReadingTime}
          featuredPost={featuredWithReading}
          postsByCategory={postsByCategoryObj}
        />
      </main>
    </div>
  );
}
