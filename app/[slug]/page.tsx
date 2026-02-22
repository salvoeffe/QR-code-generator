import { notFound } from 'next/navigation';
import { getPosts } from '@/lib/posts';
import { getSlugConfig } from '@/lib/slugs';
import GeneratorPageContent from '@/components/GeneratorPageContent';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const config = getSlugConfig(slug);
  if (!config) return {};
  return {
    title: { absolute: config.metadataTitle },
  };
}

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const config = getSlugConfig(slug);

  if (!config) {
    notFound();
  }

  const allPosts = await getPosts();
  const latestPosts = allPosts.slice(0, 3);

  return (
    <GeneratorPageContent
      hero={{
        title: config.title,
        subtitle: config.subtitle,
        description: config.description,
      }}
      initialContentType={config.contentType}
      latestPosts={latestPosts}
    />
  );
}
