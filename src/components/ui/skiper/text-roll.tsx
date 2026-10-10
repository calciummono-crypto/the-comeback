"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

const STAGGER = 0.035;

/**
 * TextRoll — letter-by-letter vertical roll on hover.
 * Ported from Skiper UI (skiper58). Free tier requires attribution:
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{ lineHeight: 0.75 }}
    >
      <div>
        {children.split("").map((l, i) => (
          <motion.span
            variants={{ initial: { y: 0 }, hovered: { y: "-100%" } }}
            transition={{
              ease: "easeInOut",
              delay: center
                ? STAGGER * Math.abs(i - (children.length - 1) / 2)
                : STAGGER * i,
            }}
            className="inline-block"
            key={`a-${i}`}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => (
          <motion.span
            variants={{ initial: { y: "100%" }, hovered: { y: 0 } }}
            transition={{
              ease: "easeInOut",
              delay: center
                ? STAGGER * Math.abs(i - (children.length - 1) / 2)
                : STAGGER * i,
            }}
            className="inline-block"
            key={`b-${i}`}
          >
            {l === " " ? "\u00A0" : l}
          </motion.span>
        ))}
      </div>
    </motion.span>
  );
};
