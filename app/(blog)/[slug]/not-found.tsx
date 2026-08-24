import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { RollingTextButton } from "@/components/ui/rolling-text-button";
import { paths } from "@/lib/paths";

export default function NotFound() {
  return (
    <Empty className="min-h-[70vh] mb-80">
      <EmptyHeader>
        <EmptyTitle className="font-heading font-semibold text-8xl">
          404
        </EmptyTitle>
        <EmptyDescription>
          The article you're looking for might have been moved or doesn't exist.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent className="flex-row justify-center">
        <RollingTextButton href={paths.home} title="Go back" />
      </EmptyContent>
    </Empty>
  );
}
