"use client";

import { useMemo } from "react";

/**
 * Procedural Minecraft sunset scene.
 *
 * Reproduces the 2011-era r/Minecraft wallpaper: a blocky graded sky, a
 * pixelated sun sitting on the horizon, drifting cube clouds, a stepped
 * treeline silhouette and reflective water below. Everything is drawn from
 * `--mc-*` CSS variables, so changing the theme preset re-tints the world
 * without re-rendering a single node.
 *
 * The scene is fixed behind the whole app at `z-index: -1` and never captures
 * pointer events. All placement is seeded so server and client render the
 * identical layout (no hydration mismatch).
 */

const W = 1600;
const H = 900;
const HORIZON = 560;

/** Deterministic PRNG — same seed, same scene, every render. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Block = { x: number; y: number; w: number; h: number; o: number };

/** A cloud built from a handful of stacked cubes, snapped to a 16px grid. */
function makeCloud(rand: () => number): Block[] {
  const baseY = 60 + Math.floor(rand() * 320 / 16) * 16;
  const baseX = Math.floor(rand() * W);
  const cubes = 3 + Math.floor(rand() * 4);
  const blocks: Block[] = [];
  let x = baseX;
  for (let i = 0; i < cubes; i++) {
    const w = 48 + Math.floor(rand() * 4) * 16;
    const h = 16 + Math.floor(rand() * 2) * 16;
    blocks.push({ x, y: baseY, w, h, o: 0.5 + rand() * 0.4 });
    x += w - 16;
  }
  return blocks;
}

/** Stepped terrain: a random-walk ridge, squared off into blocky columns. */
function makeTreeline(rand: () => number): { x: number; h: number }[] {
  const cols: { x: number; h: number }[] = [];
  let height = 70;
  for (let x = 0; x < W + 32; x += 32) {
    height += (rand() - 0.5) * 46;
    // Tall spikes read as spruce trunks, the classic MC treeline.
    if (rand() > 0.86) height += 40 + rand() * 55;
    height = Math.max(34, Math.min(190, height));
    cols.push({ x, h: Math.round(height / 16) * 16 });
  }
  return cols;
}

function makeStars(rand: () => number): Block[] {
  const stars: Block[] = [];
  for (let i = 0; i < 90; i++) {
    const s = rand() > 0.85 ? 3 : 2;
    stars.push({
      x: Math.floor(rand() * W),
      y: Math.floor(rand() * (HORIZON - 340)),
      w: s,
      h: s,
      o: 0.18 + rand() * 0.5,
    });
  }
  return stars;
}

