"use client";

import { useMemo, useState } from "react";

import type { PostWithStats } from "@/lib/posts/types";

type UsePostSearchOptions = {
  posts: PostWithStats[];
};

type UsePostSearchResult = {
  query: string;
  setQuery: (query: string) => void;
  filteredPosts: PostWithStats[];
  hasResults: boolean;
};

/**
 * Provides client-side search functionality for blog posts.
 *
 * Search is performed against post titles, descriptions, tags, and authors.
 * The filtering operation is memoized so the post collection is only
 * recalculated when the source posts or search query changes.
 */
export function usePostSearch({
  posts,
}: UsePostSearchOptions): UsePostSearchResult {
  const [query, setQuery] = useState("");

  const normalizedQuery = query.trim().toLocaleLowerCase();

  const filteredPosts = useMemo(() => {
    if (!normalizedQuery) {
      return posts;
    }

    return posts.filter((post) => {
      const searchableContent = [
        post.title,
        post.description,
        post.author,
        ...post.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchableContent.includes(normalizedQuery);
    });
  }, [posts, normalizedQuery]);

  return {
    query,
    setQuery,
    filteredPosts,
    hasResults: filteredPosts.length > 0,
  };
}
