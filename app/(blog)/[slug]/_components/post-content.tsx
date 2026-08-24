import type { ComponentPropsWithoutRef } from "react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { PostContentMotion } from "./post-content-motion";

type PostContentProps = {
  content: string;
  slug?: string;
};

type HeadingProps = ComponentPropsWithoutRef<"h2">;
type SubheadingProps = ComponentPropsWithoutRef<"h3">;

function getHeadingId(children: React.ReactNode): string {
  return String(children)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-");
}

const components = {
  h2: ({ children, ...props }: HeadingProps) => {
    const id = getHeadingId(children);
    return (
      <h2
        id={id}
        className="scroll-mt-28 mt-12 mb-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
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
        className="scroll-mt-28 mt-8 mb-3 text-lg font-semibold tracking-tight text-foreground"
        {...props}
      >
        {children}
      </h3>
    );
  },
};

/**
 * Renders the MDX body of a blog post.
 */
export function PostContent({ content, slug }: PostContentProps) {
  return (
    <PostContentMotion contentKey={slug ?? content.slice(0, 32)}>
      <article
        className="
          prose prose-neutral dark:prose-invert
          mt-8 max-w-none
          prose-headings:scroll-mt-28
          prose-headings:font-semibold
          prose-headings:tracking-tight
          prose-p:leading-relaxed
          prose-p:text-muted-foreground
          prose-li:text-muted-foreground
          prose-strong:text-foreground
          prose-a:text-primary prose-a:no-underline prose-a:underline-offset-4 hover:prose-a:underline
          prose-code:rounded-md prose-code:text-muted-foreground prose-code:px-1.5 prose-code:py-0.5 prose-code:text-[0.9em] prose-code:before:content-none prose-code:after:content-none
          prose-pre:rounded-xl prose-pre:border prose-pre:border-border/60 prose-pre:bg-muted/50
          prose-blockquote:border-l-primary/40 prose-blockquote:text-muted-foreground
          prose-hr:border-border/60
          prose-img:rounded-xl
          prose-ul:my-5
          prose-li:my-1.5
        "
      >
        <MDXRemote source={content} components={components} />
      </article>
    </PostContentMotion>
  );
}
