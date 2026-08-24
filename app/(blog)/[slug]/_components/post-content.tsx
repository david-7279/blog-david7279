import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";

type PostContentProps = {
  content: string;
};

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type SubheadingProps = ComponentPropsWithoutRef<"h3">;

/**
 * Generates a stable anchor ID from an MDX heading.
 *
 * The same normalization rules should be used by the table of contents
 * and rendered headings so internal links always resolve consistently.
 */
function getHeadingId(children: React.ReactNode): string {
  return String(children)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Custom MDX heading _components.
 *
 * Explicit heading IDs allow the table of contents and anchor links
 * to navigate directly to sections within the article.
 */
const components = {
  h2: ({ children, ...props }: HeadingProps) => {
    const id = getHeadingId(children);

    return (
      <h2 id={id} className="scroll-mt-28" {...props}>
        {children}
      </h2>
    );
  },

  h3: ({ children, ...props }: SubheadingProps) => {
    const id = getHeadingId(children);

    return (
      <h3 id={id} className="scroll-mt-28" {...props}>
        {children}
      </h3>
    );
  },
};

/**
 * Renders the MDX body of a blog post.
 *
 * MDX remains the source of truth for article content while this component
 * provides the presentation layer and custom rendering behavior required
 * by the blog UI.
 */
export function PostContent({ content }: PostContentProps) {
  return (
    <article
      className="
        prose prose-neutral dark:prose-invert
        mt-10 max-w-none
        prose-headings:font-semibold
        prose-ul:my-5
        prose-li:my-1.5
        prose-a:text-primary
      "
    >
      <MDXRemote source={content} components={components} />
    </article>
  );
}
