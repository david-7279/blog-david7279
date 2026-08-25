import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { MDXRemote } from "next-mdx-remote/rsc";

import { PostCodeBlock } from "@/app/(blog)/[slug]/_components/content-blocks/post-code-block";

import { PostContentMotion } from "./post-content-motion";

type PostContentProps = {
  content: string;
  slug?: string;
};

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type SubheadingProps = ComponentPropsWithoutRef<"h3">;

/**
 * Generates a stable, URL-friendly id for article headings.
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
 * Custom MDX component mapping.
 *
 * `pre` is intentionally handled by PostCodeBlock so fenced
 * code blocks from MDX are rendered using the application's
 * custom Shiki-based CodeBlock component.
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
   * MDX fenced code blocks:
   *
   * ```tsx
   * const value = "hello";
   * ```
   *
   * are rendered as:
   *
   * <pre>
   *   <code className="language-tsx">...</code>
   * </pre>
   *
   * PostCodeBlock extracts the language and code and delegates
   * rendering to the reusable CodeBlock component.
   */
  pre: PostCodeBlock,
};

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
        "
      >
        <MDXRemote source={content} components={components} />
      </article>
    </PostContentMotion>
  );
}
