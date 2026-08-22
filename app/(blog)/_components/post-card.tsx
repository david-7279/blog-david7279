import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { paths } from "@/lib/paths";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link
      href={paths.post(post.slug)}
      className="group block py-5 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/30 -mx-3 px-3 rounded-lg"
    >
      <div className="flex items-baseline justify-between gap-6">
        <div className="space-y-1.5 min-w-0">
          <h2 className="text-lg font-medium text-foreground group-hover:text-foreground/80 transition-colors truncate">
            {post.title}
          </h2>

          {post.description && (
            <p className="text-sm text-muted-foreground line-clamp-1">
              {post.description}
            </p>
          )}
        </div>

        <time className="text-sm text-muted-foreground/70 whitespace-nowrap tabular-nums">
          {new Date(post.date).toLocaleDateString("pt-PT", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </div>
    </Link>
  );
}
