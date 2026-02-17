import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { ArticleJsonLd } from '@/components/JsonLd';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { readFile } from 'fs/promises';
import path from 'path';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Not Found' };
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  let content: string;
  try {
    const filePath = path.join(process.cwd(), 'content', `${slug}.mdx`);
    content = await readFile(filePath, 'utf-8');
  } catch {
    notFound();
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        datePublished={post.date}
        url={`${baseUrl}/blog/${post.slug}`}
      />
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
        <Link href="/blog" className="text-emerald-600 hover:underline text-sm mb-6 inline-block">
          ← Back to Blog
        </Link>
        <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{post.title}</h1>
          <time
            dateTime={post.date}
            className="text-zinc-500 text-sm block mb-8"
          >
            {new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </time>
          <div className="blog-content">
            <MDXRemote
              source={content}
              components={{
                a: ({ href, children, ...props }) => {
                  const isExternal = href?.startsWith('http');
                  if (isExternal) {
                    return (
                      <a href={href} target="_blank" rel="noopener noreferrer" className="text-emerald-600 hover:underline" {...props}>
                        {children}
                      </a>
                    );
                  }
                  return (
                    <Link href={href || '#'} className="text-emerald-600 hover:underline" {...props}>
                      {children}
                    </Link>
                  );
                },
              }}
            />
          </div>
        </article>
      </main>
    </div>
  );
}
