'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

function filterPosts(posts: PostMeta[], query: string): PostMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return posts.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
  );
}

export default function BlogSearch({
  posts,
  onQueryChange,
}: {
  posts: PostMeta[];
  onQueryChange?: (query: string) => void;
}) {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    onQueryChange?.(debouncedQuery);
  }, [debouncedQuery, onQueryChange]);

  const results = filterPosts(posts, debouncedQuery);
  const hasQuery = debouncedQuery.length > 0;

  const handleClear = useCallback(() => {
    setQuery('');
    onQueryChange?.('');
  }, [onQueryChange]);

  return (
    <div className="mb-12">
      <div className="max-w-md">
        <div className="relative">
          <input
            type="search"
            placeholder="Search guides and troubleshooting..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 py-2 pl-3 pr-10 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500"
            aria-label="Search blog posts"
          />
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 p-1"
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {hasQuery && (
        <div className="mt-4 max-w-2xl">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            {results.length > 0 ? `Search results for "${debouncedQuery}"` : `No results for "${debouncedQuery}"`}
          </p>
          {results.length > 0 ? (
            <ul className="space-y-2">
              {results.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block rounded-lg bg-[var(--surface-elevated)] border border-zinc-200/60 dark:border-zinc-700/50 p-3 hover:shadow-[var(--shadow-sm)] transition-shadow"
                    onClick={handleClear}
                  >
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        {post.category}
                      </span>
                      <time dateTime={post.date} className="text-xs text-zinc-500">
                        {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                    <h2 className="font-medium text-sm text-zinc-900 dark:text-zinc-100">
                      {post.title}
                    </h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5 line-clamp-1">
                      {post.description}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 py-4">
              Try a different term or browse by category below.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
