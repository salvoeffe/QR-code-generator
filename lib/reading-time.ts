const WPM = 200;

/**
 * Strip markdown to approximate plain text for word count.
 */
function stripMarkdown(text: string): string {
  return text
    .replace(/^#+\s+/gm, ' ')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/_([^_]+)_/g, '$1')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/^\s*[-*+]\s+/gm, ' ')
    .replace(/^\s*\d+\.\s+/gm, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Returns estimated reading time in minutes (200 wpm, minimum 1).
 */
export function getReadingTimeMinutes(content: string): number {
  const plain = stripMarkdown(content);
  const wordCount = plain ? plain.split(/\s+/).filter(Boolean).length : 0;
  return Math.max(1, Math.ceil(wordCount / WPM));
}
