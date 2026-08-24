"use client";

import { useMemo, useState } from "react";

import type { PostWithStats } from "@/lib/posts/types";

export type PostSortOption =
  | "none"
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "votes-desc"
  | "votes-asc";

type UsePostFilterSortOptions = {
  posts: PostWithStats[];
};

type UsePostFilterSortResult = {
  sort: PostSortOption;
  sortedPosts: PostWithStats[];
  setSort: (sort: PostSortOption) => void;
  resetSort: () => void;
  hasActiveSort: boolean;
};

const DEFAULT_SORT: PostSortOption = "none";

export function usePostFilterSort({
  posts,
}: UsePostFilterSortOptions): UsePostFilterSortResult {
  const [sort, setSort] = useState<PostSortOption>(DEFAULT_SORT);

  const sortedPosts = useMemo(() => {
    if (sort === "none") {
      return posts;
    }

    return [...posts].sort((a, b) => {
      switch (sort) {
        case "newest":
          return new Date(b.date).getTime() - new Date(a.date).getTime();

        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();

        case "title-asc":
          return a.title.localeCompare(b.title);

        case "title-desc":
          return b.title.localeCompare(a.title);

        case "votes-desc":
          return b.upvotes - a.upvotes;

        case "votes-asc":
          return a.upvotes - b.upvotes;

        default:
          return 0;
      }
    });
  }, [posts, sort]);

  const resetSort = () => {
    setSort(DEFAULT_SORT);
  };

  return {
    sort,
    sortedPosts,
    setSort,
    resetSort,
    hasActiveSort: sort !== DEFAULT_SORT,
  };
}
