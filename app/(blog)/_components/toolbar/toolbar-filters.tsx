"use client";

import {
  CalendarDaysIcon,
  ListFilterIcon,
  RotateCcwIcon,
  TagsIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { ToolbarFiltersRange } from "@/app/(blog)/_components/toolbar/toolbar-filters-range";
import { ToolbarFiltersSort } from "@/app/(blog)/_components/toolbar/toolbar-filters-sort";

import type { PostFilterState } from "@/app/(blog)/_hooks/use-post-filters";
import type { PostReadingTimeRange } from "@/app/(blog)/_hooks/use-post-filter-range";
import type { PostSortOption } from "@/app/(blog)/_hooks/use-post-filter-sort";
import { ToolbarFiltersTag } from "@/app/(blog)/_components/toolbar/toolbar-filters-tag";

type ToolbarFiltersProps = {
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
  onClear: () => void;
};

/**
 * Renders the blog filtering controls.
 *
 * This component is intentionally presentation-focused. State and
 * filtering behavior are owned by the dedicated filter hooks.
 */
export function ToolbarFilters({
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
  onClear,
}: ToolbarFiltersProps) {
  return (
    <Drawer swipeDirection="right" modal={false}>
      <DrawerTrigger>
        <Button type="button" variant="ghost" className="text-muted-foreground">
          <ListFilterIcon size={16} aria-hidden="true" />
          Filters
          {hasActiveFilters && (
            <span
              className="ml-1 size-2 rounded-full bg-primary"
              aria-label="Active filters"
            />
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background shadow-sm">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Filter Articles</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-8 overflow-y-auto px-4 pb-4 pt-4">
            {/* Sort */}
            <ToolbarFiltersSort value={sort} onChange={onSortChange} />

            {/* Reading time */}
            <ToolbarFiltersRange
              value={[readingTimeRange.min ?? 1, readingTimeRange.max ?? 60]}
              onChange={([min, max]) =>
                onReadingTimeRangeChange({
                  min,
                  max,
                })
              }
            />

            {/* Tags */}
            <ToolbarFiltersTag
              availableTags={availableTags}
              selectedTags={selectedTags}
              onTagToggle={onTagToggle}
            />
          </div>

          <DrawerFooter className="flex flex-col gap-2 mt-4">
            {hasActiveFilters && (
              <Button
                className="w-full"
                type="button"
                variant="outline"
                onClick={onClear}
              >
                <RotateCcwIcon size={16} aria-hidden="true" />
                Clear filters
              </Button>
            )}
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
