"use client";

import { useTheme } from "next-themes";
import { AnimatedThemeToggler } from "@/components/animated-theme-toggle";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <AnimatedThemeToggler
      theme={resolvedTheme === "dark" ? "dark" : "light"}
      onThemeChange={setTheme}
      className="cursor-pointer"
    />
  );
}
