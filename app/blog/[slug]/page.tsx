import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { ArticleJsonLd } from '@/components/JsonLd';
import Header from '@/components/Header';
import CreateQRCodeSidebar from '@/components/CreateQRCodeSidebar';
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
    <div className="min-h-screen">
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        datePublished={post.date}
        url={`${baseUrl}/blog/${post.slug}`}
      />
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          <div className="min-w-0">
            <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 hover:underline text-sm mb-6 inline-block transition-colors duration-200">
              ← Back to Blog
            </Link>
            <article className="prose prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{post.title}</h1>
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
          </div>
          <div>
            <CreateQRCodeSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
