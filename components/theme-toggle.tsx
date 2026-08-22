"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "h-9 w-9 rounded-full border border-border/60 bg-background",
          className,
        )}
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "group relative flex h-9 w-9 items-center justify-center rounded-full",
        "border border-border/60 bg-background",
        "hover:bg-muted/60 hover:border-border",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
      aria-label={isDark ? "Mudar para tema claro" : "Mudar para tema escuro"}
    >
      <Sun
        className={cn(
          "h-4 w-4 absolute transition-all duration-300",
          isDark
            ? "scale-0 rotate-90 opacity-0"
            : "scale-100 rotate-0 opacity-100",
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 absolute transition-all duration-300",
          isDark
            ? "scale-100 rotate-0 opacity-100"
            : "scale-0 -rotate-90 opacity-0",
        )}
      />
    </button>
  );
}
