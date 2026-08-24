"use client";

import { useState } from "react";

export type PostReadingTimeRange = {
  min: number | null;
  max: number | null;
};

export const DEFAULT_READING_TIME_RANGE: PostReadingTimeRange = {
  min: null,
  max: null,
};

type UsePostFilterRangeResult = {
  range: PostReadingTimeRange;
  setRange: (range: PostReadingTimeRange) => void;
  resetRange: () => void;
  hasActiveRange: boolean;
};

/**
 * Manages the reading-time range filter.
 *
 * `null` represents an unbounded side of the range. This allows the
 * filtering layer to distinguish between an explicit boundary and
 * the absence of a constraint.
 */
export function usePostFilterRange(): UsePostFilterRangeResult {
  const [range, setRange] = useState<PostReadingTimeRange>(
    DEFAULT_READING_TIME_RANGE,
  );

  const resetRange = () => {
    setRange(DEFAULT_READING_TIME_RANGE);
  };

  const hasActiveRange = range.min !== null || range.max !== null;

  return {
    range,
    setRange,
    resetRange,
    hasActiveRange,
  };
}
