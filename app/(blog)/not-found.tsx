import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RollingTextButton } from "@/components/ui/rolling-text-button";

import { paths } from "@/lib/paths";

/**
 * Renders the not-found state for invalid or unavailable blog routes.
 *
 * This component is used by Next.js as the route-level 404 boundary
 * whenever `notFound()` is triggered within the blog route segment.
 */
export default function NotFound() {
  return (
    <Empty className="mb-80 min-h-[70vh]">
      <EmptyHeader>
        <EmptyTitle className="font-heading text-8xl font-semibold">
          404
        </EmptyTitle>

        <EmptyDescription>
          The page you're looking for might have been moved or doesn't exist.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent className="flex-row justify-center">
        <RollingTextButton href={paths.home} title="Go back" />
      </EmptyContent>
    </Empty>
  );
}
