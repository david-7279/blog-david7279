import { Badge } from "@/components/ui/badge";
import type { PostMeta } from "@/lib/posts";

type PostHeaderProps = {
  post: PostMeta;
};

export function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-10">
      <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground mb-4">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
        <time dateTime={post.date}>
          {new Date(post.date).toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>

        <span className="text-border">·</span>

        <span>{post.readingTime}</span>

        {post.tags && post.tags.length > 0 && (
          <>
            <span className="text-border">·</span>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="font-normal">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
