"use client";

import { useMemo, useState } from "react";

import type { PostWithStats } from "@/lib/posts/types";

import {
  usePostFilterRange,
  type PostReadingTimeRange,
} from "./use-post-filter-range";

import { usePostFilterSort, type PostSortOption } from "./use-post-filter-sort";

import { usePostFilterTag } from "./use-post-filter-tag";

export type PostFilterState = {
  dateFrom: string;
  dateTo: string;
};

type UsePostFiltersOptions = {
  posts: PostWithStats[];
};

type UsePostFiltersResult = {
  filters: PostFilterState;
  sort: PostSortOption;
  readingTimeRange: PostReadingTimeRange;
  filteredPosts: PostWithStats[];
  availableTags: string[];
  selectedTags: string[];
  setDateFrom: (date: string) => void;
  setDateTo: (date: string) => void;
  setSort: (sort: PostSortOption) => void;
  setReadingTimeRange: (range: PostReadingTimeRange) => void;
  toggleTag: (tag: string) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
};

/**
 * Coordinates all blog filtering concerns.
 *
 * Individual filter types are delegated to dedicated hooks. This hook
 * is responsible for combining their state and applying the resulting
 * criteria to the post collection.
 */
export function usePostFilters({
  posts,
}: UsePostFiltersOptions): UsePostFiltersResult {
  const [filters, setFilters] = useState<PostFilterState>({
    dateFrom: "",
    dateTo: "",
  });

  const { sort, sortedPosts, setSort, resetSort } = usePostFilterSort({
    posts,
  });

  const {
    range: readingTimeRange,
    setRange: setReadingTimeRange,
    resetRange,
    hasActiveRange,
  } = usePostFilterRange();

  const { selectedTags, availableTags, toggleTag, resetTags, hasActiveTags } =
    usePostFilterTag({
      posts,
    });

  /**
   * Applies date, reading-time, and tag filters.
   *
   * Sorting is intentionally handled by `usePostFilterSort` after the
   * filtering stage.
   */
  const filteredPosts = useMemo(() => {
    const result = sortedPosts.filter((post) => {
      const postDate = new Date(post.date).getTime();

      /**
       * Publication date — lower boundary.
       */
      if (filters.dateFrom) {
        const from = new Date(filters.dateFrom).getTime();

        if (postDate < from) {
          return false;
        }
      }

      /**
       * Publication date — upper boundary.
       *
       * The entire selected day is included.
       */
      if (filters.dateTo) {
        const to = new Date(filters.dateTo);

        to.setHours(23, 59, 59, 999);

        if (postDate > to.getTime()) {
          return false;
        }
      }

      /**
       * Reading-time range.
       */
      if (
        readingTimeRange.min !== null &&
        post.readingTime < readingTimeRange.min
      ) {
        return false;
      }

      if (
        readingTimeRange.max !== null &&
        post.readingTime > readingTimeRange.max
      ) {
        return false;
      }

      /**
       * Tags use OR semantics.
       *
       * A post is included when it contains at least one selected tag.
       */
      if (selectedTags.length > 0) {
        const matchesTag = selectedTags.some((tag) => post.tags.includes(tag));

        if (!matchesTag) {
          return false;
        }
      }

      return true;
    });

    return result;
  }, [
    sortedPosts,
    filters.dateFrom,
    filters.dateTo,
    readingTimeRange,
    selectedTags,
  ]);

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

  const clearFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
    });

    resetSort();
    resetRange();
    resetTags();
  };

  const hasActiveFilters =
    sort !== "none" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "" ||
    hasActiveRange ||
    hasActiveTags;

  return {
    filters,

    sort,
    readingTimeRange,

    filteredPosts,
    availableTags,
    selectedTags,

    setDateFrom,
    setDateTo,

    setSort,
    setReadingTimeRange,

    toggleTag,

    clearFilters,

    hasActiveFilters,
  };
}
