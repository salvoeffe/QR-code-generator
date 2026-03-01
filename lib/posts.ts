export type Category = 'Troubleshooting' | 'Marketing Tips' | 'Industry Guides' | 'Guides & Comparisons';

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  category: Category;
  featured?: boolean;
  faq?: { question: string; answer: string }[];
};

const posts: PostMeta[] = [
  {
    slug: 'how-to-create-qr-code-for-website',
    title: 'How to Get a QR Code for Your Website (Free)',
    description: 'Learn how to make a QR code for your website in minutes. Free, no sign-up. Step-by-step guide with instant download.',
    date: '2025-01-15',
    category: 'Guides & Comparisons',
  },
  {
    slug: 'qr-code-best-practices',
    title: 'QR Code Best Practices: Size, Placement, and Design',
    description: 'Learn the best practices for QR code size, placement, and design to maximize scannability.',
    date: '2025-01-10',
    category: 'Marketing Tips',
  },
  {
    slug: 'url-shorteners-vs-qr-codes',
    title: 'URL Shorteners vs QR Codes: When to Use Which',
    description: 'Compare URL shorteners and QR codes to choose the right tool for your needs.',
    date: '2025-01-05',
    category: 'Marketing Tips',
  },
  {
    slug: 'qr-code-business-card',
    title: 'Business Card QR Code: How to Add One (Free)',
    description: 'Create a business card QR code for free. Add your contact info, print on cards, and share instantly. No sign-up.',
    date: '2025-01-01',
    category: 'Industry Guides',
  },
  {
    slug: 'qr-code-use-cases',
    title: 'QR Code Use Cases: Menus, Events, Wi-Fi Sharing',
    description: 'Explore practical QR code use cases for menus, events, and Wi-Fi sharing.',
    date: '2024-12-28',
    dateModified: '2026-02-21',
    category: 'Marketing Tips',
  },
  {
    slug: 'qr-code-security',
    title: 'QR Code Security: What to Scan and What to Avoid',
    description: 'QR code security guide: what to scan and what to avoid. Stay safe when scanning QR codes and avoid scams.',
    date: '2024-12-25',
    dateModified: '2026-02-21',
    category: 'Troubleshooting',
  },
  {
    slug: 'state-of-qr-codes-2026',
    title: 'The State of QR Codes in 2026',
    description: 'Where QR codes stand today: ubiquity, trends, and why static codes still win for most use cases.',
    date: '2026-02-15',
    category: 'Guides & Comparisons',
  },
  {
    slug: 'why-qr-code-not-scanning',
    title: 'Why Is My QR Code Not Scanning?',
    description: 'Common reasons your QR code won\'t scan and how to fix them: size, contrast, damage, and more.',
    date: '2026-02-14',
    category: 'Troubleshooting',
    faq: [
      { question: 'Why is my QR code too small to scan?', answer: 'QR codes need a minimum size to be readable. For print, aim for at least 1 inch (2.5 cm) per side. For digital use, 200×200 pixels minimum. Use 384px or 512px for print projects.' },
      { question: 'Does contrast affect QR code scanning?', answer: 'Yes. Use black or very dark modules on a white or light background. Avoid light gray on white or dark gray on black. Low contrast causes scan failures.' },
      { question: 'Can damage or covered areas prevent scanning?', answer: 'Scratches, folds, or anything covering part of the code can prevent scanning. The quiet zone (white margin) is critical. Keep a clear margin and don\'t add logos or text over the pattern.' },
      { question: 'What if the QR code scans but the link fails?', answer: 'Double-check the URL before generating. Test in a browser. Ensure the website is live and doesn\'t require login. Avoid very long URLs when possible.' },
      { question: 'Do lighting and angle affect QR scanning?', answer: 'Glare, shadows, or extreme angles can prevent the camera from reading the code. Ensure good, even lighting and hold the camera straight-on.' },
      { question: 'Can blurry print prevent QR code scanning?', answer: 'Yes. Export at sufficient resolution (512px for print). Use 300 DPI or higher. Don\'t stretch or resize a small image to large format.' },
      { question: 'Could my phone or app cause scanning issues?', answer: 'Try a different phone or the built-in camera app. Ensure the lens is clean. Test with a known-good code to confirm your device works.' },
    ],
  },
  {
    slug: 'static-vs-dynamic-qr-codes',
    title: 'Static vs Dynamic QR Codes: Which One Do You Need?',
    description: 'Compare static and dynamic QR codes. Learn when to use each and which fits your use case.',
    date: '2026-02-13',
    category: 'Guides & Comparisons',
    featured: true,
  },
  {
    slug: 'qr-codes-real-estate',
    title: 'QR Codes for Real Estate Signs: A Practical Guide',
    description: 'How real estate agents use QR codes on signs to drive traffic to listings and capture leads.',
    date: '2026-02-12',
    category: 'Industry Guides',
  },
  {
    slug: 'creative-qr-code-marketing-ideas',
    title: 'Creative QR Code Marketing Ideas',
    description: 'Beyond menus and business cards: packaging, events, print ads, and more ways to use QR codes in marketing.',
    date: '2026-02-11',
    category: 'Marketing Tips',
  },
  {
    slug: 'qr-code-wifi',
    title: 'How to Create a QR Code for Wi-Fi',
    description: 'Let guests connect to your Wi-Fi with one scan. Simple format and setup guide.',
    date: '2026-02-10',
    category: 'Industry Guides',
  },
  {
    slug: 'qr-codes-restaurants',
    title: 'Restaurant QR Code: Menus and Contactless Ordering',
    description: 'How to use a restaurant QR code for menus, ordering, and contactless service. Free generator and best practices.',
    date: '2026-02-09',
    category: 'Industry Guides',
  },
  {
    slug: 'restaurant-qr-code-menu-table-ordering',
    title: 'Restaurant QR Code: Menu, Table, and Ordering',
    description: 'Use a restaurant QR code for your menu and table ordering. Free QR code menu generator—no sign-up. Best placement and scannability.',
    date: '2026-02-21',
    category: 'Industry Guides',
  },
  {
    slug: 'restaurant-qr-code-menu-guide-2026',
    title: 'The 2026 Restaurant Guide to QR Code Menus: Faster Service, Higher Margins',
    description: 'Cut labor costs and update prices instantly with QR code menus. Design, placement, and scannability for bars, bistros, and cafes.',
    date: '2026-02-20',
    category: 'Industry Guides',
    faq: [
      { question: 'Do I need an app to read a menu QR?', answer: 'No. Every smartphone camera reads QR codes natively. Guests point, scan, and the menu opens in the browser. No app download required.' },
      { question: 'How do I update my menu prices without changing the QR?', answer: 'If your QR code points to a hosted PDF or webpage, you update the file or page—not the code. The URL stays the same, so the QR code stays the same. Re-upload the PDF or edit the page, and every table gets the new menu.' },
      { question: 'Is a PDF menu better than a website menu?', answer: 'It depends. A PDF is easier: design once, upload, done. A webpage can load faster and adapt to screen size, but requires more setup. For most restaurants, a well-designed PDF hosted on Google Drive, Dropbox, or your website is the simplest and most reliable option.' },
    ],
  },
  {
    slug: 'free-vs-paid-qr-generators',
    title: 'Free vs Paid QR Code Generators: When Does Paid Make Sense?',
    description: 'Compare free and paid QR generators. Learn when free is enough and when to consider paid options.',
    date: '2026-02-08',
    category: 'Guides & Comparisons',
  },
  {
    slug: 'qr-codes-events',
    title: 'QR Codes for Events: Badges, Tickets, and More',
    description: 'Use QR codes for event check-in, badges, session materials, and sponsor engagement.',
    date: '2026-02-07',
    category: 'Industry Guides',
  },
];

