import { useEffect, useRef, useState } from "react";
import type { ReactNode, SVGProps } from "react";
import { useApp } from "./store";

/* ------------------------------ icons ------------------------------ */

const PATHS: Record<string, ReactNode> = {
  bolt: <path d="M13 2 4.5 13.5H11L9.5 22 19 10h-6.5L13 2Z" />,
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 13 4.5a4 4 0 0 1 5.7 5.7l-2 2" />
      <path d="M13 17.5 11 19.5a4 4 0 0 1-5.7-5.7l2-2" />
    </>
  ),
  film: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7.5 4v16M16.5 4v16M3 9h4.5M3 15h4.5M16.5 9H21M16.5 15H21" />
    </>
  ),
  mic: (
    <>
      <rect x="9" y="3" width="6" height="11" rx="3" />
      <path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3" />
    </>
  ),
  type: <path d="M5 7V4.5h14V7M12 4.5v15M8.5 19.5h7" />,
  music: (
    <>
      <path d="M9 18.5V6l10-2.5V16" />
      <circle cx="6.5" cy="18.5" r="2.5" />
      <circle cx="16.5" cy="16" r="2.5" />
    </>
  ),
  download: <path d="M12 3.5v11M7 10.5l5 5 5-5M4.5 20.5h15" />,
  refresh: (
    <>
      <path d="M20 11.5A8 8 0 1 0 18.9 15" />
      <path d="M20 5.5v6h-6" />
    </>
  ),
  check: <path d="M4.5 12.5 10 18 19.5 6.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  arrowR: <path d="M4 12h15M13 5.5l6.5 6.5-6.5 6.5" />,
  arrowL: <path d="M20 12H5M11 5.5 4.5 12l6.5 6.5" />,
  play: <path d="M8 5.5v13l10-6.5-10-6.5Z" />,
  zip: (
    <>
      <path d="M4 8.5 12 4l8 4.5v9L12 22l-8-4.5v-9Z" />
      <path d="M4 8.5 12 13l8-4.5M12 13v9" />
    </>
  ),
  paw: (
    <>
      <circle cx="7" cy="8" r="1.8" />
      <circle cx="12" cy="6" r="1.8" />
      <circle cx="17" cy="8" r="1.8" />
      <path d="M12 11c-3 0-5.5 2.6-5.5 5 0 1.6 1.2 2.5 2.6 2.5 1.1 0 1.9-.6 2.9-.6s1.8.6 2.9.6c1.4 0 2.6-.9 2.6-2.5 0-2.4-2.5-5-5.5-5Z" />
    </>
  ),
  box: (
    <>
      <path d="M4 8 12 3.5 20 8v8l-8 4.5L4 16V8Z" />
      <path d="M4 8l8 4.5L20 8M12 12.5V20.5" />
    </>
  ),
  gauge: (
    <>
      <path d="M4 16a8.5 8.5 0 1 1 16 0" />
      <path d="M12 16l4-5.5" />
      <circle cx="12" cy="16" r="1.4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3.5 19.5c.6-3.4 2.8-5.5 5.5-5.5s4.9 2.1 5.5 5.5" />
      <path d="M15.5 5.6a3.5 3.5 0 0 1 0 5.9M17.5 14.4c1.7.8 2.7 2.6 3 5.1" />
    </>
  ),
  tag: (
    <>
      <path d="m12.5 3.5 8 8-9 9-8-8v-6.5a2.5 2.5 0 0 1 2.5-2.5h6.5Z" />
      <circle cx="8.5" cy="8.5" r="1.4" />
    </>
  ),
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <rect x="10" y="10" width="4" height="4" />
      <path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.8v3M12 18.2v3M2.8 12h3M18.2 12h3M5.5 5.5l2.1 2.1M16.4 16.4l2.1 2.1M18.5 5.5l-2.1 2.1M7.6 16.4l-2.1 2.1" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="14.5" r="4.5" />
      <path d="M11.5 11 20 2.5M16.5 6l2.5 2.5M14 8.5l2 2" />
    </>
  ),
  pulse: <path d="M2.5 12h4l2.5-6.5L13 18l2.5-6h6" />,
  cart: (
    <>
      <path d="M3 4h2.5l2.2 11h11L21 7.5H6.2" />
      <circle cx="9.5" cy="19.5" r="1.6" />
      <circle cx="17" cy="19.5" r="1.6" />
    </>
  ),
  external: (
    <>
      <path d="M13.5 4.5H19.5V10.5" />
      <path d="M19.5 4.5 11 13" />
      <path d="M19.5 14v4a1.5 1.5 0 0 1-1.5 1.5H6A1.5 1.5 0 0 1 4.5 18V6A1.5 1.5 0 0 1 6 4.5h4" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: <path d="m12 3 2.7 5.8 6.3.8-4.6 4.4 1.2 6.2L12 17.2 6.4 20.2l1.2-6.2L3 9.6l6.3-.8L12 3Z" />,
  wallet: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 9.5h18M16.5 14.5h1.5" />
    </>
  ),
  layers: (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3.5 12.5 8.5 4.7 8.5-4.7M3.5 16.5 12 21.2l8.5-4.7" />
    </>
  ),
  terminal: (
    <>
      <rect x="3" y="4.5" width="18" height="15" rx="2.5" />
      <path d="m7 9.5 3 2.7-3 2.8M12.5 15h5" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4.5H6.5v15H14" />
      <path d="M10 12h11M17.5 8.5 21 12l-3.5 3.5" />
    </>
  ),
};

