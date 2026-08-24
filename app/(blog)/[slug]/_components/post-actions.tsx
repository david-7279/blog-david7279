"use client";

import { useEffect, useState } from "react";
import { EyeIcon, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Spinner } from "@/components/ui/spinner";

type PostStats = {
  views: number;
  upvotes: number;
  voted: boolean;
};

type PostActionsProps = {
  slug: string;
};

const VIEW_STORAGE_PREFIX = "blog:viewed:";

/**
 * Builds the localStorage key used to track whether this browser
 * has already registered a view for the specified post.
 *
 * View tracking is intentionally browser-based and should not be
 * treated as authoritative analytics.
 */
function getViewStorageKey(slug: string): string {
  return `${VIEW_STORAGE_PREFIX}${slug}`;
}

/**
 * Fetches the current post engagement statistics.
 *
 * The upvote endpoint also returns the current visitor's vote state,
 * which allows the UI to render the correct button state.
 */
async function fetchPostStats(slug: string): Promise<PostStats> {
  const response = await fetch(`/api/upvote/${encodeURIComponent(slug)}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch post statistics: ${response.status}`);
  }

  return response.json();
}

export function PostActions({ slug }: PostActionsProps) {
  const [stats, setStats] = useState<PostStats | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isVoting, setIsVoting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        const viewStorageKey = getViewStorageKey(slug);
        const hasViewed = localStorage.getItem(viewStorageKey) === "1";

        /**
         * Register one view per browser for this post.
         *
         * The server remains responsible for the actual counter update.
         * localStorage only prevents repeated requests from the same
         * browser during the local tracking window.
         */
        if (!hasViewed) {
          const response = await fetch(
            `/api/views/${encodeURIComponent(slug)}`,
            {
              method: "POST",
              cache: "no-store",
            },
          );

          if (response.ok) {
            localStorage.setItem(viewStorageKey, "1");
          }
        }

        /**
         * Fetch the latest statistics after attempting to register
         * the view so the UI reflects the most recent counter value.
         */
        const latestStats = await fetchPostStats(slug);

        if (!cancelled) {
          setStats(latestStats);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to initialize post actions:", error);
        }
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    }

    void initialize();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  /**
   * Toggles the current visitor's upvote.
   *
   * The server is the source of truth for the resulting statistics
   * and vote state. The client simply replaces its local state with
   * the server response.
   */
  async function handleUpvote(): Promise<void> {
    if (isVoting || !stats) {
      return;
    }

    setIsVoting(true);

    try {
      const response = await fetch(`/api/upvote/${encodeURIComponent(slug)}`, {
        method: "POST",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`Failed to toggle upvote: ${response.status}`);
      }

      const updatedStats: PostStats = await response.json();

      setStats(updatedStats);
    } catch (error) {
      console.error("Failed to toggle post upvote:", error);
    } finally {
      setIsVoting(false);
    }
  }

  if (isInitializing || !stats) {
    return (
      <div className="flex flex-row items-center gap-3 py-4" aria-live="polite">
        <Spinner />
        <p className="text-sm text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {isInitializing || !stats ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-3"
          aria-live="polite"
        >
          <div className="h-4 w-16 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
        </motion.div>
      ) : (
        <motion.div
          key="stats"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center gap-3"
        >
          {/* Views */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-2 py-1 text-sm text-muted-foreground">
            <EyeIcon className="size-3.5 shrink-0" aria-hidden="true" />
            <span className="tabular-nums tracking-tight">{stats.views}</span>
            <span className="text-muted-foreground/80">
              {stats.views === 1 ? "view" : "views"}
            </span>
          </div>

          {/* Upvote */}
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 22 }}
          >
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isVoting}
              aria-pressed={stats.voted}
              aria-label={
                stats.voted ? "Remove your upvote" : "Upvote this post"
              }
              onClick={handleUpvote}
              className={cn(
                "gap-2 rounded-full px-3.5 transition-colors duration-200",
                stats.voted ? "border-primary" : "",
              )}
            >
              <motion.span
                key={stats.voted ? "voted" : "idle"}
                initial={{ scale: 0.8, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
                className="inline-flex"
              >
                <ThumbsUp
                  className={cn(
                    "size-3.5 shrink-0",
                    stats.voted ? "text-foreground" : "text-muted-foreground",
                  )}
                  aria-hidden="true"
                />
              </motion.span>

              <motion.span
                key={stats.upvotes}
                initial={{ y: 4, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.18 }}
                className="tabular-nums tracking-tight"
              >
                {stats.upvotes}
              </motion.span>
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
