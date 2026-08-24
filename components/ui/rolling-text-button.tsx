"use client";

import { motion, useReducedMotion } from "motion/react";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface RollingTextButtonProps {
  /**
   * Visible button label and accessible name.
   */
  title: string;

  /**
   * Destination for link-based buttons.
   *
   * Omit this prop when using the component as an action button.
   */
  href?: string;

  /**
   * Action invoked when the button is activated.
   *
   * When provided, the component renders a native button instead
   * of a link.
   */
  onClick?: () => void;

  /**
   * Optional icon displayed after the button label.
   *
   * Defaults to ArrowUpRight.
   */
  icon?: LucideIcon;

  /**
   * Additional Tailwind classes.
   */
  className?: string;
}

const outgoingVariants = {
  rest: {
    transform: "translateY(0%)",
  },
  active: {
    transform: "translateY(100%)",
  },
};

const incomingVariants = {
  rest: {
    transform: "translateY(-100%)",
  },
  active: {
    transform: "translateY(0%)",
  },
};

const transition = {
  duration: 0.3,
  ease: [0.338, 0.015, 0.395, 0.959] as const,
};

/**
 * Animated action/link button with a rolling text interaction.
 *
 * The component supports both navigation and action use cases:
 *
 * - `href` → renders a link
 * - `onClick` → renders a native button
 *
 * The animation automatically respects the user's reduced-motion
 * preference.
 */
export function RollingTextButton({
  title,
  href,
  onClick,
  icon: Icon = ArrowUpRight,
  className,
}: RollingTextButtonProps) {
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState(false);

  const activeRef = useRef(false);
  const animating = useRef(false);
  const pendingRequest = useRef<boolean | null>(null);
  const hovered = useRef(false);
  const focused = useRef(false);

  const updateActive = (next: boolean) => {
    activeRef.current = next;
    setActive(next);
  };

  const requestActive = (next: boolean) => {
    if (reduceMotion) {
      return;
    }

    if (next === activeRef.current) {
      pendingRequest.current = null;
      return;
    }

    if (animating.current) {
      pendingRequest.current = next;
      return;
    }

    animating.current = true;
    updateActive(next);
  };

  const completeAnimation = () => {
    if (!animating.current) {
      return;
    }

    animating.current = false;

    if (
      pendingRequest.current !== null &&
      pendingRequest.current !== activeRef.current
    ) {
      const next = pendingRequest.current;

      pendingRequest.current = null;
      animating.current = true;

      updateActive(next);
      return;
    }

    pendingRequest.current = null;
  };

  const buttonClassName = cn(
    "group inline-flex cursor-pointer items-center justify-center gap-2",
    "rounded-xl bg-primary px-4 py-2 text-sm font-medium",
    "text-primary-foreground transition-colors",
    "hover:bg-primary/90",
    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
    "disabled:pointer-events-none disabled:opacity-50",
    className,
  );

  const interactionProps = {
    onHoverStart: () => {
      hovered.current = true;
      requestActive(true);
    },

    onHoverEnd: () => {
      hovered.current = false;
      requestActive(focused.current);
    },

    onFocus: () => {
      focused.current = true;
      requestActive(true);
    },

    onBlur: () => {
      focused.current = false;
      requestActive(hovered.current);
    },
  };

  const content = (
    <>
      <span
        className="relative inline-block overflow-hidden"
        aria-hidden="true"
      >
        <motion.span
          className="block whitespace-nowrap"
          variants={outgoingVariants}
          initial="rest"
          animate={active ? "active" : "rest"}
          transition={transition}
          onAnimationComplete={completeAnimation}
        >
          {title}
        </motion.span>

        <motion.span
          className="absolute inset-0 block whitespace-nowrap"
          variants={incomingVariants}
          initial="rest"
          animate={active ? "active" : "rest"}
          transition={transition}
        >
          {title}
        </motion.span>
      </span>

      <Icon
        className="size-4 transition-transform duration-300 group-hover:rotate-45"
        aria-hidden="true"
      />
    </>
  );

  if (onClick) {
    return (
      <motion.button
        type="button"
        className={buttonClassName}
        onClick={onClick}
        {...interactionProps}
      >
        {content}
      </motion.button>
    );
  }

  if (!href) {
    throw new Error(
      "RollingTextButton requires either an `href` or an `onClick` prop.",
    );
  }

  return (
    <motion.div {...interactionProps}>
      <Link href={href} className={buttonClassName}>
        {content}
      </Link>
    </motion.div>
  );
}
