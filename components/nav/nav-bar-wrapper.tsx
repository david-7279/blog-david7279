// components/nav/nav-bar-wrapper.tsx
"use client";

import React, { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface Props {
  children: ReactNode;
}

const NavBarWrapper: React.FC<Props> = ({ children }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="sticky top-5 z-50 mx-auto w-full max-w-3xl">
      <div
        className={cn(
          "transition-all duration-300",
          isScrolled &&
            "rounded-2xl border border-border/20 bg-background/80 backdrop-blur-lg",
        )}
      >
        <div className="flex items-center justify-between gap-6 px-4 py-3 lg:px-6 lg:py-4">
          {children}
        </div>
      </div>
    </nav>
  );
};

export default NavBarWrapper;
