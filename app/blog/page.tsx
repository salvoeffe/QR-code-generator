import Link from 'next/link';
import { getFeaturedPost, getPostsByCategory } from '@/lib/posts';
import Header from '@/components/Header';
import type { Category } from '@/lib/posts';

export const metadata = {
  title: 'Blog | QR Code Generator',
  description: 'Tips, guides, and best practices for QR codes. Learn how to create and use QR codes effectively.',
};

function PostCard({
  slug,
  title,
  description,
  date,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
}) {
  return (
    <li>
      <article className="h-full rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
        <Link
          href={`/blog/${slug}`}
          className="block group p-5 sm:p-6 min-h-[44px] h-full"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-2 leading-relaxed">{description}</p>
          <time
            dateTime={date}
            className="text-sm text-zinc-500 mt-2 block"
          >
            {new Date(date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
        </Link>
      </article>
    </li>
  );
}

export default async function BlogPage() {
  const [featuredPost, postsByCategory] = await Promise.all([
    getFeaturedPost(),
    getPostsByCategory(),
  ]);

  return (
    <div className="min-h-screen">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
          Blog
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-12">
          Tips, guides, and best practices for creating and using QR codes.
        </p>

        {featuredPost && (
          <section className="mb-16">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block group rounded-2xl overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-zinc-900 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-200 hover:border-emerald-500/50"
            >
              <div className="p-6 sm:p-8">
                <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                  Featured
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
                  {featuredPost.title}
                </h2>
                <p className="text-zinc-600 dark:text-zinc-400 mt-3 text-lg leading-relaxed max-w-2xl">
                  {featuredPost.description}
                </p>
                <time
                  dateTime={featuredPost.date}
                  className="text-sm text-zinc-500 mt-4 block"
                >
                  {new Date(featuredPost.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
                <span className="inline-flex items-center mt-4 text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
                  Read guide →
                </span>
              </div>
            </Link>
          </section>
        )}

        {(['Troubleshooting', 'Marketing Tips', 'Industry Guides', 'Guides & Comparisons'] as Category[]).map(
          (category) => {
            const posts = postsByCategory.get(category) ?? [];
            if (posts.length === 0) return null;

            return (
              <section key={category} className="mb-16">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-6 tracking-tight">
                  {category}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <PostCard
                      key={post.slug}
                      slug={post.slug}
                      title={post.title}
                      description={post.description}
                      date={post.date}
                    />
                  ))}
                </ul>
              </section>
            );
          }
        )}
      </main>
    </div>
  );
}
