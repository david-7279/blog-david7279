import { Heading } from "@/lib/posts/types";

/**
 * Converts heading text into a URL-safe identifier.
 *
 * The generated identifier is intentionally deterministic so that
 * the same Markdown heading always produces the same base ID.
 */
function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Extracts H2 and H3 headings from Markdown/MDX content.
 *
 * Heading IDs are generated from their text and made unique when
 * duplicate headings are present:
 *
 *   "hello-world"
 *   "hello-world-2"
 *   "hello-world-3"
 *
 * The parser intentionally targets H2/H3 headings only because these
 * levels are used to build the post table of contents.
 */
export function extractHeadings(content: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+?)\s*#*\s*$/gm;

  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();

  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;

    // Remove JSX/MDX attributes such as `{#custom-id}` from heading text.
    const text = match[2].replace(/\{[^}]*\}/g, "").trim();

    if (!text) {
      continue;
    }

    const baseId = slugifyHeading(text);

    if (!baseId) {
      continue;
    }

    const count = (slugCounts.get(baseId) ?? 0) + 1;

    slugCounts.set(baseId, count);

    const id = count === 1 ? baseId : `${baseId}-${count}`;

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}
