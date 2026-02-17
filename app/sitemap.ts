import { MetadataRoute } from 'next';
import { getPosts } from '@/lib/posts';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

const staticPages = ['', '/blog', '/faq', '/privacy', '/terms', '/about'];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();

  const staticUrls: MetadataRoute.Sitemap = staticPages.map((path) => ({
    url: `${baseUrl}${path || '/'}`,
    lastModified: new Date(),
    changeFrequency: path === '' ? 'daily' : ('weekly' as const),
    priority: path === '' ? 1 : 0.8,
  }));

  const blogUrls: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticUrls, ...blogUrls];
}
