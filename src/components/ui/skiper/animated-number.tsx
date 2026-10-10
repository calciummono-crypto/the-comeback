"use client";

import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * AnimatedNumber ΓÇö spring count-up that re-runs whenever `value` changes.
 * Adapted from Skiper UI (skiper37 AnimatedNumber_002).
 * Author: @gurvinder-singh02 ┬╖ https://skiper-ui.com
 */
export function AnimatedNumber({
  value,
  duration = 0.7,
  className,
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const mv = useMotionValue(0);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(mv, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <span className={cn("tabular-nums", className)}>{display}</span>;
}
