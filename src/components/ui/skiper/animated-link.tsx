"use client";

import { cn } from "@/lib/utils";

/**
 * AnimatedLink — underline wipe + external arrow reveal on hover.
 * Ported from Skiper UI (skiper40 Link001). Free tier requires attribution:
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function AnimatedLink({
  children,
  href,
  className,
  external = true,
}: {
  children: React.ReactNode;
  href: string;
  className?: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
      className={cn(
        "group relative inline-flex items-center text-current transition-colors",
        className,
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-px before:w-full before:bg-current before:content-[''] before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)] hover:before:origin-left hover:before:scale-x-100",
        "[&:hover]:opacity-100",
      )}
    >
      {children}
      <svg
        aria-hidden
        className="ml-[0.3em] size-[0.55em] translate-y-[-0.1em] opacity-0 transition-all duration-300 [motion-reduce:transition-none] group-hover:translate-y-0 group-hover:opacity-100"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
