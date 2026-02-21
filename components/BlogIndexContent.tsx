'use client';

import { useState } from 'react';
import Link from 'next/link';
import BlogSearch from '@/components/BlogSearch';
import type { Category, PostMeta } from '@/lib/posts';

const CATEGORIES: Category[] = [
  'Troubleshooting',
  'Marketing Tips',
  'Industry Guides',
  'Guides & Comparisons',
];

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
          className="block group p-6 sm:p-8 min-h-[44px] h-full"
        >
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed text-[15px]">
            {description}
          </p>
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

export default function BlogIndexContent({
  posts,
  featuredPost,
  postsByCategory,
}: {
  posts: PostMeta[];
  featuredPost: PostMeta | undefined;
  postsByCategory: Record<string, PostMeta[]>;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const showMainContent = searchQuery.length === 0;

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
        Blog
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-16 leading-relaxed max-w-2xl">
        Tips, guides, and best practices for creating and using QR codes.
      </p>

      <BlogSearch posts={posts} onQueryChange={setSearchQuery} />

      {showMainContent && (
        <>
          {featuredPost && (
            <section className="mb-20">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="block group rounded-2xl overflow-hidden border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-50/80 to-white dark:from-emerald-950/30 dark:to-zinc-900 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-200 hover:border-emerald-500/50"
              >
                <div className="p-8 sm:p-10">
                  <span className="inline-block text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-3">
                    Featured
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
                    {featuredPost.title}
                  </h2>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-4 text-lg sm:text-xl leading-relaxed max-w-2xl">
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

          {CATEGORIES.map((category) => {
            const categoryPosts = postsByCategory[category] ?? [];
            if (categoryPosts.length === 0) return null;

            return (
              <section key={category} className="mb-24">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
                  {category}
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryPosts.map((post) => (
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
          })}
        </>
      )}
    </>
  );
}
