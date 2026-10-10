type ProgressiveBlurProps = {
  className?: string;
  backgroundColor?: string;
  position?: "top" | "bottom";
  height?: string;
  blurAmount?: string;
};

/**
 * ProgressiveBlur — soft blurred edge mask for scroll regions.
 * Ported from Skiper UI (skiper41). Free tier requires attribution:
 * Author: @gurvinder-singh02 · https://skiper-ui.com
 */
export function ProgressiveBlur({
  className = "",
  backgroundColor = "#08050c",
  position = "top",
  height = "96px",
  blurAmount = "3px",
}: ProgressiveBlurProps) {
  const isTop = position === "top";
  const side = isTop ? "top" : "bottom";
  const mask = isTop
    ? `linear-gradient(to bottom, ${backgroundColor} 45%, transparent)`
    : `linear-gradient(to top, ${backgroundColor} 45%, transparent)`;

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute left-0 z-10 w-full select-none ${className}`}
      style={{
        [side]: 0,
        height,
        background: isTop
          ? `linear-gradient(to top, transparent, ${backgroundColor})`
          : `linear-gradient(to bottom, transparent, ${backgroundColor})`,
        maskImage: mask,
        WebkitMaskImage: mask,
        WebkitBackdropFilter: `blur(${blurAmount})`,
        backdropFilter: `blur(${blurAmount})`,
        WebkitUserSelect: "none",
        userSelect: "none",
      }}
    />
  );
}
