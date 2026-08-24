"use client";

import type { PostWithStats } from "@/lib/posts/types";

import { usePostSearch } from "../_hooks/use-post-search";
import { usePostFilters } from "../_hooks/use-post-filters";

import { PostList } from "./post-list";
import { Toolbar } from "./toolbar";
import { EmptySearchState } from "@/app/(blog)/_components/empty-search-state";
import { AnimatePresence, motion } from "motion/react";

type BlogContentProps = {
  posts: PostWithStats[];
};

/**
 * Coordinates the interactive blog listing.
 *
 * Search, filtering, and sorting state are managed by dedicated hooks.
 * This component coordinates those concerns and determines which UI
 * state should be rendered.
 */
export function BlogContent({ posts }: BlogContentProps) {
  /**
   * Search is applied first so that subsequent filters operate only
   * on posts matching the user's query.
   */
  const {
    query,
    setQuery,
    filteredPosts: searchedPosts,
  } = usePostSearch({
    posts,
  });

  /**
   * Filters and sorting operate on the search result.
   */
  const {
    filters,
    sort,
    readingTimeRange,
    filteredPosts,
    availableTags,
    selectedTags,
    setSort,
    setDateFrom,
    setDateTo,
    setReadingTimeRange,
    toggleTag,
    clearFilters,
    hasActiveFilters,
  } = usePostFilters({
    posts: searchedPosts,
  });

  const hasQuery = query.trim().length > 0;
  const hasSearchResults = searchedPosts.length > 0;

  const contentKey =
    hasQuery && !hasSearchResults
      ? "empty-search"
      : filteredPosts.length === 0
        ? "empty-filters"
        : "posts";

  return (
    <div className="space-y-5">
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        sort={sort}
        readingTimeRange={readingTimeRange}
        availableTags={availableTags}
        selectedTags={selectedTags}
        hasActiveFilters={hasActiveFilters}
        onSortChange={setSort}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReadingTimeRangeChange={setReadingTimeRange}
        onTagToggle={toggleTag}
        onClearFilters={clearFilters}
      />

      <AnimatePresence mode="wait">
        {contentKey === "empty-search" && (
          <motion.div
            key="empty-search"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <EmptySearchState onClear={() => setQuery("")} />
          </motion.div>
        )}

        {contentKey === "empty-filters" && (
          <motion.div
            key="empty-filters"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <EmptySearchState onClear={clearFilters} />
          </motion.div>
        )}

        {contentKey === "posts" && (
          <motion.div
            key="posts"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <PostList posts={filteredPosts} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
