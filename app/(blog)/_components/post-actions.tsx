"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsDown, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import type { VoteType } from "@/lib/stats";

type Stats = {
  views: number;
  upvotes: number;
  downVotes: number;
};

type PostActionsProps = {
  slug: string;
};

export function PostActions({ slug }: PostActionsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [userVote, setUserVote] = useState<VoteType>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const viewKey = `viewed:${slug}`;
      const alreadyViewed = localStorage.getItem(viewKey);

      // Só incrementa view uma vez por dispositivo
      if (!alreadyViewed) {
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        localStorage.setItem(viewKey, "1");
      }

      // Busca stats
      const res = await fetch(`/api/views?slug=${slug}`);
      const data = await res.json();
      setStats(data);

      // Lê voto guardado
      const saved = localStorage.getItem(`vote:${slug}`) as VoteType;
      if (saved === "up" || saved === "down") {
        setUserVote(saved);
      }
    }

    init();
  }, [slug]);

  async function handleVote(type: "up" | "down") {
    if (loading || !stats) return;

    setLoading(true);

    const previous = userVote;
    const next: VoteType = userVote === type ? null : type;

    try {
      const res = await fetch(`/api/upvote/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: next, previous }),
      });

      const data = await res.json();

      setStats((prev) =>
        prev
          ? { ...prev, upvotes: data.upvotes, downVotes: data.downVotes }
          : null,
      );

      setUserVote(next);

      if (next) {
        localStorage.setItem(`vote:${slug}`, next);
      } else {
        localStorage.removeItem(`vote:${slug}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!stats) {
    return (
      <div className="flex items-center gap-3 py-4">
        <p className="text-sm text-muted-foreground shimmer">
          A carregar estatísticas...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-4 py-4 border-y border-border/40">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Eye className="h-4 w-4" />
        <span>{stats.views} views</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => handleVote("up")}
          className={cn(
            "gap-2 transition-colors",
            userVote === "up" &&
              "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:text-white",
          )}
        >
          <ThumbsUp className="h-4 w-4" />
          {stats.upvotes}
        </Button>

        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => handleVote("down")}
          className={cn(
            "gap-2 transition-colors",
            userVote === "down" &&
              "bg-red-600 text-white border-red-600 hover:bg-red-700 hover:text-white",
          )}
        >
          <ThumbsDown className="h-4 w-4" />
          {stats.downVotes}
        </Button>
      </div>
    </div>
  );
}
