"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

import type { PostFilterState } from "../_hooks/use-post-filters";
import type { PostReadingTimeRange } from "../_hooks/use-post-filter-range";
import type { PostSortOption } from "../_hooks/use-post-filter-sort";

import { ToolbarFilters } from "./toolbar/toolbar-filters";

type ToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;

  filters: PostFilterState;

  sort: PostSortOption;

  readingTimeRange: PostReadingTimeRange;

  availableTags: string[];
  selectedTags: string[];

  hasActiveFilters: boolean;

  onSortChange: (sort: PostSortOption) => void;

  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;

  onReadingTimeRangeChange: (range: PostReadingTimeRange) => void;

  onTagToggle: (tag: string) => void;

  onClearFilters: () => void;
};

/**
 * Renders the blog toolbar.
 *
 * This component is intentionally controlled by its parent.
 * It owns no search or filter state and is responsible only for
 * composing the search input and filter controls.
 */
export function Toolbar({
  query,
  onQueryChange,

  filters,
  sort,
  readingTimeRange,

  availableTags,
  selectedTags,

  hasActiveFilters,

  onSortChange,
  onDateFromChange,
  onDateToChange,
  onReadingTimeRangeChange,
  onTagToggle,
  onClearFilters,
}: ToolbarProps) {
  return (
    <div className="flex flex-row items-center justify-between gap-2">
      {/* Article search */}
      <InputGroup className="bg-background">
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for an article..."
          aria-label="Search articles"
        />

        <InputGroupAddon>
          <SearchIcon aria-hidden="true" className="size-4" />
        </InputGroupAddon>
      </InputGroup>

      {/* Article filters */}
      <ToolbarFilters
        filters={filters}
        sort={sort}
        readingTimeRange={readingTimeRange}
        availableTags={availableTags}
        selectedTags={selectedTags}
        hasActiveFilters={hasActiveFilters}
        onSortChange={onSortChange}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        onReadingTimeRangeChange={onReadingTimeRangeChange}
        onTagToggle={onTagToggle}
        onClear={onClearFilters}
      />
    </div>
  );
}