export function I({
  n,
  size = 18,
  fill = false,
  ...rest
}: { n: keyof typeof PATHS | string; size?: number; fill?: boolean } & Omit<SVGProps<SVGSVGElement>, "fill">) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={fill ? 0 : 1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {PATHS[n] ?? null}
    </svg>
  );
}

export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <rect x="1.5" y="1.5" width="29" height="29" rx="8" fill="var(--panel-2)" stroke="var(--line-strong)" />
      <path d="M8.5 22.5v-12l6.5 8.5 3-4 5.5 7.5z" fill="var(--acc)" />
      <circle cx="23" cy="9.5" r="2.4" fill="var(--mint)" />
    </svg>
  );
}

/* --------------------------- motion helpers ------------------------ */

const reduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (reduced()) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className={`reveal ${on ? "on" : ""} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
}

const GLYPHS = "█▓▒░<>/\\+*#%@";

export function Scramble({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const [out, setOut] = useState(() => (reduced() ? text : ""));
  useEffect(() => {
    if (reduced()) {
      setOut(text);
      return;
    }
    let frame = 0;
    let raf = 0;
    const total = Math.max(22, Math.round(text.length * 1.6));
    const tick = () => {
      frame++;
      const settled = Math.floor((frame / total) * text.length);
      let s = "";
      for (let i = 0; i < text.length; i++) {
        if (i < settled) s += text[i];
        else s += text[i] === " " ? " " : GLYPHS[(i * 7 + frame * 3) % GLYPHS.length];
      }
      if (settled >= text.length) {
        setOut(text);
        return;
      }
      setOut(s);
      raf = requestAnimationFrame(tick);
    };
    const t = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [text, delay]);
  return (
    <span className={className} aria-label={text}>
      {out || "\u00A0"}
    </span>
  );
}

export function Marquee({ items, accent = false }: { items: string[]; accent?: boolean }) {
  const row = items.map((t, i) => (
    <span key={i} className="flex items-center">
      <span className={`mx-6 ${i % 2 ? "stroke-word" : ""}`}>{t}</span>
      <span className={accent ? "text-[var(--acc)]" : "text-[var(--mint)]"}>✦</span>
    </span>
  ));
  return (
    <div className="marquee overflow-hidden py-3" aria-hidden="true">
      <div className="marquee-track font-display text-sm font-semibold tracking-[0.18em] uppercase text-[var(--muted)]">
        <div className="flex items-center">{row}</div>
        <div className="flex items-center">{row}</div>
      </div>
    </div>
  );
}

export function SectionHead({
  kicker,
  title,
  sub,
  right,
}: {
  kicker: string;
  title: ReactNode;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        <p className="kicker mb-4">{kicker}</p>
        <h2 className="font-display text-4xl leading-[1.04] font-bold text-[var(--ink)] sm:text-5xl">
          {title}
        </h2>
        {sub && <p className="mt-4 max-w-xl text-[17px] text-[var(--muted)]">{sub}</p>}
      </div>
      {right}
    </Reveal>
  );
}

/* ------------------------------ toaster ---------------------------- */

export function Toaster() {
  const { toasts } = useApp();
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-[70] flex w-[320px] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="status"
          className="toast-in panel-flat flex items-start gap-3 border-l-2 px-4 py-3"
          style={{ borderLeftColor: t.kind === "ok" ? "var(--mint)" : t.kind === "warn" ? "var(--amber)" : "var(--acc)" }}
        >
          <span className="mt-0.5" style={{ color: t.kind === "ok" ? "var(--mint)" : t.kind === "warn" ? "var(--amber)" : "var(--acc)" }}>
            <I n={t.kind === "ok" ? "check" : t.kind === "warn" ? "bolt" : "film"} size={16} />
          </span>
          <p className="text-[13.5px] leading-snug text-[var(--ink)]">{t.msg}</p>
        </div>
      ))}
    </div>
  );
}

export function Pill({ children, tone = "mint" }: { children: ReactNode; tone?: "mint" | "acc" | "amber" | "dim" }) {
  const map = {
    mint: "bg-[var(--mint-soft)] text-[var(--mint)]",
    acc: "bg-[var(--acc-soft)] text-[var(--acc)]",
    amber: "bg-[var(--amber-soft)] text-[var(--amber)]",
    dim: "bg-[var(--panel-3)] text-[var(--muted)]",
  } as const;
  return (
    <span className={`mono inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10.5px] font-semibold tracking-[0.14em] uppercase ${map[tone]}`}>
      {children}
    </span>
  );
}
