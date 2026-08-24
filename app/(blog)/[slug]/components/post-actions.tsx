"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Stats = {
  views: number;
  upvotes: number;
  voted?: boolean;
};

type PostActionsProps = {
  slug: string;
};

export function PostActions({ slug }: PostActionsProps) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function init() {
      const viewKey = `viewed:${slug}`;
      const alreadyViewed = localStorage.getItem(viewKey);

      // Incrementa view uma vez por browser
      if (!alreadyViewed) {
        await fetch("/api/views", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });
        localStorage.setItem(viewKey, "1");
      }

      // Stats atuais
      const res = await fetch(`/api/upvote/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    }

    init();
  }, [slug]);

  async function handleUpvote() {
    if (loading || !stats) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/upvote/${slug}`, {
        method: "POST",
      });

      if (!res.ok) return;

      const data = await res.json();
      setStats({
        views: data.views,
        upvotes: data.upvotes,
        voted: data.voted,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (!stats) {
    return (
      <div className="flex items-center gap-3 py-4">
        <p className="text-sm text-muted-foreground">
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

      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={handleUpvote}
        className={cn(
          "gap-2 transition-colors",
          stats.voted &&
            "bg-green-600 text-white border-green-600 hover:bg-green-700 hover:text-white",
        )}
      >
        <ThumbsUp className="h-4 w-4" />
        {stats.upvotes}
      </Button>
    </div>
  );
}
