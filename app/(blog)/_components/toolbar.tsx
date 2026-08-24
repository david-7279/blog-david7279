"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";

import type {
  PostFilterState,
  PostSortOption,
} from "../_hooks/use-post-filters";

import { ToolbarFilters } from "./toolbar-filters";

type ToolbarProps = {
  query: string;
  onQueryChange: (query: string) => void;

  filters: PostFilterState;
  availableTags: string[];
  hasActiveFilters: boolean;

  onSortChange: (sort: PostSortOption) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onReadingTimeMinChange: (value: number | null) => void;
  onReadingTimeMaxChange: (value: number | null) => void;
  onTagToggle: (tag: string) => void;
  onClearFilters: () => void;
};

/**
 * Renders the blog toolbar.
 *
 * The toolbar is intentionally controlled by its parent. It does not
 * own search or filter state, keeping business logic outside the UI layer.
 */
export function Toolbar({
  query,
  onQueryChange,
  filters,
  availableTags,
  hasActiveFilters,
  onSortChange,
  onDateFromChange,
  onDateToChange,
  onReadingTimeMinChange,
  onReadingTimeMaxChange,
  onTagToggle,
  onClearFilters,
}: ToolbarProps) {
  return (
    <div className="flex flex-row justify-between gap-2">
      <InputGroup className="bg-background">
        <InputGroupInput
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search for an article..."
          aria-label="Search articles"
        />

        <InputGroupAddon>
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>

      <ToolbarFilters
        filters={filters}
        availableTags={availableTags}
        hasActiveFilters={hasActiveFilters}
        onSortChange={onSortChange}
        onDateFromChange={onDateFromChange}
        onDateToChange={onDateToChange}
        onReadingTimeMinChange={onReadingTimeMinChange}
        onReadingTimeMaxChange={onReadingTimeMaxChange}
        onTagToggle={onTagToggle}
        onClear={onClearFilters}
      />
    </div>
  );
}
