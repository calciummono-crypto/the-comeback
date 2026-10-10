"use client";

import { useEffect, useState } from "react";
import { onToast, Toast, ToastKind } from "./toast";

// Single global toast surface — mounted once by AppShell. Auto-dismisses.

const STYLES: Record<ToastKind, string> = {
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-200 shadow-[0_8px_30px_color-mix(in_srgb,var(--color-emerald-500)_15%,transparent)]",
  error:
    "border-rose-500/30 bg-rose-500/10 text-rose-200 shadow-[0_8px_30px_rgba(244,63,94,0.15)]",
  info: "border-slate-600/40 bg-slate-800/90 text-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.35)]",
};

const DOT: Record<ToastKind, string> = {
  success: "bg-emerald-400",
  error: "bg-rose-400",
  info: "bg-sky-400",
};

const TOAST_LIFETIME = 3500;
// Must match the mc-toast-out duration in globals.css.
const TOAST_EXIT_MS = 200;

export default function ToastHost() {
  const [toasts, setToasts] = useState<(Toast & { leaving?: boolean })[]>([]);

  useEffect(() => {
    // Toast ids are unique and monotonically increasing, so each toast owns its
    // own exit sequence. Every timeout it schedules is tracked here so a fast
    // remount (StrictMode, route change) can cancel them.
    const timers: ReturnType<typeof setTimeout>[] = [];
    const push = (ms: number, fn: () => void) => {
      timers.push(setTimeout(fn, ms));
    };

    const stop = onToast((t) => {
      setToasts((prev) => [...prev.filter((x) => x.id !== t.id), t].slice(-5));

      push(TOAST_LIFETIME, () => {
        setToasts((prev) => prev.map((x) => (x.id === t.id ? { ...x, leaving: true } : x)));
        push(TOAST_EXIT_MS, () => {
          setToasts((prev) => prev.filter((x) => x.id !== t.id));
        });
      });
    });

    return () => {
      stop();
      timers.forEach(clearTimeout);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-[13px] font-medium backdrop-blur-xl ${
            t.leaving ? "animate-toast-out" : "animate-pop-in"
          } ${STYLES[t.kind]}`}
          role="status"
        >
          <span className={`h-2 w-2 shrink-0 rounded-full ${DOT[t.kind]}`} />
          {t.text}
        </div>
      ))}
    </div>
  );
}
