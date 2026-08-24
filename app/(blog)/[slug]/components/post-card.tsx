"use client";

import Link from "next/link";
import type { PostWithStats } from "@/lib/posts/types";
import { paths } from "@/lib/paths";
import { formatDate } from "@/lib/format-date";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  FlagIcon,
  Share2Icon,
  ThumbsUpIcon,
} from "lucide-react";
import { RollingTextButton } from "@/components/ui/rolling-text-button";
import { toast } from "@/components/ui/toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Separator } from "@/components/ui/separator";

type PostCardProps = {
  post: PostWithStats;
};

async function copyArticleLink(slug: string) {
  const url = `${window.location.origin}${paths.post(slug)}`;

  try {
    await navigator.clipboard.writeText(url);
    const id = toast.add({
      title: "Article copied",
      description: "Share with everyone how is gonna be interesting",
      actionProps: {
        onClick() {
          toast.close(id);
        },
      },
    });
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = url;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();

    try {
      document.execCommand("copy");
      const id = toast.add({
        title: "Article copied",
        description: "Share with everyone how is gonna be interesting",
        actionProps: {
          onClick() {
            toast.close(id);
          },
        },
      });
    } catch {
      toast.add({
        title: "Failed to copy",
        description: "Please try again",
      });
    } finally {
      document.body.removeChild(textArea);
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={paths.post(post.slug)} className="block">
      <Card className="border-border shadow-xs rounded-[32px] bg-card py-2.5">
        <CardHeader className="px-2.5">
          <Card className="border-none ring-0 shadow-none rounded-[32px] bg-background p-8 space-y-1">
            <div className="flex flex-row justify-between gap-1">
              <div className="flex flex-col flex-wrap gap-2">
                {/* Author & Date */}
                <div className="flex items-center gap-2 text-xs font-sans text-muted-foreground tracking-wide">
                  <span>{post.author}</span>
                  <span>•</span>
                  <time>{formatDate(post.date)}</time>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold tracking-tight text-foreground group-hover:text-foreground/80 transition-colors line-clamp-2">
                  {post.title}
                </h2>
              </div>

              {/* Dropdown */}
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <DropdownMenu>
                  <DropdownMenuTrigger className="cursor-pointer">
                    <Button
                      variant="ghost"
                      className="hover:rounded-[8px] px-2"
                    >
                      <EllipsisVerticalIcon
                        size={16}
                        className="text-muted-foreground"
                      />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent className="w-36" align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Link
                        href={paths.post(post.slug)}
                        className="flex items-center gap-2"
                      >
                        <EyeIcon size={16} className="text-muted-foreground" />
                        Read
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => copyArticleLink(post.slug)}
                      className="cursor-pointer"
                    >
                      <Share2Icon size={16} className="text-muted-foreground" />
                      Share
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                      variant="destructive"
                      className="cursor-pointer"
                    >
                      <FlagIcon size={16} className="text-muted-foreground" />
                      Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Description */}
            {post.description && (
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {post.description}
              </p>
            )}

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="rounded-lg px-2.5 py-1 h-6 text-xs font-normal"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Stats */}
            <div className="flex flex-row items-center gap-3">
              <div className="flex items-center gap-1">
                <ThumbsUpIcon size={16} className="text-muted-foreground" />
                <NumberTicker
                  value={post.upvotes}
                  className="text-sm text-muted-foreground tracking-tighter"
                />
              </div>

              <Separator orientation="vertical" />

              <div className="flex items-center gap-1">
                <ClockIcon size={16} className="text-muted-foreground" />
                <NumberTicker
                  value={post.readingTime}
                  className="text-sm text-muted-foreground tracking-tighter"
                />
                <p className="text-sm text-muted-foreground">min read</p>
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
