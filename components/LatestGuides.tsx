import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

export default function LatestGuides({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="mt-12 sm:mt-16 pt-10 sm:pt-12 border-t border-zinc-200/60 dark:border-zinc-700/50">
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-4 sm:mb-6 tracking-tight">
        Check out our latest guides
      </h2>
      <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map((post) => (
          <li key={post.slug}>
            <article className="h-full rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
              <Link
                href={`/blog/${post.slug}`}
                className="block group p-5 min-h-[44px] h-full"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
                  {post.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-1 line-clamp-2">
                  {post.description}
                </p>
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
}
