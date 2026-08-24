"use client";

import type { PostWithStats } from "@/lib/posts/types";

import { usePostSearch } from "../_hooks/use-post-search";
import { usePostFilters } from "../_hooks/use-post-filters";

import { EmptySearchState } from "./empty-search-state";
import { PostList } from "./post-list";
import { Toolbar } from "./toolbar";

type BlogContentProps = {
  posts: PostWithStats[];
};

/**
 * Orchestrates the interactive blog listing.
 *
 * Search and filter state live at this level so that the toolbar and
 * result list remain controlled, reusable presentation components.
 */
export function BlogContent({ posts }: BlogContentProps) {
  /**
   * Search is applied first so that filtering and sorting operate only
   * on the articles matching the user's query.
   */
  const {
    query,
    setQuery,
    filteredPosts: searchedPosts,
  } = usePostSearch({
    posts,
  });

  /**
   * Additional filters and sorting are applied to the search results.
   */
  const {
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
  } = usePostFilters({
    posts: searchedPosts,
  });

  const hasQuery = query.trim().length > 0;
  const hasSearchResults = filteredPosts.length > 0;

  return (
    <div className="space-y-5">
      <Toolbar
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        availableTags={availableTags}
        hasActiveFilters={hasActiveFilters}
        onSortChange={setSort}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onReadingTimeMinChange={setReadingTimeMin}
        onReadingTimeMaxChange={setReadingTimeMax}
        onTagToggle={toggleTag}
        onClearFilters={clearFilters}
      />

      {hasQuery && !hasSearchResults ? (
        <EmptySearchState onClear={() => setQuery("")} />
      ) : (
        <PostList posts={filteredPosts} />
      )}
    </div>
  );
}
