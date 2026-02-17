import Link from 'next/link';
import { getPosts } from '@/lib/posts';

export const metadata = {
  title: 'Blog | QR Code Generator',
  description: 'Tips, guides, and best practices for QR codes. Learn how to create and use QR codes effectively.',
};

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
            QR Code Generator
          </Link>
          <div className="flex gap-6">
            <Link href="/blog" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
              Blog
            </Link>
            <Link href="/about" className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4">Blog</h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Tips, guides, and best practices for creating and using QR codes.
        </p>

        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug}>
              <article>
                <Link
                  href={`/blog/${post.slug}`}
                  className="block group"
                >
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors">
                    {post.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-2">{post.description}</p>
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
