/**
 * Z-BEAM brand marks.
 *
 * `Logo` is a geometric Z monogram on a dark plate: a heavy stencil Z with a
 * beam slot cut through it, framed by a hairline and a single hot accent
 * corner. Deliberately not illustrative — no scenery, no mascot — so it holds
 * up at 16px, in monochrome, and next to wordmarks of any weight.
 *
 * Colour comes from `--accent` / `--color-*` tokens, so the mark follows the
 * selected theme preset without ever restyling the shape itself.
 */

export function Logo({
  size = 40,
  className = "",
  title = "Z-BEAM",
}: {
  size?: number;
  className?: string;
  title?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label={title}
    >
      <defs>
        <linearGradient id="zbPlate" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#12161f" />
          <stop offset="1" stopColor="#070a10" />
        </linearGradient>
        <linearGradient id="zbMark" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="var(--color-emerald-300)" />
          <stop offset="0.55" stopColor="var(--color-emerald-500)" />
          <stop offset="1" stopColor="var(--color-emerald-700)" />
        </linearGradient>
      </defs>

      {/* Plate */}
      <rect x="2" y="2" width="44" height="44" rx="11" fill="url(#zbPlate)" />
      <rect
        x="2.75"
        y="2.75"
        width="42.5"
        height="42.5"
        rx="10.25"
        stroke="var(--color-emerald-500)"
        strokeOpacity="0.38"
        strokeWidth="1.5"
      />

      {/* Inner hairline frame — reads as precision, not decoration */}
      <rect
        x="8.5"
        y="8.5"
        width="31"
        height="31"
        rx="6"
        stroke="#ffffff"
        strokeOpacity="0.09"
        strokeWidth="1"
      />

      {/* Z monogram with a beam slot cut across the diagonal */}
      <g>
        <path
          d="M14 14h20v5.6L23.4 28.6H34V34H14v-5.6L24.6 19.4H14V14z"
          fill="url(#zbMark)"
        />
        {/* Beam cut — clipped so it never bleeds past the Z */}
        <path
          d="M14 24.4h20v2.4H14z"
          fill="#070a10"
          opacity="0.9"
        />
      </g>

      {/* Accent pip: one hot corner tick, the only warm element */}
      <rect x="35" y="10" width="4" height="4" rx="1" fill="var(--color-emerald-400)" />
    </svg>
  );
}

export function Wordmark({
  height = 28,
  className = "",
}: {
  height?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-black ${className}`}
      style={{
        fontSize: `${height}px`,
        lineHeight: 0.82,
        fontFamily: 'var(--font-brand), "Space Grotesk", ui-sans-serif, system-ui, sans-serif',
        letterSpacing: "-0.045em",
        color: "var(--text, #fff)",
      }}
      aria-label="Z-BEAM"
    >
      Z&#8209;BEAM
    </span>
  );
}
