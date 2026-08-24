import { Badge } from "@/components/ui/badge";

import { formatDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";

type PostHeaderProps = {
  post: PostMeta;
};

/**
 * Renders the primary metadata header for a blog post.
 *
 * The component is intentionally presentation-focused. Date formatting
 * is delegated to the shared `formatDate` utility so locale and formatting
 * rules remain consistent across the application.
 */
export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8">
      <h1 className="mb-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {post.title}
      </h1>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center gap-2">
          <time dateTime={post.date}>{formatDate(post.date)}</time>

          <span className="text-border" aria-hidden="true">
            ·
          </span>

          <span>{post.readingTime} min read</span>
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
