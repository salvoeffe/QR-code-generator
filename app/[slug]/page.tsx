import { notFound } from 'next/navigation';
import { getPosts, getPostBySlug } from '@/lib/posts';
import type { PostMeta } from '@/lib/posts';
import { getPageContent } from '@/lib/content';
import GeneratorPageContent from '@/components/GeneratorPageContent';
import { BreadcrumbJsonLd } from '@/components/JsonLd';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://generatemyqrcode.com';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const content = getPageContent(slug);
  if (!content) return {};
  return {
    title: { absolute: content.metaTitle },
    description: content.metaDescription,
    alternates: {
      canonical: `${baseUrl}/${slug}`,
    },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const content = getPageContent(slug);

  if (!content) {
    notFound();
  }

  const allPosts = await getPosts();
  const latestPosts = allPosts.slice(0, 3);

  const relatedPostsResolved =
    content.relatedBlogSlugs?.length
      ? (await Promise.all(content.relatedBlogSlugs.map((s) => getPostBySlug(s))))
          .filter((p): p is PostMeta => p != null)
          .map((p) => ({ slug: p.slug, title: p.title }))
      : undefined;

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', url: baseUrl },
          { name: content.h1, url: `${baseUrl}/${slug}` },
        ]}
      />
      <GeneratorPageContent
      hero={{
        title: content.h1,
        subtitle: content.heroSubtitle,
        description: content.heroDescription,
      }}
      initialContentType={content.contentType}
      latestPosts={latestPosts}
      relatedPosts={relatedPostsResolved}
    />
    </>
  );
}
