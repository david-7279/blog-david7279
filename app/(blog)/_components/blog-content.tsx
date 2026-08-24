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

export function BlogContent({ posts }: BlogContentProps) {
  const {
    query,
    setQuery,
    filteredPosts: searchedPosts,
  } = usePostSearch({ posts });

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

  const filterSignature = [
    sort,
    filters.dateFrom,
    filters.dateTo,
    readingTimeRange.min,
    readingTimeRange.max,
    selectedTags.slice().sort().join(","),
  ].join("|");

  const searchSignature = query.trim().toLocaleLowerCase();

  const postsKey =
    hasQuery || hasActiveFilters
      ? `posts-${hasQuery ? `q-${searchSignature}` : "q-none"}-${
          hasActiveFilters ? `f-${filterSignature}` : "f-none"
        }`
      : "posts-all";

  const contentKey =
    hasQuery && !hasSearchResults
      ? "empty-search"
      : filteredPosts.length === 0
        ? "empty-filters"
        : postsKey;

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
        {contentKey.startsWith("empty-search") && (
          <motion.div
            key="empty-search"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <EmptySearchState onClear={() => setQuery("")} />
          </motion.div>
        )}

        {contentKey.startsWith("empty-filters") && (
          <motion.div
            key="empty-filters"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
          >
            <EmptySearchState onClear={clearFilters} />
          </motion.div>
        )}

        {contentKey.startsWith("posts") && (
          <motion.div
            key={contentKey}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          >
            <PostList posts={filteredPosts} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
