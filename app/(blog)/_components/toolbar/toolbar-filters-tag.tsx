"use client";

import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "motion/react";

type ToolbarFiltersTagProps = {
  availableTags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
};

export function ToolbarFiltersTag({
  availableTags,
  selectedTags,
  onTagToggle,
}: ToolbarFiltersTagProps) {
  return (
    <section className="space-y-3">
      <p className="mb-2 text-xs text-muted-foreground">Tags</p>

      <div className="flex flex-wrap gap-2">
        {availableTags.map((tag) => {
          const selected = selectedTags.includes(tag);

          return (
            <motion.button
              key={tag}
              type="button"
              onClick={() => onTagToggle(tag)}
              aria-pressed={selected}
              className="cursor-pointer rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.92 }}
              animate={{
                scale: selected ? 1.02 : 1,
                opacity: 1,
              }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <Badge
                className="rounded-lg px-2.5 py-3 transition-colors duration-200"
                variant={selected ? "default" : "outline"}
              >
                {tag}
              </Badge>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
