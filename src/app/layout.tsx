import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Comeback — MC Bot Manager",
  description:
    "Spin up Minecraft bots, watch them join servers, and drive the beam from one console.",
};

export const viewport: Viewport = {
  themeColor: "#07040a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-dvh">
        <div className="sunset" aria-hidden />
        <div className="tree-line" aria-hidden />
        {children}
      </body>
    </html>
  );
}
