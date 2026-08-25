import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { PostCodeBlock } from "@/app/(blog)/[slug]/_components/content-blocks/post-code-block";
import { PostContentMotion } from "./post-content-motion";
import {
  PostCodeTable,
  PostCodeTableBody,
  PostCodeTableCell,
  PostCodeTableHead,
  PostCodeTableHeader,
  PostCodeTableRow,
} from "@/app/(blog)/[slug]/_components/content-blocks/post-code-table";

type PostContentProps = {
  content: string;
  slug?: string;
};

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type SubheadingProps = ComponentPropsWithoutRef<"h3">;

/**
 * Generates a stable, URL-friendly id for article headings.
 *
 * Normalizes accents and special characters to create clean anchor links.
 *
 * Example:
 * "Como configurar o Next.js?"
 * -> "como-configurar-o-nextjs"
 */
function getHeadingId(children: ReactNode): string {
  return String(children)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Custom MDX component mapping for blog content.
 *
 * Maps standard HTML elements to custom React components:
 * - Headings (h2, h3) get stable IDs for deep linking
 * - Code blocks (pre) use custom Shiki-based PostCodeBlock
 * - Tables use custom PostCodeTable components for styling consistency
 *
 * All components are styled via Tailwind and arbitrary selectors to work
 * seamlessly with the prose class without conflicts.
 */
const components = {
  h2: ({ children, ...props }: HeadingProps) => {
    const id = getHeadingId(children);
    return (
      <h2
        id={id}
        className="
          mt-12 mb-4
          scroll-mt-28
          text-xl
          font-semibold
          tracking-tight
          text-foreground
          sm:text-2xl
        "
        {...props}
      >
        {children}
      </h2>
    );
  },
  h3: ({ children, ...props }: SubheadingProps) => {
    const id = getHeadingId(children);
    return (
      <h3
        id={id}
        className="
          mt-8 mb-3
          scroll-mt-28
          text-lg
          font-semibold
          tracking-tight
          text-foreground
        "
        {...props}
      >
        {children}
      </h3>
    );
  },
  /**
   * Fenced code blocks from MDX:
   *
   * ```tsx
   * const value = "hello";
   * ```
   *
   * are parsed as:
   *
   * <pre>
   *   <code className="language-tsx">...</code>
   * </pre>
   *
   * PostCodeBlock extracts language and code content, then delegates
   * to the reusable Shiki-based CodeBlock component for syntax highlighting.
   */
  pre: PostCodeBlock,
  /**
   * Table elements - mapped to custom components for consistent styling.
   *
   * Markdown tables in MDX content are automatically converted to:
   * <table><thead>...<tr><th></th></tr></thead><tbody>...<tr><td></td></tr></tbody></table>
   *
   * These custom components handle:
   * - Responsive horizontal scrolling on small screens
   * - Hover effects and visual hierarchy
   * - Consistent padding and typography
   * - Dark mode support
   */
  table: PostCodeTable,
  thead: PostCodeTableHead,
  tbody: PostCodeTableBody,
  tr: PostCodeTableRow,
  th: PostCodeTableHeader,
  td: PostCodeTableCell,
};

/**
 * PostContent renders MDX blog content with custom styling.
 *
 * Features:
 * - Responsive prose typography
 * - Custom syntax-highlighted code blocks
 * - Modern, minimal table styling
 * - Deep-linkable headings with stable IDs
 * - Smooth content transitions
 * - Dark mode support
 *
 * @param content - Raw MDX source string
 * @param slug - Article slug for transition animations (optional)
 */
export function PostContent({ content, slug }: PostContentProps) {
  return (
    <PostContentMotion contentKey={slug ?? content.slice(0, 32)}>
      <article
        className="
          prose
          prose-neutral
          mt-8
          max-w-none
          dark:prose-invert

          prose-headings:scroll-mt-28
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-p:leading-relaxed
          prose-p:text-muted-foreground

          prose-li:text-muted-foreground
          prose-li:my-1.5

          prose-strong:text-foreground

          prose-a:text-primary
          prose-a:no-underline
          prose-a:underline-offset-4
          hover:prose-a:underline

          prose-blockquote:border-l-primary/40
          prose-blockquote:text-muted-foreground

          prose-hr:border-border/60

          prose-img:rounded-xl

          prose-ul:my-5

          prose-code:text-foreground
          prose-code:before:content-none
          prose-code:after:content-none

          [&_table]:my-0
        "
      >
        <MDXRemote
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              development: false,
            },
          }}
        />
      </article>
    </PostContentMotion>
  );
}
