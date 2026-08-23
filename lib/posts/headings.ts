export type Heading = {
  id: string;
  text: string;
  level: number;
};

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
 * Extracts h2 and h3 headings from Markdown/MDX content.
 *
 * Duplicate headings receive a numeric suffix:
 *
 * "hello-world"
 * "hello-world-2"
 * "hello-world-3"
 */
export function extractHeadings(
    content: string,
): Heading[] {
  const headingRegex =
      /^(#{2,3})\s+(.+?)\s*#*\s*$/gm;

  const headings: Heading[] = [];
  const slugCounts = new Map<string, number>();

  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;

    const text = match[2]
        .replace(/\{[^}]*\}/g, "")
        .trim();

    if (!text) {
      continue;
    }

    const baseId = slugifyHeading(text);

    if (!baseId) {
      continue;
    }

    const count =
        (slugCounts.get(baseId) ?? 0) + 1;

    slugCounts.set(baseId, count);

    const id =
        count === 1
            ? baseId
            : `${baseId}-${count}`;

    headings.push({
      id,
      text,
      level,
    });
  }

  return headings;
}