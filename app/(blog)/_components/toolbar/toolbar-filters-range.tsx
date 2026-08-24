"use client";

import { useMemo, useRef, useState } from "react";
import NumberFlow from "@number-flow/react";
import { Slider } from "@/components/ui/slider";

const MIN = 1;
const MAX = 60;
const STEP = 1;
const LABEL_COUNT = 5;

type ToolbarFiltersRangeProps = {
  value: [number, number];
  onChange: (value: [number, number]) => void;
};

export function ToolbarFiltersRange({
  value,
  onChange,
}: ToolbarFiltersRangeProps) {
  const [low, high] = value;

  const [preview, setPreview] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);

  const labels = useMemo(() => {
    return Array.from({ length: LABEL_COUNT }, (_, index) => {
      const rawValue = MIN + (index * (MAX - MIN)) / (LABEL_COUNT - 1);

      return Math.round(rawValue / STEP) * STEP;
    });
  }, []);

  const toPercentage = (value: number) => {
    return ((value - MIN) / (MAX - MIN)) * 100;
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = rootRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const percentage = (event.clientX - rect.left) / rect.width;

    const rawValue = MIN + percentage * (MAX - MIN);

    const snappedValue = Math.round((rawValue - MIN) / STEP) * STEP + MIN;

    setPreview(Math.max(MIN, Math.min(MAX, snappedValue)));
  };

  const lowPercentage = toPercentage(low);
  const highPercentage = toPercentage(high);

  const previewPercentage = preview !== null ? toPercentage(preview) : null;

  let ghostLeft = 0;
  let ghostWidth = 0;

  if (previewPercentage !== null) {
    if (previewPercentage < lowPercentage) {
      ghostLeft = previewPercentage;
      ghostWidth = lowPercentage - previewPercentage;
    } else if (previewPercentage > highPercentage) {
      ghostLeft = highPercentage;
      ghostWidth = previewPercentage - highPercentage;
    }
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-5">
      <div>
        <p className="mb-1 text-xs text-muted-foreground">Reading time</p>

        <div className="flex items-baseline gap-1.5">
          <span className="text-base tabular-nums text-foreground">
            <NumberFlow value={low} />
          </span>

          <span className="text-muted-foreground">–</span>

          <span className="text-base tabular-nums text-foreground">
            <NumberFlow value={high} />
          </span>

          <span className="text-xs text-muted-foreground">min</span>
        </div>
      </div>

      <div className="space-y-2">
        <div
          ref={rootRef}
          className="relative w-full"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setPreview(null)}
        >
          <Slider
            value={value}
            min={MIN}
            max={MAX}
            step={STEP}
            onValueChange={(nextValue) => {
              if (Array.isArray(nextValue) && nextValue.length === 2) {
                onChange([nextValue[0], nextValue[1]]);
              }
            }}
            aria-label="Reading time range"
            className="**:[[role=slider]]:transition-transform **:data-[slot='slider-track']:h-1! **:data-[slot='slider-thumb']:z-2 **:data-[slot='slider-thumb']:size-3! **:data-[slot='slider-thumb']:border-2! **:data-[slot='slider-thumb']:border-primary! **:data-[slot='slider-thumb']:bg-background! **:data-[slot='slider-thumb']:shadow-xs"
          />

          {previewPercentage !== null && ghostWidth > 0 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 z-1 h-2 -translate-y-1/2 rounded-full bg-primary/30 transition-[left,width] duration-75"
              style={{
                left: `${ghostLeft}%`,
                width: `${ghostWidth}%`,
              }}
            />
          )}
        </div>

        <div
          className="flex select-none justify-between text-[11px] font-medium text-muted-foreground/60"
          aria-hidden="true"
        >
          {labels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
