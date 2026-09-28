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
      aria-label="Z-BEAM logo"
    >
      <rect width="48" height="48" rx="8" fill="#15151a" />
      <path d="M6 6h34v9H22v5h-8v5h18v8H6v-9h8v-5h8v-5H6V6Z" fill="url(#zbeamIconFill)" />
      <path d="M6 33h26v9H6v-9Z" fill="#2b2a2f" />
      <path d="M36 31h6v6h-6v-6Z" fill="#6afa6c" />
      <path d="M36 37h6v5h-6v-5Z" fill="#2b2a2f" />
      <defs>
        <linearGradient id="zbeamIconFill" x1="6" x2="42" y1="6" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5dff67" />
          <stop offset="1" stopColor="#c9efc3" />
        </linearGradient>
      </defs>
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
  const width = Math.round(height * (504 / 162));

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 504 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Z-BEAM"
      role="img"
    >
      <defs>
        <linearGradient id="zbeamWordFill" x1="0" y1="0" x2="504" y2="162" gradientUnits="userSpaceOnUse">
          <stop stopColor="#5cff63" />
          <stop offset="0.56" stopColor="#8bfa84" />
          <stop offset="1" stopColor="#d4f0ca" />
        </linearGradient>
      </defs>
      <g shapeRendering="crispEdges">
        {/* Z */}
        <path fill="url(#zbeamWordFill)" d="M0 0h88v32H56v16H24v16H0V0Zm0 64h56v16H32v16H0V64Zm0 96V96h32v-16h32v-16h24v96H0Z" />
        <path fill="#29272d" d="M0 112h88v50H0z" opacity="0.94" />
        {/* hyphen */}
        <path fill="#29272d" d="M96 108h42v36H96z" />
        <path fill="url(#zbeamWordFill)" d="M101 78h32v22h-32z" opacity="0.92" />
        {/* B */}
        <path fill="url(#zbeamWordFill)" d="M152 0h86v48h-32V32h-18v22h50v54h-50v22h18v-16h32v48h-86V0Zm36 76v10h18V76h-18Z" />
        <path fill="#29272d" d="M152 108h86v54h-86z" opacity="0.94" />
        <path fill="#29272d" d="M188 31h12v12h-12zM188 76h18v10h-18z" />
        {/* E */}
        <path fill="url(#zbeamWordFill)" d="M248 0h86v32h-50v26h50v32h-50v40h50v32h-86V0Z" />
        <path fill="#29272d" d="M248 108h86v54h-86z" opacity="0.94" />
        {/* A */}
        <path fill="url(#zbeamWordFill)" d="M344 0h86v162h-36V108h-14v54h-36V0Zm36 32v44h14V32h-14Z" />
        <path fill="#29272d" d="M344 108h36v54h-36zM394 108h36v54h-36z" opacity="0.94" />
        <path fill="#29272d" d="M380 32h14v44h-14z" />
        {/* M */}
        <path fill="url(#zbeamWordFill)" d="M440 0h34v32h10V0h20v162h-34V88h-10v74h-20V0Z" />
        <path fill="#29272d" d="M440 108h20v54h-20zM470 88h34v74h-34z" opacity="0.94" />
        <path fill="#29272d" d="M474 32h10v32h-10z" />
      </g>
    </svg>
  );
}
