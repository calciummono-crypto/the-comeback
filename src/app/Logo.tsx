export function Logo({
  size = 40,
  className = "",
}: {
  size?: number;
  className?: string;
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
      aria-label="The Comeback logo"
    >
      <defs>
        <linearGradient id="cbSky" x1="0" y1="0" x2="0" y2="48">
          <stop offset="0" stopColor="#2a0e2c" />
          <stop offset="0.62" stopColor="#6b1440" />
          <stop offset="1" stopColor="#ff9a5c" />
        </linearGradient>
        <linearGradient id="cbSun" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffc98a" />
          <stop offset="1" stopColor="#ff2e7e" />
        </linearGradient>
      </defs>

      {/* world tile */}
      <rect width="48" height="48" rx="10" fill="url(#cbSky)" />

      {/* pixel sun setting behind the horizon */}
      <rect x="17" y="24" width="14" height="14" fill="url(#cbSun)" />
      <rect x="14" y="27" width="20" height="8" fill="url(#cbSun)" opacity="0.5" />

      {/* horizon line */}
      <rect x="0" y="31" width="48" height="2" fill="#1a0510" opacity="0.55" />

      {/* stepped treeline silhouettes */}
      <path
        d="M0 48V36h3v-3h3v4h3v-6h3v5h3v-4h3v6h3v-5h3v4h3v-6h3v7h3v-4h3v5h3v-6h3v4h3v-3h3v5h3v-4h3v5h3v-3h3v13H0Z"
        fill="#0a050d"
      />

      {/* water shimmer under the sun */}
      <rect x="19" y="34" width="10" height="2" fill="#ff6aa5" opacity="0.7" />
      <rect x="21" y="38" width="6" height="2" fill="#ff6aa5" opacity="0.45" />
      <rect x="22" y="42" width="4" height="2" fill="#ff6aa5" opacity="0.28" />

      {/* stars */}
      <rect x="8" y="8" width="2" height="2" fill="#fff" opacity="0.85" />
      <rect x="35" y="6" width="2" height="2" fill="#fff" opacity="0.7" />
      <rect x="26" y="12" width="2" height="2" fill="#fff" opacity="0.5" />
      <rect x="13" y="16" width="2" height="2" fill="#fff" opacity="0.4" />
    </svg>
  );
}
