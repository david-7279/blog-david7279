import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { paths } from "@/lib/paths";
import { formatDate } from "@/lib/format-date";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";

type PostCardProps = {
  post: PostMeta;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={paths.post(post.slug)} className="group block">
      <Card className="border-border shadow-none transition-colors hover:bg-muted/10">
        <CardContent className="relative">
          <div className="space-y-4">
            <time className="text-xs text-muted-foreground">
              {formatDate(post.date)}
            </time>

            <h2 className="text-xl font-medium tracking-tight text-foreground group-hover:text-foreground/80 transition-colors">
              {post.title}
            </h2>

            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.description}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-md px-2.5 py-0.5 text-xs font-normal text-muted-foreground"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Button
            variant="secondary"
            size="icon"
            className="absolute right-6 top-1/2 -translate-y-1/2 size-9 rounded-full opacity-80 transition-all group-hover:opacity-100 group-hover:rotate-45 cursor-pointer"
          >
            <span>
              <ArrowUpRight className="size-4" />
            </span>
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
