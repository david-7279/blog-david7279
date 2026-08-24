"use client";

import type { PostWithStats } from "@/lib/posts/types";

import { usePostSearch } from "../_hooks/use-post-search";

import { PostList } from "./post-list";
import { Toolbar } from "./toolbar";
import { EmptySearchState } from "@/app/(blog)/_components/empty-search-state";

type BlogContentProps = {
  posts: PostWithStats[];
};

/**
 * Coordinates the interactive blog listing.
 *
 * Search state and filtering are handled by the dedicated search hook,
 * while this component decides which UI state should be rendered.
 */
export function BlogContent({ posts }: BlogContentProps) {
  const { query, setQuery, filteredPosts } = usePostSearch({
    posts,
  });

  const hasQuery = query.trim().length > 0;
  const hasSearchResults = filteredPosts.length > 0;

  return (
    <div className="space-y-5">
      <Toolbar query={query} onQueryChange={setQuery} />

      {hasQuery && !hasSearchResults ? (
        <EmptySearchState onClear={() => setQuery("")} />
      ) : (
        <PostList posts={filteredPosts} />
      )}
    </div>
  );
}
