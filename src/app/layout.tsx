import type { Metadata } from "next";
import { Inter, Sora, IBM_Plex_Mono } from "next/font/google";
import { DEFAULT_THEME_ID, THEME_PRESETS } from "@/lib/theme";
import type { ReactNode } from "react";
import "./globals.css";
import HoverTick from "./HoverTick";
import MinecraftBackdrop from "./MinecraftBackdrop";

/* Self-hosted via next/font. The previous setup hit Google Fonts twice — once
   from globals.css and once from LandingPage's style block — through a
   render-blocking CSS import. next/font downloads the files at build time,
   serves them from our own origin, and injects size-adjusted @font-face rules
   with no extra round trip. */
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["600", "700", "800"],
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Z-BEAM",
  description:
    "Spin up Minecraft bots, watch them join servers, and control them from Z-BEAM.",
};

/**
 * Applies the saved preset before first paint: the accent ramp AND the
 * Minecraft sunset scene, so neither flashes the default on load.
 *
 * Also stamps `data-perf="low"` on <html> for weak hardware. The flag is set
 * here, before first paint, so the expensive rules (backdrop-filter, the
 * drifting clouds, the water shimmer) never apply in the first place rather
 * than being torn down after a frame of jank.
 */
const PREPAINT_THEME = `(function(){try{
var d=document.documentElement;
var c=navigator.hardwareConcurrency||4;
var m=navigator.deviceMemory;
var b=navigator.connection&&navigator.connection.saveData;
var l=c<=4||(m!==undefined&&m<=4)||b===true||navigator.userAgent.indexOf("Android 4")>-1||
  (navigator.userAgent.match(/Android/)&&c<=4)||
  (navigator.userAgent.indexOf("MSIE")>-1);
if(l)d.setAttribute("data-perf","low");
var P=${JSON.stringify(
  THEME_PRESETS.map((p) => ({ id: p.id, ramp: p.ramp, sunset: p.sunset })),
)};
var def=${JSON.stringify(DEFAULT_THEME_ID)};
var s=localStorage.getItem("mcbm:theme")||def;
var p=null;for(var i=0;i<P.length;i++)if(P[i].id===s)p=P[i];
if(!p)for(var j=0;j<P.length;j++)if(P[j].id===def)p=P[j];
if(!p)p=P[0];
var F=["emerald","teal","cyan","violet","indigo","fuchsia","purple"];
var R=["200","300","400","500","600","700","900","950"];
for(var a=0;a<F.length;a++)for(var b2=0;b2<R.length;b2++){
  d.style.setProperty("--color-"+F[a]+"-"+R[b2],p.ramp[R[b2]]||p.ramp["500"]);
}
var S=p.sunset;
for(var k in S)d.style.setProperty("--mc-"+k,S[k]);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${sora.variable} ${plexMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREPAINT_THEME }} />
      </head>
      <body className="min-h-screen bg-[#0a0c15] text-slate-100 antialiased">
        <MinecraftBackdrop />
        <HoverTick />
        {children}
      </body>
    </html>
  );
}
