export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

const posts: PostMeta[] = [
  {
    slug: 'how-to-create-qr-code-for-website',
    title: 'How to Create a QR Code for Your Website (Free)',
    description: 'Step-by-step guide to creating a free QR code for your website in minutes.',
    date: '2025-01-15',
  },
  {
    slug: 'qr-code-best-practices',
    title: 'QR Code Best Practices: Size, Placement, and Design',
    description: 'Learn the best practices for QR code size, placement, and design to maximize scannability.',
    date: '2025-01-10',
  },
  {
    slug: 'url-shorteners-vs-qr-codes',
    title: 'URL Shorteners vs QR Codes: When to Use Which',
    description: 'Compare URL shorteners and QR codes to choose the right tool for your needs.',
    date: '2025-01-05',
  },
  {
    slug: 'qr-code-business-card',
    title: 'How to Add a QR Code to Your Business Card',
    description: 'Add a professional QR code to your business card to share your contact info and portfolio.',
    date: '2025-01-01',
  },
  {
    slug: 'qr-code-use-cases',
    title: 'QR Code Use Cases: Menus, Events, Wi-Fi Sharing',
    description: 'Explore practical QR code use cases for menus, events, and Wi-Fi sharing.',
    date: '2024-12-28',
  },
  {
    slug: 'qr-code-security',
    title: 'QR Code Security: What to Scan and What to Avoid',
    description: 'Stay safe when scanning QR codes. Learn what to look for and what to avoid.',
    date: '2024-12-25',
  },
];

export async function getPosts(): Promise<PostMeta[]> {
  return posts.sort((a, b) => (b.date > a.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostMeta | undefined> {
  return posts.find((p) => p.slug === slug);
}
