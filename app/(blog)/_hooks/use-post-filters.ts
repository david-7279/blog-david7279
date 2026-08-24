"use client";

import { useMemo, useState } from "react";

import type { PostWithStats } from "@/lib/posts/types";

export type PostSortOption = "newest" | "oldest" | "votes" | "title";

export type PostFilterState = {
  sort: PostSortOption;
  dateFrom: string;
  dateTo: string;
  readingTimeMin: number | null;
  readingTimeMax: number | null;
  tags: string[];
};

type UsePostFiltersOptions = {
  posts: PostWithStats[];
};

type UsePostFiltersResult = {
  filters: PostFilterState;
  filteredPosts: PostWithStats[];
  availableTags: string[];
  setSort: (sort: PostSortOption) => void;
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setReadingTimeMin: (value: number | null) => void;
  setReadingTimeMax: (value: number | null) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

const DEFAULT_FILTERS: PostFilterState = {
  sort: "newest",
  dateFrom: "",
  dateTo: "",
  readingTimeMin: null,
  readingTimeMax: null,
  tags: [],
};

/**
 * Provides client-side filtering and sorting for blog posts.
 *
 * Filtering is performed against the already-loaded post collection,
 * avoiding additional database requests for every filter interaction.
 */
export function usePostFilters({
  posts,
}: UsePostFiltersOptions): UsePostFiltersResult {
  const [filters, setFilters] = useState<PostFilterState>(DEFAULT_FILTERS);

  const availableTags = useMemo(() => {
    const tags = new Set<string>();

    for (const post of posts) {
      for (const tag of post.tags) {
        tags.add(tag);
      }
    }

    return Array.from(tags).sort((a, b) => a.localeCompare(b));
  }, [posts]);

  const filteredPosts = useMemo(() => {
    const result = posts.filter((post) => {
      const postDate = new Date(post.date).getTime();

      // Date range
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();

        if (postDate < from) {
          return false;
        }
      }

      if (filters.dateTo) {
        const to = new Date(filters.dateTo);

        // Include the entire selected day.
        to.setHours(23, 59, 59, 999);

        if (postDate > to.getTime()) {
          return false;
        }
      }

      // Reading time range
      if (
        filters.readingTimeMin !== null &&
        post.readingTime < filters.readingTimeMin
      ) {
        return false;
      }

      if (
        filters.readingTimeMax !== null &&
        post.readingTime > filters.readingTimeMax
      ) {
        return false;
      }

      // Tags
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some((tag) =>
          post.tags.includes(tag),
        );

        if (!hasMatchingTag) {
          return false;
        }
      }

      return true;
    });

    return result.sort((a, b) => {
      switch (filters.sort) {
        case "oldest":
          return new Date(a.date).getTime() - new Date(b.date).getTime();

        case "votes":
          return b.upvotes - a.upvotes;

        case "title":
          return a.title.localeCompare(b.title);

        case "newest":
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });
  }, [posts, filters]);

  const setSort = (sort: PostSortOption) => {
    setFilters((current) => ({
      ...current,
      sort,
    }));
  };

  const setDateFrom = (dateFrom: string) => {
    setFilters((current) => ({
      ...current,
      dateFrom,
    }));
  };

  const setDateTo = (dateTo: string) => {
    setFilters((current) => ({
      ...current,
      dateTo,
    }));
  };

  const setReadingTimeMin = (readingTimeMin: number | null) => {
    setFilters((current) => ({
      ...current,
      readingTimeMin,
    }));
  };

  const setReadingTimeMax = (readingTimeMax: number | null) => {
    setFilters((current) => ({
      ...current,
      readingTimeMax,
    }));
  };

  const toggleTag = (tag: string) => {
    setFilters((current) => {
      const selected = current.tags.includes(tag);

      return {
        ...current,
        tags: selected
          ? current.tags.filter((item) => item !== tag)
          : [...current.tags, tag],
      };
    });
  };

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const hasActiveFilters =
    filters.sort !== "newest" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    filters.readingTimeMin !== null ||
    filters.readingTimeMax !== null ||
    filters.tags.length > 0;

  return {
    filters,
    filteredPosts,
    availableTags,
    setSort,
    setDateFrom,
    setDateTo,
    setReadingTimeMin,
    setReadingTimeMax,
    toggleTag,
    clearFilters,
    hasActiveFilters,
  };
}
