"use client";

import {
  CalendarDaysIcon,
  Clock3Icon,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import type {
  PostFilterState,
  PostSortOption,
} from "../_hooks/use-post-filters";

type ToolbarFiltersProps = {
  filters: PostFilterState;
  availableTags: string[];
  hasActiveFilters: boolean;

  onSortChange: (sort: PostSortOption) => void;
  onDateFromChange: (date: string) => void;
  onDateToChange: (date: string) => void;
  onReadingTimeMinChange: (value: number | null) => void;
  onReadingTimeMaxChange: (value: number | null) => void;
  onTagToggle: (tag: string) => void;
  onClear: () => void;
};

/**
 * Renders the blog filtering controls.
 *
 * This component is intentionally presentation-focused. Filter state
 * and filtering logic are managed by `usePostFilters`.
 */
export function ToolbarFilters({
  filters,
  availableTags,
  hasActiveFilters,
  onSortChange,
  onDateFromChange,
  onDateToChange,
  onReadingTimeMinChange,
  onReadingTimeMaxChange,
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

      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Filter Articles</DrawerTitle>
          </DrawerHeader>

          <div className="space-y-6 overflow-y-auto px-4 pb-4">
            {/* Sort */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <ListFilterIcon size={16} aria-hidden="true" />

                <h3 className="text-sm font-medium">Sort by</h3>
              </div>

              <Select
                value={filters.sort}
                onValueChange={(value) => onSortChange(value as PostSortOption)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>

                  <SelectItem value="oldest">Oldest</SelectItem>

                  <SelectItem value="votes">Most votes</SelectItem>

                  <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
              </Select>
            </section>

            {/* Date range */}
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
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock3Icon size={16} aria-hidden="true" />

                <h3 className="text-sm font-medium">Reading time</h3>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="number"
                  min={1}
                  placeholder="Min"
                  value={filters.readingTimeMin ?? ""}
                  onChange={(event) =>
                    onReadingTimeMinChange(
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  aria-label="Minimum reading time"
                />

                <Input
                  type="number"
                  min={1}
                  placeholder="Max"
                  value={filters.readingTimeMax ?? ""}
                  onChange={(event) =>
                    onReadingTimeMaxChange(
                      event.target.value ? Number(event.target.value) : null,
                    )
                  }
                  aria-label="Maximum reading time"
                />
              </div>
            </section>

            {/* Tags */}
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <TagsIcon size={16} aria-hidden="true" />

                <h3 className="text-sm font-medium">Tags</h3>
              </div>

              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => {
                  const selected = filters.tags.includes(tag);

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => onTagToggle(tag)}
                      aria-pressed={selected}
                      className="cursor-pointer"
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
