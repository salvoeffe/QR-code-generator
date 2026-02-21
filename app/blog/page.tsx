import { getFeaturedPost, getPosts, getPostsByCategory } from '@/lib/posts';
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

  const postsByCategoryObj = Object.fromEntries(postsByCategory);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <BlogIndexContent
          posts={posts}
          featuredPost={featuredPost}
          postsByCategory={postsByCategoryObj}
        />
      </main>
    </div>
  );
}
