"use client";

import { useMemo, useState } from "react";

import type { PostWithStats } from "@/lib/posts/types";

type UsePostFilterTagOptions = {
  posts: PostWithStats[];
};

type UsePostFilterTagResult = {
  selectedTags: string[];
  availableTags: string[];
  toggleTag: (tag: string) => void;
  resetTags: () => void;
  hasActiveTags: boolean;
};

/**
 * Manages tag selection for the blog post collection.
 *
 * Available tags are derived from the current post collection, while
 * selected tags remain local UI state.
 */
export function usePostFilterTag({
  posts,
}: UsePostFilterTagOptions): UsePostFilterTagResult {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    for (const post of posts) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }

    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const toggleTag = (tag: string) => {
    setSelectedTags((current) => {
      if (current.includes(tag)) {
        return current.filter((item) => item !== tag);
      }

      return [...current, tag];
    });
  };

  const resetTags = () => {
    setSelectedTags([]);
  };

  return {
    selectedTags,
    availableTags,
    toggleTag,
    resetTags,
    hasActiveTags: selectedTags.length > 0,
  };
}
