import { NotebookPenIcon } from "lucide-react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Marquee } from "@/components/ui/marquee";
import { RollingTextButton } from "@/components/ui/rolling-text-button";

/**
 * Renders the empty state displayed when the blog has no published posts.
 *
 * The component provides a lightweight visual placeholder while directing
 * visitors to GitHub for project updates and future content.
 */
export function EmptyState() {
  return (
    <div className="px-6 py-10">
      <div className="mx-auto max-w-sm pt-0">
        <Empty className="px-0 py-8 md:px-0 md:py-8">
          <EmptyHeader>
            <div className="mask-y-from-60% mask-x-from-95% mb-3 w-full max-w-xs space-y-2">
              <Marquee className="h-56 [--duration:2s]" repeat={5} vertical>
                <div className="flex w-full items-center gap-3 rounded-lg border px-4 py-3">
                  <NotebookPenIcon
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

            <EmptyTitle>No Posts Yet</EmptyTitle>

            <EmptyDescription>
              Still writing the first posts… meanwhile, follow me on GitHub to
              stay in the loop with the project.
            </EmptyDescription>
          </EmptyHeader>

          <EmptyContent>
            <div className="flex flex-wrap gap-2 *:mx-auto">
              <RollingTextButton
                href="https://github.com/david-7279"
                title="GitHub"
                className="w-full rounded-[12px]"
              />
            </div>
          </EmptyContent>
        </Empty>
      </div>
    </div>
  );
}
