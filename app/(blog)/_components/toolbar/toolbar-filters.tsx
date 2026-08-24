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

          <div className="space-y-6 overflow-y-auto px-4 pb-4">
            {/* Sort */}
            <section>
              <ToolbarFiltersSort value={sort} onChange={onSortChange} />
            </section>

            {/* Publication date */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <CalendarDaysIcon size={16} aria-hidden="true" />

                <h3 className="text-sm font-medium">Publication date</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(event) => onDateFromChange(event.target.value)}
                  aria-label="Published from"
                />

                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(event) => onDateToChange(event.target.value)}
                  aria-label="Published until"
                />
              </div>
            </section>

            {/* Reading time */}
            <section>
              <ToolbarFiltersRange
                value={[readingTimeRange.min ?? 1, readingTimeRange.max ?? 60]}
                onChange={([min, max]) =>
                  onReadingTimeRangeChange({
                    min,
                    max,
                  })
                }
              />
            </section>

            {/* Tags */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TagsIcon size={16} aria-hidden="true" />

                <h3 className="text-sm font-medium">Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const selected = selectedTags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onTagToggle(tag)}
                      aria-pressed={selected}
                      className="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <Badge variant={selected ? "default" : "secondary"}>
                        {tag}
                      </Badge>
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <DrawerFooter>
            {hasActiveFilters && (
              <Button type="button" variant="ghost" onClick={onClear}>
                <RotateCcwIcon size={16} aria-hidden="true" />
                Clear filters
              </Button>
            )}

            <DrawerClose>
              <Button type="button">Apply filters</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
