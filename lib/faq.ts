export type FAQItem = {
  question: string;
  answer: string;
  id?: string;
};

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: 'Are these QR codes safe? Does this site track my data?',
    answer:
      'Yes, the QR codes you generate here are safe to use. We do not store the text or URLs you encode. Your input is sent to our server only to generate the QR image and is not saved, logged, or shared. Once the image is sent back to you, that data is discarded.',
  },
  {
    question: 'How long does a QR code last?',
    answer:
      'Static QR codes (like the ones we generate) last forever. The data is encoded directly into the image, so as long as the code is intact and the destination URL or content still exists, it will continue to work. There is no expiration date.',
  },
  {
    id: 'why-not-scanning',
    question: 'Why is my QR code not scanning?',
    answer:
      'Common reasons and fixes: Too small - make the QR code at least 1 inch (2.5 cm) per side for print, or 200×200 pixels for digital use. Poor contrast - use dark modules on a light background. Damaged or obscured - avoid covering the code with text, logos, or folds. Wrong URL - double-check the link before generating.',
  },
  {
    question: 'What is the difference between static and dynamic QR codes?',
    answer:
      'Static QR codes encode the data directly. The URL or text is fixed in the image. They are free, simple, and never expire. Dynamic QR codes encode a short redirect URL that points to a server. You can change where that redirect goes without reprinting the code, and you can track scans. Dynamic codes usually require a paid service.',
  },
  {
    question: 'Is this QR code generator really free?',
    answer:
      'Yes. You can create as many QR codes as you need at no cost. No sign-up, no account, and no premium tier. We keep the tool free and simple.',
  },
  {
    question: 'What file format do I get?',
    answer:
      'You get a PNG image file. PNG works everywhere: print, web, documents, and design tools. You can resize it as needed, but avoid making it too small or it may not scan well.',
  },
];

/** Top 5 FAQs for homepage: conversion, trust, product clarity, troubleshooting */
const HOMEPAGE_QUESTION_ORDER = [
  'Is this QR code generator really free?',
  'How long does a QR code last?',
  'What is the difference between static and dynamic QR codes?',
  'Are these QR codes safe? Does this site track my data?',
  'Why is my QR code not scanning?',
];

export const TOP_HOMEPAGE_FAQS: FAQItem[] = HOMEPAGE_QUESTION_ORDER
  .map((q) => FAQ_ITEMS.find((item) => item.question === q))
  .filter((item): item is FAQItem => item != null);