export default function MinecraftBackdrop() {
  const { stars, clouds, treeline, water } = useMemo(() => {
    const cloudRand = mulberry32(0xc10d);
    const skyRand = mulberry32(0x5eed);
    const waterRand = mulberry32(0xbeef);
    const shimmer: Block[] = [];
    for (let y = HORIZON; y < H; y += 12) {
      const depth = (y - HORIZON) / (H - HORIZON);
      // Bands widen with depth, as ripples do in perspective.
      const w = 120 + depth * 760;
      shimmer.push({
        x: W / 2 - w / 2 + (waterRand() - 0.5) * 260 * depth,
        y,
        w,
        h: 4,
        o: Math.max(0, 0.5 - depth * 0.46) * (0.5 + waterRand() * 0.5),
      });
    }
    return {
      stars: makeStars(skyRand),
      clouds: Array.from({ length: 9 }, () => makeCloud(cloudRand)),
      treeline: makeTreeline(mulberry32(0x7ee5)),
      water: shimmer,
    };
  }, []);

  return (
    <div className="mc-backdrop" aria-hidden="true">
      <svg
        className="mc-scene"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMax slice"
        role="presentation"
      >
        <defs>
          <linearGradient id="mc-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--mc-zenith)" />
            <stop offset="46%" stopColor="var(--mc-dusk)" />
            <stop offset="86%" stopColor="var(--mc-horizon)" />
            <stop offset="100%" stopColor="var(--mc-glow)" />
          </linearGradient>

          <linearGradient id="mc-water" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--mc-glow)" stopOpacity="0.42" />
            <stop offset="30%" stopColor="var(--mc-water)" />
            <stop offset="100%" stopColor="var(--mc-zenith)" />
          </linearGradient>

          <radialGradient id="mc-sun-halo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--mc-glow)" stopOpacity="0.75" />
            <stop offset="55%" stopColor="var(--mc-glow)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--mc-glow)" stopOpacity="0" />
          </radialGradient>

          <filter id="mc-soft" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="14" />
          </filter>

          <clipPath id="mc-above-water">
            <rect x="0" y="0" width={W} height={HORIZON} />
          </clipPath>
        </defs>

        {/* Sky */}
        <rect x="0" y="0" width={W} height={HORIZON} fill="url(#mc-sky)" />

        {/* Stars, only in the deep upper sky */}
        <g clipPath="url(#mc-above-water)">
          {stars.map((s, i) => (
            <rect
              key={`s${i}`}
              x={s.x}
              y={s.y}
              width={s.w}
              height={s.h}
              fill="#fff"
              opacity={s.o}
            />
          ))}
        </g>

        {/* Sun halo + blocky sun disc sitting on the horizon.
            The halo is a separate element so its glow can breathe via opacity
            alone — animating a `filter` repaints the whole disc every frame. */}
        <circle
          className="mc-sun-halo"
          cx={W / 2}
          cy={HORIZON - 6}
          r={300}
          fill="url(#mc-sun-halo)"
          filter="url(#mc-soft)"
        />
        <g className="mc-sun">
          {[
            [0, 0, 128, 96],
            [16, -16, 96, 16],
            [0, -8, 128, 8],
            [16, 96, 96, 16],
            [-8, 16, 8, 64],
            [128, 16, 8, 64],
          ].map(([x, y, w, h], i) => (
            <rect
              key={`sun${i}`}
              x={W / 2 - 64 + x}
              y={HORIZON - 78 + y}
              width={w}
              height={h}
              fill="var(--mc-sun)"
            />
          ))}
        </g>

        {/* Cube clouds, drifting slowly across the sky */}
        <g className="mc-clouds" clipPath="url(#mc-above-water)">
          {clouds.map((cloud, ci) => (
            <g key={`c${ci}`} className="mc-cloud" style={{ animationDelay: `${ci * -7}s` }}>
              {cloud.map((b, bi) => (
                <rect
                  key={`c${ci}-${bi}`}
                  x={b.x}
                  y={b.y}
                  width={b.w}
                  height={b.h}
                  fill="var(--mc-glow)"
                  opacity={b.o * 0.22}
                />
              ))}
            </g>
          ))}
        </g>

        {/* Water */}
        <rect
          x="0"
          y={HORIZON}
          width={W}
          height={H - HORIZON}
          fill="url(#mc-water)"
        />

        {/* Reflected treeline — flipped, dimmed, squashed into the water */}
        <g
          className="mc-reflection"
          transform={`translate(0 ${HORIZON * 2}) scale(1 -0.45)`}
        >
          {treeline.map((c) => (
            <rect
              key={`rt${c.x}`}
              x={c.x}
              y={HORIZON - c.h}
              width={32}
              height={c.h + 8}
              fill="var(--mc-silhouette)"
            />
          ))}
        </g>

        {/* Sun glitter column on the water */}
        <g>
          {water.map((b, i) => (
            <rect
              key={`w${i}`}
              x={b.x}
              y={b.y}
              width={b.w}
              height={b.h}
              fill="var(--mc-shimmer)"
              opacity={b.o}
            />
          ))}
        </g>

        {/* Blocky wave caps along the horizon */}
        <g>
          {Array.from({ length: 46 }).map((_, i) => (
            <rect
              key={`wav${i}`}
              x={i * 36 - 8}
              y={HORIZON + ((i * 13) % 7)}
              width={28}
              height={5}
              fill="var(--mc-shimmer)"
              opacity={0.1 + ((i * 7) % 5) * 0.03}
            />
          ))}
        </g>

        {/* Treeline silhouette, drawn last so it sits in front of the sun */}
        <g className="mc-treeline">
          {treeline.map((c) => (
            <rect
              key={`t${c.x}`}
              x={c.x}
              y={HORIZON - c.h}
              width={32}
              height={c.h + 8}
              fill="var(--mc-silhouette)"
            />
          ))}
        </g>

        {/* Ground plane under the trees */}
        <rect
          x="0"
          y={HORIZON - 6}
          width={W}
          height={14}
          fill="var(--mc-silhouette)"
        />
      </svg>

      {/* Legibility scrim + the pixel grid that reads as "Minecraft" up close */}
      <div className="mc-scrim" />
      <div className="mc-grid" />
    </div>
  );
}
