"use client";

import { useEffect, useRef } from "react";

export default function HoverTick() {
  const audioRef = useRef<AudioContext | null>(null);
  const lastAtRef = useRef(0);

  useEffect(() => {
    const getAudio = () => {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      if (!audioRef.current) audioRef.current = new Ctx();
      return audioRef.current;
    };

    const tick = () => {
      const now = performance.now();
      if (now - lastAtRef.current < 45) return;
      lastAtRef.current = now;

      const audio = getAudio();
      if (!audio) return;
      if (audio.state === "suspended") void audio.resume().catch(() => {});

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(880, audio.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, audio.currentTime + 0.025);
      gain.gain.setValueAtTime(0.0001, audio.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.035, audio.currentTime + 0.006);
      gain.gain.exponentialRampToValueAtTime(0.0001, audio.currentTime + 0.045);
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.start();
      osc.stop(audio.currentTime + 0.05);
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (!interactive || interactive.getAttribute("aria-disabled") === "true") return;
      tick();
    };

    document.addEventListener("pointerover", onPointerOver, { passive: true });
    return () => {
      document.removeEventListener("pointerover", onPointerOver);
      void audioRef.current?.close().catch(() => {});
      audioRef.current = null;
    };
  }, []);

  return null;
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