const CATEGORY_ORDER: Category[] = ['Troubleshooting', 'Marketing Tips', 'Industry Guides', 'Guides & Comparisons'];

export async function getPosts(): Promise<PostMeta[]> {
  return [...posts].sort((a, b) => (b.date > a.date ? 1 : -1));
}

export async function getPostBySlug(slug: string): Promise<PostMeta | undefined> {
  return posts.find((p) => p.slug === slug);
}

export async function getFeaturedPost(): Promise<PostMeta | undefined> {
  return posts.find((p) => p.featured === true);
}

export async function getPostsByCategory(): Promise<Map<Category, PostMeta[]>> {
  const map = new Map<Category, PostMeta[]>();
  for (const category of CATEGORY_ORDER) {
    const categoryPosts = posts
      .filter((p) => p.category === category && !p.featured)
      .sort((a, b) => (b.date > a.date ? 1 : -1));
    map.set(category, categoryPosts);
  }
  return map;
}

export async function getRelatedPosts(
  currentSlug: string,
  limit: number = 4
): Promise<PostMeta[]> {
  const current = posts.find((p) => p.slug === currentSlug);
  if (!current) return [];

  const sameCategory = posts
    .filter((p) => p.slug !== currentSlug && p.category === current.category)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  const otherCategory = posts
    .filter((p) => p.slug !== currentSlug && p.category !== current.category)
    .sort((a, b) => (b.date > a.date ? 1 : -1));

  const related = [...sameCategory, ...otherCategory];
  return related.slice(0, limit);
}
