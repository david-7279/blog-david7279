"use client";

import Link from "next/link";
import type { PostMeta } from "@/lib/posts";
import { paths } from "@/lib/paths";
import { formatDate } from "@/lib/format-date";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import { RollingTextButton } from "@/components/ui/rolling-text-button";

type PostCardProps = {
  post: PostMeta;
  variant?: "default" | "compact" | "minimal" | "featured";
};

/**
 * PostCard component with multiple layout variants
 *
 * Variants:
 * - default: Standard blog card with all information
 * - compact: Condensed version for sidebar/related posts
 * - minimal: Ultra-minimal for listings
 * - featured: Large featured post variant
 */
export function PostCard({ post, variant = "default" }: PostCardProps) {
  if (variant === "compact") {
    return <CompactPostCard post={post} />;
  }

  if (variant === "minimal") {
    return <MinimalPostCard post={post} />;
  }

  if (variant === "featured") {
    return <FeaturedPostCard post={post} />;
  }

  return <DefaultPostCard post={post} />;
}

/**
 * Default variant: Full featured card with date, title, description, tags, and button
 * Best for: Main blog listing
 */
function DefaultPostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={paths.post(post.slug)} className="group block">
      <Card className="border-border shadow-none transition-al hover:shadow-md hover:bg-muted/5">
        <CardContent className="relative p-6">
          {/* Content wrapper with padding for button space */}
          <div className="flex flex-col gap-4 pr-12">
            {/* Date */}
            <time className="text-xs font-sans text-muted-foreground tracking-wide">
              {formatDate(post.date)}
            </time>

            {/* Title - limited to 2 lines */}
            <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {/* Description - limited to 3 lines */}
            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.description}
              </p>
            )}

            {/* Tags - wrap with flex */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-md px-2.5 py-0.5 text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="pt-2">
              <RollingTextButton
                href={paths.post(post.slug)}
                title="Read article"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Compact variant: Minimal card for sidebars and related posts
 * Best for: Sidebars, related posts, "Read more" sections
 * Width: Usually ~300px or less
 */
function CompactPostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={paths.post(post.slug)} className="group block">
      <Card className="border-border shadow-none transition-all hover:bg-muted/5">
        <CardContent className="p-4">
          <div className="space-y-3">
            {/* Date */}
            <time className="text-xs text-muted-foreground">
              {formatDate(post.date)}
            </time>

            {/* Title - limited to 2 lines for compact space */}
            <h3 className="text-sm font-medium text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
              {post.title}
            </h3>

            {/* Only show first tag if space is limited */}
            {post.tags && post.tags.length > 0 && (
              <Badge variant="secondary" className="text-xs px-2 py-1">
                {post.tags[0]}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/**
 * Minimal variant: Ultra-simple list item style
 * Best for: Long lists, search results, archives
 * No padding, just typography
 */
function MinimalPostCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={paths.post(post.slug)}
      className="group flex items-baseline justify-between gap-4 py-3 border-b border-border hover:bg-muted/50 px-2 -mx-2 transition-colors"
    >
      <div className="flex-1 min-w-0">
        {/* Title */}
        <h3 className="font-medium text-foreground group-hover:underline truncate">
          {post.title}
        </h3>

        {/* Date - secondary info */}
        <time className="text-xs text-muted-foreground">
          {formatDate(post.date)}
        </time>
      </div>

      {/* Arrow - always visible */}
      <ArrowUpRight className="size-4 text-muted-foreground flex-shrink-0 group-hover:text-foreground group-hover:rotate-45 transition-all" />
    </Link>
  );
}

/**
 * Featured variant: Large card for hero/spotlight posts
 * Best for: Homepage featured posts, trending sections
 * Takes full width with enhanced styling
 */
function FeaturedPostCard({ post }: { post: PostMeta }) {
  return (
    <Link href={paths.post(post.slug)} className="group block">
      <Card className="border-border shadow-sm hover:shadow-lg transition-all hover:bg-muted/5 overflow-hidden">
        <CardContent className="relative p-8">
          {/* Featured badge */}
          <div className="mb-4 inline-flex">
            <Badge
              variant="default"
              className="bg-amber-500/20 text-amber-700 border-amber-200"
            >
              Featured
            </Badge>
          </div>

          {/* Content with space for button */}
          <div className="flex flex-col gap-5 pr-14">
            {/* Date */}
            <time className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
              {formatDate(post.date)}
            </time>

            {/* Title - can be longer in featured */}
            <h2 className="text-3xl font-bold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors line-clamp-3">
              {post.title}
            </h2>

            {/* Full description */}
            {post.description && (
              <p className="text-base text-muted-foreground leading-relaxed line-clamp-4">
                {post.description}
              </p>
            )}

            {/* All tags for featured */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-3">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="px-3 py-1 text-xs font-medium"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* CTA text */}
            <p className="text-sm font-medium text-foreground/70 group-hover:text-foreground transition-colors pt-2">
              Read Article →
            </p>
          </div>

          {/* Large arrow button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-8 top-8 size-12 rounded-full opacity-70 transition-all group-hover:opacity-100 group-hover:rotate-45 group-hover:bg-muted/60"
            aria-label={`Read "${post.title}"`}
            onClick={(e) => e.preventDefault()}
          >
            <ArrowUpRight className="size-6" />
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
}
