import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Marquee } from "@/components/ui/marquee";
import { RollingTextButton } from "@/components/ui/rolling-text-button";
import { SearchIcon, SearchXIcon, XIcon } from "lucide-react";

type EmptySearchStateProps = {
  onClear: () => void;
};

/**
 * Displays an empty state when a search query does not match any posts.
 *
 * Unlike the default blog empty state, this component represents an empty
 * search result rather than an empty blog.
 */
export function EmptySearchState({ onClear }: EmptySearchStateProps) {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-sm pt-0">
        <Empty className="px-0 py-8 md:px-0 md:py-8">
          <EmptyHeader>
            <div className="mask-y-from-60% mask-x-from-95% mb-3 w-full max-w-xs space-y-2">
              <Marquee className="h-56 [--duration:2s]" repeat={5} vertical>
                <div className="flex w-full items-center gap-3 rounded-lg border px-4 py-3">
                  <SearchXIcon
                    className="shrink-0 fill-muted text-muted-foreground/70"
                    aria-hidden="true"
                  />

                  <div
                    className="h-5 w-full rounded-lg bg-muted"
                    aria-hidden="true"
                  />

                  <div
                    className="ms-auto size-6 shrink-0 rounded-full bg-muted"
                    aria-hidden="true"
                  />
                </div>
              </Marquee>
            </div>

            <EmptyTitle>No Posts Found</EmptyTitle>

            <EmptyDescription>
              Try adjusting your search or filter to find what you're looking
              for.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex flex-wrap gap-2 *:mx-auto">
              <RollingTextButton
                title="Clear search"
                icon={XIcon}
                onClick={onClear}
                className="w-full rounded-[12px]"
              />
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
