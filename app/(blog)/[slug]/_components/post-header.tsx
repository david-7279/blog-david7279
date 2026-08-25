"use client";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format-date";
import type { PostMeta } from "@/lib/posts";
import { AnimatePresence, motion } from "motion/react";
import { Separator } from "@/components/ui/separator";

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
    <header className="mb-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={post.slug ?? post.title}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.04,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-[1.15]"
          >
            {post.title}
          </motion.h1>

          {/* Meta */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              delay: 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col gap-3"
          >
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
              {post.author ? <span>{post.author}</span> : null}
              <span aria-hidden="true">•</span>
              <time dateTime={post.date} className="tabular-nums">
                {formatDate(post.date)}
              </time>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime} min read</span>
            </div>

            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-0.5">
                {post.tags.map((tag, index) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.14 + index * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Badge
                      variant="secondary"
                      className="h-6 rounded-lg px-2.5 py-1 text-xs font-normal"
                    >
                      {tag}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </header>
  );
}
