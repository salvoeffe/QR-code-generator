import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts, getRelatedPosts } from '@/lib/posts';
import { ArticleJsonLd, FAQJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';
import Header from '@/components/Header';
import CreateQRCodeSidebar from '@/components/CreateQRCodeSidebar';
import RelatedPosts from '@/components/RelatedPosts';
import ShareButtons from '@/components/ShareButtons';
import TableOfContents from '@/components/TableOfContents';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { readFile } from 'fs/promises';
import path from 'path';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generatemyqrcode.com';

function slugifyHeading(text: string): string {
  return text
    .replace(/^[\d.]+\s*/, '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

function extractHeadings(content: string): { id: string; text: string; level: 2 | 3 }[] {
  const lines = content.split('\n');
  const headings: { id: string; text: string; level: 2 | 3 }[] = [];
  for (const line of lines) {
    const h2Match = line.match(/^##\s+(.+)$/);
    const h3Match = line.match(/^###\s+(.+)$/);
    if (h2Match) {
      const text = h2Match[1].trim();
      headings.push({ id: slugifyHeading(text), text, level: 2 });
    } else if (h3Match) {
      const text = h3Match[1].trim();
      headings.push({ id: slugifyHeading(text), text, level: 3 });
    }
  }
  return headings;
}

function stripDuplicateH1(content: string): string {
  const firstLineMatch = content.match(/^#\s+.+$/m);
  if (firstLineMatch) {
    const firstLine = firstLineMatch[0];
    const rest = content.slice(firstLine.length).replace(/^\s*\n/, '');
    return rest;
  }
  return content;
}

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
    alternates: {
      canonical: `${baseUrl}/blog/${post.slug}`,
    },
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

  const relatedPosts = await getRelatedPosts(slug);
  const headings = extractHeadings(content);

  return (
    <div className="min-h-screen">
      <BreadcrumbJsonLd
        id="breadcrumb-blog-jsonld"
        items={[
          { name: 'Home', url: baseUrl },
          { name: 'Blog', url: `${baseUrl}/blog` },
          { name: post.title, url: `${baseUrl}/blog/${post.slug}` },
        ]}
      />
      <ArticleJsonLd
        title={post.title}
        description={post.description}
        datePublished={post.date}
        dateModified={post.dateModified}
        url={`${baseUrl}/blog/${post.slug}`}
      />
      {post.faq && post.faq.length > 0 && (
        <FAQJsonLd items={post.faq} />
      )}
      <Header />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 lg:gap-12">
          <div className="min-w-0">
            <Link href="/blog" className="text-emerald-600 hover:text-emerald-700 hover:underline text-sm mb-6 inline-block transition-colors duration-200">
              ← Back to Blog
            </Link>
            <article className="blog-prose prose prose-lg prose-zinc dark:prose-invert max-w-none prose-headings:font-semibold prose-headings:tracking-tight prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline">
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">{post.title}</h1>
              <time
                dateTime={post.date}
                className="text-zinc-500 text-sm block mb-4"
              >
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              <ShareButtons
                url={`${baseUrl}/blog/${slug}`}
                title={post.title}
                description={post.description}
              />
              <div className="blog-content mt-10">
                <MDXRemote
                  source={stripDuplicateH1(content)}
                  components={{
                    h2: ({ children, ...props }) => {
                      const text =
                        typeof children === 'string'
                          ? children
                          : Array.isArray(children)
                            ? children
                                .map((c) => (typeof c === 'string' ? c : ''))
                                .join('')
                            : String(children ?? '');
                      const id = slugifyHeading(text);
                      return (
                        <h2 id={id} className="scroll-mt-24" {...props}>
                          {children}
                        </h2>
                      );
                    },
                    h3: ({ children, ...props }) => {
                      const text =
                        typeof children === 'string'
                          ? children
                          : Array.isArray(children)
                            ? children
                                .map((c) => (typeof c === 'string' ? c : ''))
                                .join('')
                            : String(children ?? '');
                      const id = slugifyHeading(text);
                      return (
                        <h3 id={id} className="scroll-mt-24" {...props}>
                          {children}
                        </h3>
                      );
                    },
                    img: ({ src, alt, ...props }) => {
                      if (!src) return null;
                      const altText = alt ?? '';
                      if (process.env.NODE_ENV === 'development' && !alt) {
                        console.warn('MDX image missing alt text:', src);
                      }
                      if (src.startsWith('/') && (src.endsWith('.png') || src.endsWith('.jpg') || src.endsWith('.webp') || src.endsWith('.svg'))) {
                        const isSquare = src.endsWith('.svg');
                        return (
                          <span className="block my-6">
                            <Image
                              src={src}
                              alt={altText}
                              width={isSquare ? 400 : 672}
                              height={isSquare ? 400 : 378}
                              className="rounded-lg w-full h-auto max-w-md"
                              loading="lazy"
                              {...props}
                            />
                          </span>
                        );
                      }
                      return (
                        <span className="block my-6">
                          <img
                            src={src}
                            alt={altText}
                            className="rounded-lg w-full h-auto"
                            loading="lazy"
                            {...props}
                          />
                        </span>
                      );
                    },
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
              <RelatedPosts posts={relatedPosts} currentSlug={slug} />
            </article>
          </div>
          <div className="space-y-6">
            <TableOfContents headings={headings} />
            <CreateQRCodeSidebar />
          </div>
        </div>
      </main>
    </div>
  );
}
