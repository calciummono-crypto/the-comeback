"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

type OverlayProps = {
  children: ReactNode;
  onClose: () => void;
  /** Class for the dimming layer. */
  backdropClassName?: string;
  /** Decorative layer painted above the backdrop, below the panel. */
  ambientClassName?: string;
  /** Under-glow rendered behind the panel. */
  underglowClassName?: string;
  /** Blocks Escape and backdrop dismissal while a mutation is in flight. */
  closeDisabled?: boolean;
};

/**
 * Modal root, rendered into <body> instead of wherever the trigger lives.
 *
 * That indirection is the whole point: `position: fixed` resolves against the
 * nearest ancestor that establishes a containing block (`filter`,
 * `backdrop-filter`, `transform`, `clip-path`, `will-change`...). Panels are
 * built out of exactly those properties, so an in-place overlay was resolving
 * against the panel and drifting with it — off-centre whenever the sidebar
 * opened. Attached to <body> there is no such ancestor.
 */
export default function Overlay({
  children,
  onClose,
  backdropClassName = "bg-[#030712]/86 backdrop-blur-2xl",
  ambientClassName,
  underglowClassName,
  closeDisabled = false,
}: OverlayProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !closeDisabled) onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [closeDisabled]);

  // Portaling needs a real DOM node, which does not exist during SSR. Modals
  // only ever open in response to user input, so this never drops a real one.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] grid place-items-center p-4 sm:p-6">
      {ambientClassName && (
        <div className={`pointer-events-none absolute inset-0 ${ambientClassName}`} />
      )}
      <div
        className={`absolute inset-0 animate-fade-in ${backdropClassName}`}
        onClick={closeDisabled ? undefined : () => onCloseRef.current()}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 flex w-full animate-pop-in items-center justify-center"
      >
        {underglowClassName && (
          <div
            className={`absolute -inset-1 z-[-1] blur-2xl opacity-70 ${underglowClassName}`}
          />
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
