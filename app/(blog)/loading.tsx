export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header skeleton */}
      <header className="max-w-2xl mx-auto px-6 pt-20 pb-16">
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 w-48 rounded-md bg-muted animate-pulse" />
            <div className="h-5 w-80 max-w-full rounded bg-muted animate-pulse" />
          </div>
          <div className="h-9 w-9 rounded-full bg-muted animate-pulse shrink-0" />
        </div>
      </header>

      {/* Posts skeleton */}
      <main className="max-w-2xl mx-auto px-6 pb-24">
        <div className="space-y-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="py-5 border-b border-border/40 last:border-0 -mx-3 px-3"
            >
              <div className="flex items-baseline justify-between gap-6">
                <div className="space-y-2 min-w-0 flex-1">
                  <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-4 w-20 rounded bg-muted animate-pulse shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
