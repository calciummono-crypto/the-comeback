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

    const drop = (startAt: number, baseFreq: number, volume: number) => {
      const audio = audioRef.current;
      if (!audio) return;

      const osc = audio.createOscillator();
      const gain = audio.createGain();
      const filter = audio.createBiquadFilter();

      osc.type = "sine";
      osc.frequency.setValueAtTime(baseFreq, startAt);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.55, startAt + 0.09);

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1200, startAt);
      filter.frequency.exponentialRampToValueAtTime(460, startAt + 0.11);

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.12);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(audio.destination);
      osc.start(startAt);
      osc.stop(startAt + 0.14);
    };

    const playDrop = () => {
      const now = performance.now();
      if (now - lastAtRef.current < 120) return;
      lastAtRef.current = now;

      const audio = getAudio();
      if (!audio) return;
      if (audio.state === "suspended") void audio.resume().catch(() => {});

      const t = audio.currentTime;
      drop(t, 520, 0.032);
      drop(t + 0.055, 300, 0.018);
    };

    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const interactive = target?.closest('button, a, [role="button"], input[type="button"], input[type="submit"]');
      if (!interactive || interactive.getAttribute("aria-disabled") === "true") return;
      if (interactive instanceof HTMLButtonElement && interactive.disabled) return;
      if (interactive instanceof HTMLInputElement && interactive.disabled) return;
      playDrop();
    };

    document.addEventListener("click", onClick, { passive: true });
    return () => {
      document.removeEventListener("click", onClick);
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
