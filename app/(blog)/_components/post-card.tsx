"use client";

import Link from "next/link";
import {
  ClockIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FlagIcon,
  Share2Icon,
  ThumbsUpIcon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NumberTicker } from "@/components/ui/number-ticker";
import { RollingTextButton } from "@/components/ui/rolling-text-button";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/toast";

import { formatDate } from "@/lib/format-date";
import { paths } from "@/lib/paths";
import type { PostWithStats } from "@/lib/posts/types";

type PostCardProps = {
  post: PostWithStats;
};

const COPY_SUCCESS_TITLE = "Article copied";
const COPY_SUCCESS_DESCRIPTION =
  "Share this article with anyone who might find it interesting.";
const COPY_ERROR_TITLE = "Failed to copy";
const COPY_ERROR_DESCRIPTION = "Please try again.";

/**
 * Copies the canonical URL for a post to the clipboard.
 *
 * Uses the modern Clipboard API when available and falls back to the
 * legacy textarea-based implementation for unsupported environments.
 */
async function copyArticleLink(slug: string): Promise<void> {
  const url = `${window.location.origin}${paths.post(slug)}`;

  try {
    await navigator.clipboard.writeText(url);

    showCopySuccessToast();
  } catch {
    const textArea = document.createElement("textarea");

    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.setAttribute("aria-hidden", "true");

    document.body.appendChild(textArea);
    textArea.select();

    try {
      const copied = document.execCommand("copy");

      if (!copied) {
        throw new Error("Clipboard fallback failed.");
      }

      showCopySuccessToast();
    } catch {
      toast.add({
        title: COPY_ERROR_TITLE,
        description: COPY_ERROR_DESCRIPTION,
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

/**
 * Displays the confirmation toast after a successful copy operation.
 */
function showCopySuccessToast(): void {
  const id = toast.add({
    title: COPY_SUCCESS_TITLE,
    description: COPY_SUCCESS_DESCRIPTION,
    actionProps: {
      onClick() {
        toast.close(id);
      },
    },
  });
}

/**
 * Displays a blog post summary with metadata, engagement statistics,
 * and contextual actions.
 *
 * The visual design of this component is intentionally kept independent
 * from the post data layer. The card receives fully resolved post data
 * and is only responsible for presentation and user interactions.
 */
export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={paths.post(post.slug)} className="block">
      <Card className="rounded-[32px] border-border bg-card py-2.5 shadow-xs">
        <CardHeader className="px-2.5">
          <Card className="space-y-1 rounded-[32px] border-none bg-background p-8 shadow-none ring-0">
            <div className="flex flex-row justify-between gap-1">
              <div className="flex min-w-0 flex-col flex-wrap gap-2">
                {/* Author and publication date */}
                <div className="flex items-center gap-2 font-sans text-xs tracking-wide text-muted-foreground">
                  <span>{post.author}</span>

                  <span aria-hidden="true">•</span>

                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </div>

                {/* Post title */}
                <Link
                  href={paths.post(post.slug)}
                  className="group"
                  aria-label={`Read ${post.title}`}
                >
                  <h2 className="line-clamp-2 text-xl font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/80">
                    {post.title}
                  </h2>
                </Link>
              </div>

              {/* Post actions */}
              <div
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      type="button"
                      variant="ghost"
                      className="cursor-pointer px-2 hover:rounded-[8px]"
                      aria-label={`More actions for ${post.title}`}
                    >
                      <EllipsisVerticalIcon
                        size={16}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-36" align="end">
                    <DropdownMenuItem>
                      <Link
                        href={paths.post(post.slug)}
                        className="flex cursor-pointer items-center gap-2"
                      >
                        <EyeIcon
                          size={16}
                          className="text-muted-foreground"
                          aria-hidden="true"
                        />
                        Read
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => copyArticleLink(post.slug)}
                    >
                      <Share2Icon
                        size={16}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                      Share
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <FlagIcon
                        size={16}
                        className="text-muted-foreground"
                        aria-hidden="true"
                      />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Post description */}
            {post.description && (
              <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {post.description}
              </p>
            )}

            {/* Post tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="h-6 rounded-lg px-2.5 py-1 text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Engagement and reading statistics */}
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-1">
                <ThumbsUpIcon
                  size={16}
                  className="text-muted-foreground"
                  aria-hidden="true"
                />

                <NumberTicker
                  value={post.upvotes}
                  className="text-sm tracking-tighter text-muted-foreground"
                />
              </div>

              <Separator orientation="vertical" />

              <div className="flex items-center gap-1">
                <ClockIcon
                  size={16}
                  className="text-muted-foreground"
                  aria-hidden="true"
                />

                <NumberTicker
                  value={post.readingTime}
                  className="text-sm tracking-tighter text-muted-foreground"
                />

                <span className="text-sm text-muted-foreground">min read</span>
              </div>
            </div>
          </Card>
        </CardHeader>

        <CardContent className="p-3 px-10">
          <RollingTextButton
            href={paths.post(post.slug)}
            title="Read article"
            className="w-full rounded-[12px]"
          />
        </CardContent>
      </Card>
    </Link>
  );
}
