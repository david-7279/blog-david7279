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

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.8 }}
          className={cn(
            "fixed bottom-8 right-8 z-40",
            "group flex flex-col items-center gap-2",
            "rounded-lg border border-border bg-background/80 backdrop-blur-sm",
            "px-3 py-3",
          )}
          aria-label="Back to top"
        >
          <motion.div
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            <div className="flex flex-row items-center gap-2">
              <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">
                Back to top
              </span>
              <ArrowUp className="h-4 w-4 text-foreground/70 group-hover:text-foreground transition-colors" />
            </div>
          </motion.div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
