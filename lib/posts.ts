import path from 'path';
import { readFile } from 'fs/promises';

export type Category = 'Troubleshooting' | 'Marketing Tips' | 'Industry Guides' | 'Guides & Comparisons';

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
  dateModified?: string;
  category: Category;
  featured?: boolean;
  featuredImage?: string;
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
    slug: 'free-qr-code-menu-generator',
    title: 'Free QR Code Menu Generator: No Sign-Up (2026)',
    description: 'Create a free QR code for your restaurant menu in seconds. No sign-up, no expiration. Paste your menu URL and download—ideal for cafes, bars, and bistros.',
    date: '2026-03-01',
    category: 'Industry Guides',
  },
  {
    slug: 'how-to-test-qr-code-before-printing',
    title: 'How to Test a QR Code Before You Print Hundreds',
    description: 'A practical checklist to verify your QR code works before a big print run: scan on multiple devices, test the URL, print one sample, and avoid costly reprints.',
    date: '2026-03-01',
    category: 'Troubleshooting',
    faq: [
      { question: 'Do I need a special app to test a QR code?', answer: 'No. Modern phone cameras read QR codes natively. For decoding the raw content (e.g. to verify a vCard or URL), you can use an online reader that runs in the browser and doesn\'t send your image to a server.' },
      { question: 'How many devices should I test on?', answer: 'At least two—your own phone and one other (ideally a different OS). For high-volume or public placements (menus, signs, flyers), testing on two or three devices catches most real-world issues before print.' },
      { question: 'What if the code works on screen but not when printed?', answer: 'Usually the print is too small, too low-contrast, or blurred (e.g. upscaled from a small image). Print one sample at final size and material, then scan from the distance users will use. If it fails, increase the code size, improve contrast, or export at higher resolution and avoid stretching the image.' },
      { question: 'Can I test a QR code without printing it?', answer: 'Yes. Scan it from your screen with your phone, and use an online reader to decode the payload. For final confidence, though, print one sample—screen tests don\'t catch print-specific issues like gloss, blur, or size.' },
    ],
  },
  {
    slug: 'where-to-put-qr-codes-flyers-posters',
    title: 'Where to Put QR Codes on Flyers, Posters, and Print Ads',
    description: 'Placement and size tips so QR codes on flyers, posters, and print ads get scanned: where to put them, how big to make them, and how to label them.',
    date: '2026-03-01',
    category: 'Marketing Tips',
    faq: [
      { question: 'Where should the QR code go on a flyer?', answer: 'Put it where people look first: next to the headline or main offer, above the fold. Avoid the bottom corner or a tiny footer. Add a short line like "Scan for discount" or "Get the menu" so the benefit is clear.' },
      { question: 'How big should a QR code be on a poster?', answer: 'At least 2–4 inches per side for something people view from a few feet away. For billboards or large outdoor, think 3+ feet per side and export at high resolution (e.g. 1024px or more) so it stays sharp when enlarged.' },
      { question: 'Can I put more than one QR code on a flyer?', answer: 'Yes, if each has a distinct purpose (e.g. one for menu, one for Wi-Fi) and each is clearly labeled. For simple offers, one code is usually better—less clutter and no confusion about which to scan.' },
      { question: 'Why isn\'t my flyer QR code scanning?', answer: 'Common causes: code too small for the viewing distance, low contrast (e.g. gray on white), or no quiet zone (margin) around the code. Size it for arm\'s length or farther, use dark on light, and test a printed sample before the full run.' },
    ],
  },
  {
    slug: 'restaurant-qr-code-menu-table-ordering',
    title: 'Restaurant QR Code: Menu, Table, and Ordering',
    description: 'Use a restaurant QR code for your menu and table ordering. Free QR code menu generator—no sign-up. Best placement and scannability.',
    date: '2026-02-21',
    dateModified: '2026-03-01',
    category: 'Industry Guides',
    faq: [
      { question: 'Do guests need an app to scan the menu?', answer: 'No. Every smartphone camera reads QR codes natively. Guests point, scan, and the menu opens in the browser. No app download required.' },
      { question: 'How do I update my menu without reprinting the QR code?', answer: 'If your QR code points to a hosted PDF or webpage, you update the file or page—not the code. The URL stays the same, so the QR code stays the same. Re-upload the PDF or edit the page, and every table gets the new menu.' },
      { question: 'Is a PDF menu better than a webpage?', answer: 'It depends. A PDF is easier: design once, upload, done. A webpage can load faster and adapt to screen size, but requires more setup. For most restaurants, a well-designed PDF hosted on your site or cloud storage is the simplest and most reliable option.' },
      { question: 'What size should the QR code be for a table tent?', answer: 'Aim for at least 2–3 inches per side (about 512px at print resolution). In dim lighting or at a distance, go larger—3 inches or more—to improve scan success.' },
      { question: 'Can one QR code do both menu and ordering?', answer: 'Only if the same platform serves both (e.g. a menu page that also has an "order" button). Otherwise use one code for the menu (e.g. from our generator) and a separate code from your ordering platform for "order here."' },
    ],
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
  {
    slug: 'how-long-do-qr-codes-last',
    title: 'How Long Do QR Codes Last? (Static vs Dynamic)',
    description: 'Do QR codes expire? Static QR codes last as long as the link works. Dynamic codes depend on the provider. When to expect breakage and how to avoid it.',
    date: '2026-03-15',
    category: 'Troubleshooting',
    faq: [
      { question: 'Do static QR codes expire?', answer: 'No. A static QR code encodes a fixed URL or other data. It has no expiration date and no server to turn it off. It works until the destination (e.g. the webpage) stops working—for example, if the page is removed or the domain changes without a redirect.' },
      { question: 'Do dynamic QR codes expire?', answer: 'They can. Dynamic codes rely on a provider\'s server to redirect to the current destination. If the provider shuts down, discontinues the link, or you stop paying, the code may break. Check the provider\'s terms and longevity before using dynamic codes for long-term print.' },
      { question: 'What happens if I change my domain?', answer: 'If your QR code points to a URL on the old domain, set up a 301 redirect from that old URL to the new one. Then the same printed code keeps working. Without a redirect, scanners will hit a dead or wrong page.' },
      { question: 'How do I make my QR code last?', answer: 'Use a URL you control on your own domain. Avoid relying on link shorteners or third-party redirect URLs for permanent print. When you change or move pages, add redirects so the old URL still resolves. Test the code periodically and after any site changes.' },
    ],
  },
  {
    slug: 'can-you-edit-qr-code-after-printing',
    title: 'Can You Edit a QR Code After Printing?',
    description: 'Static QR codes can\'t be edited after printing—but you can change where the link goes with a redirect. Dynamic codes are editable. When you need to reprint.',
    date: '2026-03-15',
    category: 'Troubleshooting',
    faq: [
      { question: 'Can I change a QR code after printing?', answer: 'You can\'t change the printed pattern. You can change where it sends people by either (1) setting up a redirect on the URL the code points to (if you control it), or (2) using a dynamic QR code and changing the destination in the provider\'s dashboard. Both approaches keep the same printed code; only the destination changes.' },
      { question: 'What\'s the difference between static and dynamic for editing?', answer: 'Static: the pattern is fixed. To "edit" you change what happens when someone visits that URL (e.g. a redirect to a new page). Dynamic: the provider lets you point the same code to a new URL from their dashboard. Static doesn\'t depend on a third party; dynamic does.' },
      { question: 'Can I use a redirect to change where my QR code goes?', answer: 'Yes. If the QR code points to a URL you control, set up a 301 redirect from that URL to the new destination. Everyone who scans the existing code will be sent to the new page. No need to reprint.' },
      { question: 'When do I have to reprint?', answer: 'Reprint when you need a different URL with no redirect (e.g. new domain, no redirect), you\'re leaving a dynamic provider and the link will die, or you need a different type of content (e.g. vCard instead of URL). If you can redirect the old URL to the new one, you usually don\'t need to reprint.' },
    ],
  },
  {
    slug: 'how-to-get-qr-code-for-website-2-minutes',
    title: 'How to Get a QR Code for Your Website in 2 Minutes',
    description: 'Get a free QR code for your website in under 2 minutes. No sign-up. Paste your URL, choose size, download. Works for landing pages, portfolios, and homepages.',
    date: '2026-03-15',
    category: 'Guides & Comparisons',
    faq: [
      { question: 'Do I need an account to get a QR code for my website?', answer: 'No. Many generators, including ours, let you paste a URL and download the code without signing up. You get a static QR code that encodes your link directly.' },
      { question: 'What size should I use for a website QR code?', answer: 'For digital use (screens, email), 256px or 384px is usually enough. For print (business cards, flyers, table tents), use at least 512px so it stays sharp and readable at arm\'s length or farther.' },
      { question: 'Can I use it for a specific page or just the homepage?', answer: 'You can use any URL—homepage, landing page, product page, or event page. Paste the exact URL you want people to open. The code will point to that page.' },
      { question: 'Does the QR code expire?', answer: 'Static QR codes don\'t expire. They last as long as the URL works. If you remove the page or change the URL without a redirect, the code will break; otherwise it keeps working.' },
    ],
  },
  {
    slug: 'free-whatsapp-qr-code-how-to-create',
    title: 'Free WhatsApp QR Code: How to Create One (No App Required)',
    description: 'Create a free WhatsApp QR code in under a minute. No sign-up. Add your number and optional message; download and use on menus, flyers, or support. Works on iPhone and Android.',
    date: '2026-03-15',
    category: 'Industry Guides',
    faq: [
      { question: 'Do I need WhatsApp Business to use a WhatsApp QR code?', answer: 'No. A standard WhatsApp number is enough. You enter your number (with country code) in the generator; the code opens a chat with that number. WhatsApp Business is optional and useful if you want business profile features, but not required for the QR code.' },
      { question: 'Can I add a default message to the QR code?', answer: 'Yes. Most WhatsApp QR generators let you add an optional pre-filled message. When someone scans, WhatsApp opens with your number and that message ready to send. Useful for "Order here," "Support," or "I have a question."' },
      { question: 'What size should the WhatsApp QR code be for print?', answer: 'Use at least 512px for print (menus, table tents, flyers) so it scans reliably at arm\'s length or farther. For digital use, 256px is usually enough.' },
      { question: 'Do guests need an app to scan it?', answer: 'They need WhatsApp installed (or they can open the link in a browser). The QR code opens a wa.me link that launches WhatsApp with your number. If they don\'t have the app, they\'ll be prompted to install it or continue in the browser.' },
    ],
  },
];

const CATEGORY_ORDER: Category[] = ['Troubleshooting', 'Marketing Tips', 'Industry Guides', 'Guides & Comparisons'];

export async function readPostContent(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'content', `${slug}.mdx`);
  return readFile(filePath, 'utf-8');
}

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
