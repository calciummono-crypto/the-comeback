import type { Metadata } from "next";
import { DEFAULT_THEME_ID, THEME_PRESETS } from "@/lib/theme";
import type { ReactNode } from "react";
import "./globals.css";
import HoverTick from "./HoverTick";
import MinecraftBackdrop from "./MinecraftBackdrop";

export const metadata: Metadata = {
  title: "Z-BEAM",
  description:
    "Spin up Minecraft bots, watch them join servers, and control them from Z-BEAM.",
};

/**
 * Applies the saved preset before first paint: the accent ramp AND the
 * Minecraft sunset scene, so neither flashes the default on load.
 */
const PREPAINT_THEME = `(function(){try{
var P=${JSON.stringify(
  THEME_PRESETS.map((p) => ({ id: p.id, ramp: p.ramp, sunset: p.sunset })),
)};
var d=${JSON.stringify(DEFAULT_THEME_ID)};
var s=localStorage.getItem("mcbm:theme")||d;
var p=null;for(var i=0;i<P.length;i++)if(P[i].id===s)p=P[i];
if(!p)for(var j=0;j<P.length;j++)if(P[j].id===d)p=P[j];
if(!p)p=P[0];
var F=["emerald","teal","cyan","violet","indigo","fuchsia","purple"];
var R=["200","300","400","500","600","700","900","950"];
for(var a=0;a<F.length;a++)for(var b=0;b<R.length;b++){
  document.documentElement.style.setProperty("--color-"+F[a]+"-"+R[b],p.ramp[R[b]]||p.ramp["500"]);
}
var S=p.sunset;
for(var k in S)document.documentElement.style.setProperty("--mc-"+k,S[k]);
}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
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
