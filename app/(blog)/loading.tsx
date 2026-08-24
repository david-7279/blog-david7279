/**
 * Renders the loading state for the blog index route.
 *
 * The skeleton intentionally mirrors the production PostCard structure
 * to preserve layout stability and provide a smoother transition once
 * the server-rendered post data becomes available.
 */
export default function Loading() {
  return (
    <main className="pb-24">
      <div className="space-y-5">
        {/* Toolbar skeleton */}
        <div className="flex flex-row justify-between gap-2">
          <div className="h-10 flex-1 animate-pulse rounded-md bg-muted" />

          <div className="h-10 w-20 shrink-0 animate-pulse rounded-md bg-muted" />
        </div>

        {/* Post list skeleton */}
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="rounded-[32px] border border-border bg-card py-2.5 shadow-xs"
            >
              {/* Card header */}
              <div className="px-2.5">
                <div className="space-y-4 rounded-[32px] bg-background p-8">
                  {/* Author, date, title, and actions */}
                  <div className="flex justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      {/* Author and date */}
                      <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />

                      {/* Title */}
                      <div className="space-y-2">
                        <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                        <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                      </div>
                    </div>

                    {/* Dropdown */}
                    <div className="size-9 shrink-0 animate-pulse rounded-md bg-muted" />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted" />
                    <div className="h-4 w-4/5 animate-pulse rounded bg-muted" />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    <div className="h-6 w-16 animate-pulse rounded-lg bg-muted" />
                    <div className="h-6 w-20 animate-pulse rounded-lg bg-muted" />
                    <div className="h-6 w-14 animate-pulse rounded-lg bg-muted" />
                  </div>

                  {/* Statistics */}
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-12 animate-pulse rounded bg-muted" />

                    <div className="h-4 w-px bg-border" />

                    <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              </div>

              {/* Read article button */}
              <div className="p-3 px-10">
                <div className="h-9 w-full animate-pulse rounded-[12px] bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
