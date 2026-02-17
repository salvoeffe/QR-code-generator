import Link from 'next/link';
import { getPosts } from '@/lib/posts';
import Header from '@/components/Header';

export const metadata = {
  title: 'Blog | QR Code Generator',
  description: 'Tips, guides, and best practices for QR codes. Learn how to create and use QR codes effectively.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Blog</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Tips, guides, and best practices for creating and using QR codes.
        </p>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group p-4 -mx-4 rounded-xl hover:bg-white/50 dark:hover:bg-zinc-900/50 transition-colors duration-200"
                >
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
                    {post.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{post.description}</p>
                  <time
                    dateTime={post.date}
                    className="text-sm text-zinc-500 mt-2 block"
                  >
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </Link>
              </article>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
