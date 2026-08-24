"use client";

import { useEffect, useState } from "react";
import { Eye, ThumbsUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
      <div
        className="flex items-center gap-3 border-y border-border/40 py-4"
        aria-live="polite"
      >
        <p className="text-sm text-muted-foreground">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 border-y border-border/40 py-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" aria-hidden="true" />

        <span>
          {stats.views} {stats.views === 1 ? "view" : "views"}
        </span>
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isVoting}
        aria-pressed={stats.voted}
        aria-label={stats.voted ? "Remove your upvote" : "Upvote this post"}
        onClick={handleUpvote}
        className={cn(
          "gap-2 transition-colors",
          stats.voted &&
            "border-green-600 bg-green-600 text-white hover:bg-green-700 hover:text-white",
        )}
      >
        <ThumbsUp className="h-4 w-4" aria-hidden="true" />

        <span>{stats.upvotes}</span>
      </Button>
    </div>
  );
}
