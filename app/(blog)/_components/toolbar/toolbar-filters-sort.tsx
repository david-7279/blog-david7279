"use client";

import { useId } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PostSortOption } from "@/app/(blog)/_hooks/use-post-filter-sort";

type ToolbarFiltersSortProps = {
  value: PostSortOption;
  onChange: (value: PostSortOption) => void;
};

const SORT_OPTIONS = new Set<PostSortOption>([
  "newest",
  "oldest",
  "title-asc",
  "title-desc",
  "votes-desc",
  "votes-asc",
]);

const SORT_LABELS: Record<Exclude<PostSortOption, "none">, string> = {
  newest: "Newest",
  oldest: "Oldest",
  "title-asc": "Title A–Z",
  "title-desc": "Title Z–A",
  "votes-desc": "Most Votes",
  "votes-asc": "Least Votes",
};

function isPostSortOption(
  value: string,
): value is Exclude<PostSortOption, "none"> {
  return SORT_OPTIONS.has(value as PostSortOption);
}

export function ToolbarFiltersSort({
  value,
  onChange,
}: ToolbarFiltersSortProps) {
  const id = useId();

  const selectValue = value === "none" ? null : value;

  const handleChange = (nextValue: string | null) => {
    if (nextValue === null) return;
    if (!isPostSortOption(nextValue)) return;
    onChange(nextValue);
  };

  const displayLabel =
    selectValue !== null ? SORT_LABELS[selectValue] : undefined;

  return (
    <div className="space-y-1.5">
      <p className="mb-2 text-xs text-muted-foreground">Sort by</p>

      <Select value={selectValue} onValueChange={handleChange}>
        <SelectTrigger
          id={id}
          aria-labelledby={`${id}-label`}
          className="w-full rounded-xl border border-border bg-background"
        >
          <SelectValue placeholder="Select an option">
            {displayLabel}
          </SelectValue>
        </SelectTrigger>

        <SelectContent
          alignItemWithTrigger={false}
          className="data-[state=open]:slide-in-from-bottom-8 data-[state=open]:zoom-in-100 duration-400"
        >
          <SelectGroup>
            <SelectLabel>Post Time</SelectLabel>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="oldest">Oldest</SelectItem>
          </SelectGroup>

          <SelectSeparator className="mx-3 w-[90%]" />

          <SelectGroup>
            <SelectLabel>Post Title</SelectLabel>
            <SelectItem value="title-asc">Title A–Z</SelectItem>
            <SelectItem value="title-desc">Title Z–A</SelectItem>
          </SelectGroup>

          <SelectSeparator className="mx-3 w-[90%]" />

          <SelectGroup>
            <SelectLabel>Votes</SelectLabel>
            <SelectItem value="votes-desc">Most Votes</SelectItem>
            <SelectItem value="votes-asc">Least Votes</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
