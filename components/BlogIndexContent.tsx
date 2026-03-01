'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BlogSearch from '@/components/BlogSearch';
import CategoryIcon, { CARD_IMAGE_ASPECT } from '@/components/CategoryIcon';
import type { Category, PostMeta } from '@/lib/posts';

const CATEGORIES: Category[] = [
  'Troubleshooting',
  'Marketing Tips',
  'Industry Guides',
  'Guides & Comparisons',
];

function categoryToId(category: Category): string {
  return category.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
}

function PostCard({
  slug,
  title,
  description,
  date,
  category,
  readingTimeMinutes,
  featuredImage,
}: {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  readingTimeMinutes?: number;
  featuredImage?: string;
}) {
  return (
    <li>
      <article className="h-full min-h-[220px] flex flex-col rounded-2xl bg-[var(--surface-elevated)] shadow-[var(--shadow-sm)] border border-zinc-200/60 dark:border-zinc-700/50 overflow-hidden transition-shadow duration-200 hover:shadow-[var(--shadow-md)]">
        <Link
          href={`/blog/${slug}`}
          className="block group flex-1 flex flex-col min-h-0"
        >
          {featuredImage ? (
            <div className={`${CARD_IMAGE_ASPECT} relative w-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden rounded-t-2xl`}>
              <Image src={featuredImage} alt="" fill className="object-cover" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
            </div>
          ) : (
            <div className={`${CARD_IMAGE_ASPECT} w-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center rounded-t-2xl`}>
              <CategoryIcon category={category} />
            </div>
          )}
          <div className="p-6 sm:p-8 flex-1 flex flex-col min-h-0">
            <span className="inline-block text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
              {category}
            </span>
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 transition-colors duration-200">
            {title}
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mt-3 leading-relaxed text-[15px] line-clamp-3 flex-1">
            {description}
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-zinc-500">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {readingTimeMinutes != null && (
              <>
                <span aria-hidden>·</span>
                <span>{readingTimeMinutes} min read</span>
              </>
            )}
          </div>
          </div>
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
  posts: (PostMeta & { readingTimeMinutes?: number })[];
  featuredPost: (PostMeta & { readingTimeMinutes?: number }) | undefined;
  postsByCategory: Record<string, PostMeta[]>;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const latestPosts = posts
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, 3);
  const getReadingTime = (slug: string) => posts.find((p) => p.slug === slug)?.readingTimeMinutes;
  const getFeaturedImage = (slug: string) => posts.find((p) => p.slug === slug)?.featuredImage;

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
        Blog
      </h1>
      <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-10 leading-relaxed max-w-2xl">
        Tips, guides, and best practices for creating and using QR codes.
      </p>

      <BlogSearch posts={posts} onQueryChange={setSearchQuery} />

      <>
        <nav className="mb-10" aria-label="Blog categories">
          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((category) => {
              const categoryPosts = postsByCategory[category] ?? [];
              if (categoryPosts.length === 0) return null;
              const id = categoryToId(category);
              return (
                <li key={category}>
                  <a
                    href={`#${id}`}
                    className="inline-block px-3 py-1.5 rounded-full text-sm font-medium text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    {category}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        {featuredPost && (
          <section className="mb-28">
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="block group rounded-2xl overflow-hidden border-l-4 border-emerald-500 border-2 border-emerald-500/30 dark:border-emerald-500/40 bg-gradient-to-br from-emerald-100/90 to-white dark:from-emerald-950/40 dark:to-zinc-900 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-200 hover:border-emerald-500/50"
            >
              <div className="p-8 sm:p-10 relative">
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
                  {featuredPost.readingTimeMinutes != null && (
                    <span className="ml-2">· {featuredPost.readingTimeMinutes} min read</span>
                  )}
                </time>
                <span className="inline-flex items-center mt-4 text-emerald-600 dark:text-emerald-400 font-medium group-hover:underline">
                  Read guide →
                </span>
              </div>
            </Link>
          </section>
        )}

        {latestPosts.length > 0 && (
          <section className="mb-28">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-8 tracking-tight">
              Latest
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  category={post.category}
                  readingTimeMinutes={post.readingTimeMinutes}
                  featuredImage={post.featuredImage}
                />
              ))}
            </ul>
          </section>
        )}

        {CATEGORIES.map((category, index) => {
          const categoryPosts = postsByCategory[category] ?? [];
          if (categoryPosts.length === 0) return null;

          const id = categoryToId(category);
          const isFirstCategory = index === 0;

          return (
            <section
              key={category}
              id={id}
              className={isFirstCategory ? 'mb-28 scroll-mt-24' : 'mb-24 scroll-mt-24'}
            >
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
                    category={post.category}
                    readingTimeMinutes={getReadingTime(post.slug)}
                    featuredImage={getFeaturedImage(post.slug)}
                  />
                ))}
              </ul>
            </section>
          );
        })}
      </>
    </>
  );
}
