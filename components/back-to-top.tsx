"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = (duration = 1200) => {
    const start = window.scrollY;
    const startTime = performance.now();

    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = easeInOutCubic(progress);

      window.scrollTo(0, start * (1 - ease));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      }
    };

    requestAnimationFrame(animateScroll);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={() => scrollToTop(2400)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.92 }}
          className={cn(
            "fixed bottom-8 right-8 z-40",
            "group flex flex-col items-center gap-2",
            "rounded-lg border border-border bg-background/80 backdrop-blur-sm",
            "px-3 py-3",
            "hover:bg-background transition-colors",
          )}
          aria-label="Back to top"
        >
          <div className="flex flex-row items-center gap-2">
            <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">
              Back to top
            </span>
            <ArrowUp className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors" />
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
