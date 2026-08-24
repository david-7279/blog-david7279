"use client";

import { AnimatePresence, motion } from "motion/react";

type PostContentMotionProps = {
  children: React.ReactNode;
  contentKey: string;
};

export function PostContentMotion({
  children,
  contentKey,
}: PostContentMotionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={contentKey}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
