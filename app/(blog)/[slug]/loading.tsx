export default function Loading() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 animate-pulse">
      {/* Header skeleton */}
      <div className="mb-10 space-y-4">
        <div className="h-10 w-3/4 rounded-md bg-muted" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-28 rounded bg-muted" />
          <div className="h-4 w-4 rounded-full bg-muted" />
          <div className="h-4 w-20 rounded bg-muted" />
        </div>
      </div>

      {/* Actions skeleton */}
      <div className="flex items-center gap-4 py-4 border-y border-border/40 mb-10">
        <div className="h-4 w-20 rounded bg-muted" />
        <div className="h-8 w-16 rounded-md bg-muted" />
        <div className="h-8 w-16 rounded-md bg-muted" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-3/4 rounded bg-muted" />
      </div>
    </div>
  );
}
