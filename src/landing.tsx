import { useEffect, useMemo, useRef, useState } from "react";
import { FAQS, NICHES, STACK_ROWS, TESTIMONIALS, THUMBS, fmtMoney } from "./data";
import type { Niche, NicheId } from "./data";
import { I, Logo, Marquee, Pill, Reveal, Scramble, SectionHead } from "./ui";
import { useApp } from "./store";

/* ------------------------------- nav ------------------------------- */

function Nav() {
  const { view, setView, credits } = useApp();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const anchors: [string, string][] = [
    ["Lanes", "#lanes"],
    ["Autopilot", "#autopilot"],
    ["Stack", "#stack"],
    ["Packs", "#packs"],
    ["FAQ", "#faq"],
  ];
  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-[var(--line)] bg-[rgba(12,19,16,0.88)] backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <button className="flex items-center gap-2.5" onClick={() => setView("home")} aria-label="Reelmatic home">
          <Logo />
          <span className="font-display text-lg font-bold tracking-tight">REELMATIC</span>
          <span className="chip hidden sm:inline-flex">free app</span>
        </button>
        {view === "home" && (
          <nav className="mono hidden items-center gap-6 text-[11.5px] tracking-[0.14em] uppercase text-[var(--muted)] lg:flex">
            {anchors.map(([label, href]) => (
              <a key={href} href={href} className="transition-colors hover:text-[var(--acc)]">
                {label}
              </a>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("studio")}
            className="mono hidden items-center gap-2 rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 text-[11px] tracking-[0.14em] uppercase text-[var(--amber)] transition-colors hover:border-[var(--amber)] sm:flex"
          >
            <I n="wallet" size={14} /> {credits} credits
          </button>
          <button className="btn btn-ghost hidden px-4 py-2 text-[13px] md:inline-flex" onClick={() => setView("admin")}>
            <I n="gear" size={15} /> Admin
          </button>
          <button className="btn btn-acc px-4 py-2 text-[14px]" onClick={() => setView("studio")}>
            Open Studio <I n="arrowR" size={15} />
          </button>
        </div>
      </div>
    </header>
  );
}

/* ------------------------- live render console ---------------------- */

interface Scenario {
  cmd: string;
  lines: [string, string][];
  target: number;
  ready: number;
}

const SCENARIOS: Record<NicheId, Scenario> = {
  dropship: {
    cmd: "reelmatic run --lane dropship --url aliexpress.com/item/galaxy-projector",
    lines: [
      ["scrape", "title · price · 6 review angles .......... ok 0.8s"],
      ["hooks", "llama-3.1-70b · 25-hook matrix ........... ok 1.2s"],
      ["script", "100 variants · avg 21s runtime ........... ok 2.1s"],
      ["voice", 'kokoro "maya" · 100 energetic clips ...... ok 3.4s'],
      ["capt", "whisper-v3 · karaoke bold burn-in ........ ok 1.1s"],
      ["render", "wan-2.1 · 9:16 · batch 2/4 ............... running"],
    ],
    target: 62,
    ready: 62,
  },
  pets: {
    cmd: "reelmatic run --lane pets --url chewy.com/no-pull-harness",
    lines: [
      ["scrape", "title · breed fit · 5 pain points ........ ok 0.7s"],
      ["hooks", "llama-3.1-70b · feeling-first matrix ..... ok 1.0s"],
      ["script", "100 variants · 4:5 + 1:1 cuts ............ ok 1.9s"],
      ["voice", 'kokoro "jon" · warm narrator ............. ok 3.0s'],
      ["capt", "whisper-v3 · clean sub burn-in ........... ok 1.0s"],
      ["render", "wan-2.1 · batch 3/4 ...................... running"],
    ],
    target: 78,
    ready: 78,
  },
  amazon: {
    cmd: "reelmatic run --lane amazon --url amazon.com/dp/laptop-stand",
    lines: [
      ["scrape", "listing · spec sheet · Q&A ............... ok 0.6s"],
      ["hooks", "llama-3.1-70b · demo-first matrix ........ ok 0.9s"],
      ["script", "100 variants · 16:9 + 9:16 ............... ok 1.7s"],
      ["voice", 'kokoro "ava" · confident demo ............ ok 2.8s'],
      ["capt", "whisper-v3 · spec callouts ............... ok 0.9s"],
      ["render", "wan-2.1 · batch 4/4 ...................... running"],
    ],
    target: 91,
    ready: 91,
  },
};

function Console({ niche, onNiche }: { niche: NicheId; onNiche: (n: NicheId) => void }) {
  const s = SCENARIOS[niche];
  const [shown, setShown] = useState(0);
  const [prog, setProg] = useState(0);
  const reduced = useRef(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  useEffect(() => {
    setShown(0);
    setProg(0);
    if (reduced.current) {
      setShown(s.lines.length);
      setProg(s.target);
      return;
    }
    let i = 0;
    const lineTimer = window.setInterval(() => {
      i++;
      setShown(i);
      if (i >= s.lines.length) window.clearInterval(lineTimer);
    }, 620);
    const progTimer = window.setInterval(() => {
      setProg((p) => (p >= s.target ? p : p + 1));
    }, 55);
    return () => {
      window.clearInterval(lineTimer);
      window.clearInterval(progTimer);
    };
  }, [s]);

  return (
    <div className="panel-flat relative overflow-hidden rounded-2xl border-[var(--line-strong)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f2545b]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--mint)]" />
        </div>
        <span className="mono text-[10.5px] tracking-[0.18em] text-[var(--dim)] uppercase">autopilot · live job</span>
        <span className="flex items-center gap-1.5">
          <span className="live-dot h-2 w-2 rounded-full bg-[var(--mint)]" />
          <span className="mono text-[10.5px] tracking-[0.14em] text-[var(--mint)] uppercase">rendering</span>
        </span>
      </div>
      <div className="flex gap-2 border-b border-[var(--line)] px-4 py-2.5">
        {NICHES.map((n) => (
          <button
            key={n.id}
            onClick={() => onNiche(n.id)}
            className={`mono rounded-md px-3 py-1.5 text-[10.5px] tracking-[0.14em] uppercase transition-all ${
              niche === n.id
                ? "bg-[var(--acc)] font-bold text-[#17100b]"
                : "text-[var(--muted)] hover:bg-[var(--panel-3)] hover:text-[var(--ink)]"
            }`}
          >
            {n.id === "dropship" ? "dropship" : n.id === "pets" ? "pet supply" : "amazon"}
          </button>
        ))}
      </div>
      <div className="mono min-h-[264px] px-4 py-4 text-[12px] leading-[1.9] sm:text-[12.5px]">
        <p className="text-[var(--muted)]">
          <span className="text-[var(--mint)]">$</span> {s.cmd}
        </p>
        {s.lines.slice(0, shown).map(([tag, body], i) => (
          <p key={niche + i} className="hero-rise whitespace-pre-wrap text-[var(--muted)]">
            <span className="text-[var(--acc)]">▸ {tag.padEnd(6)}</span> {body}
          </p>
        ))}
        <p className="text-[var(--ink)]">
          <span className="cursor-blink text-[var(--acc)]">█</span>
        </p>
      </div>
      <div className="border-t border-[var(--line)] px-4 py-3.5">
        <div className="mb-2 flex items-center justify-between">
          <span className="mono text-[10.5px] tracking-[0.16em] text-[var(--dim)] uppercase">render progress</span>
          <span className="mono text-[12px] font-semibold text-[var(--amber)]">
            {Math.round((prog / 100) * 100)}/100 masters
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--panel-3)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--acc)] to-[var(--amber)] transition-[width] duration-150"
            style={{ width: `${prog}%` }}
          />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- hero ------------------------------ */

function Hero() {
  const { setView, lifetimeVideos } = useApp();
  const [niche, setNiche] = useState<NicheId>("dropship");
  return (
    <section className="relative mx-auto max-w-7xl px-5 pt-14 pb-20 sm:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="kicker hero-rise mb-6">The niche video machine</p>
          <h1 className="font-display text-[13.5vw] leading-[0.98] font-extrabold tracking-tight sm:text-7xl lg:text-[76px]">
            <span className="hero-rise block" style={{ animationDelay: "80ms" }}>
              One link in.
            </span>
            <span className="block text-[var(--acc)]" style={{ animation: "riseIn 0.8s 0.2s cubic-bezier(0.2,0.7,0.2,1) both" }}>
              <Scramble text="100 ads out." delay={500} />
            </span>
            <span className="stroke-word block" style={{ animation: "riseIn 0.8s 0.34s cubic-bezier(0.2,0.7,0.2,1) both" }}>
              Zero thinking.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg text-[var(--muted)]" style={{ animation: "riseIn 0.8s 0.45s cubic-bezier(0.2,0.7,0.2,1) both" }}>
            Reelmatic is preprogrammed for your exact niche — hooks, scripts, voiceover, captions, music. Paste a
            product link, walk away, come back to a folder of ready-to-post ads.{" "}
            <strong className="font-semibold text-[var(--ink)]">The app is free. You only buy video packs.</strong>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4" style={{ animation: "riseIn 0.8s 0.55s cubic-bezier(0.2,0.7,0.2,1) both" }}>
            <button className="btn btn-acc px-6 py-3.5 text-[15px]" onClick={() => setView("studio")}>
              Open the Studio <span className="mono text-[12px] font-bold opacity-80">12 free videos</span>
              <I n="arrowR" size={16} />
            </button>
            <a href="#lanes" className="btn btn-ghost px-6 py-3.5 text-[15px]">
              Pick your lane <I n="play" size={15} />
            </a>
          </div>
          <div
            className="mono mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-[11.5px] tracking-[0.1em] text-[var(--dim)] uppercase"
            style={{ animation: "riseIn 0.8s 0.65s cubic-bezier(0.2,0.7,0.2,1) both" }}
          >
            <span className="flex items-center gap-2">
              <I n="pulse" size={14} />
              <span className="text-[var(--muted)]">{lifetimeVideos.toLocaleString()}</span> videos rendered
            </span>
            <span>
              <span className="text-[var(--muted)]">14,204</span> stores
            </span>
            <span>
              <span className="text-[var(--muted)]">$0.041</span> avg render cost
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[var(--amber)]">
                <I n="star" size={13} fill />
              </span>
              4.9 from 2,310 packs
            </span>
          </div>
        </div>
        <div className="lg:col-span-5" style={{ animation: "riseIn 0.9s 0.3s cubic-bezier(0.2,0.7,0.2,1) both" }}>
          <Console niche={niche} onNiche={setNiche} />
          <p className="mono mt-3 text-center text-[10.5px] tracking-[0.16em] text-[var(--dim)] uppercase">
            ↑ real pipeline · switch lanes to preview
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- lanes ------------------------------ */

function Postcard({ src, alt, tilt, className, hue }: { src: string; alt: string; tilt: number; className: string; hue: number }) {
  return (
    <div
      className={`floaty absolute overflow-hidden rounded-xl border border-[var(--line-strong)] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:!rotate-0 hover:scale-[1.04] ${className}`}
      style={{ ["--tilt" as never]: `${tilt}deg`, rotate: `${tilt}deg` }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ filter: `hue-rotate(${hue}deg) saturate(1.05)` }}
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-[rgba(10,15,12,0.9)] to-transparent px-3 pt-8 pb-2">
        <span className="mono text-[9.5px] tracking-[0.16em] text-[var(--ink)] uppercase">9:16 · 21s</span>
        <span className="text-[var(--acc)]">
          <I n="play" size={12} fill />
        </span>
      </div>
    </div>
  );
}

function LanePanel({ niche, flip }: { niche: Niche & { active: boolean }; flip?: boolean }) {
  const { setView, setQueuedNiche } = useApp();
  const go = () => {
    setQueuedNiche(niche.id);
    setView("studio");
  };
  const accent = niche.accent;
  return (
    <Reveal>
      <div className="panel card-lift group grid overflow-hidden lg:grid-cols-12">
        <div className={`relative p-8 sm:p-10 lg:col-span-7 ${flip ? "lg:order-2" : ""}`}>
          <div className="flex flex-wrap items-center gap-3">
            <span className="mono text-[11px] tracking-[0.2em] uppercase" style={{ color: accent }}>
              {niche.lane}
            </span>
            <Pill tone={niche.id === "dropship" ? "acc" : niche.id === "pets" ? "mint" : "amber"}>{niche.platform}</Pill>
            {niche.active === false && <Pill tone="dim">draft · hidden in studio</Pill>}
          </div>
          <h3 className="font-display mt-4 text-3xl font-bold sm:text-4xl">{niche.name}</h3>
          <p className="mt-3 max-w-lg text-[16.5px] text-[var(--muted)]">{niche.pitch}</p>
          <p className="mono mt-4 text-[11px] tracking-[0.14em] text-[var(--dim)] uppercase">{niche.who}</p>

          <div className="mt-6 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] p-4">
            <p className="lbl mb-3">Preprogrammed hook matrix · samples</p>
            <ul className="space-y-2">
              {niche.hooks.slice(0, 3).map((h) => (
                <li key={h} className="mono flex gap-2.5 text-[12.5px] text-[var(--muted)]">
                  <span style={{ color: accent }}>▸</span> “{h}”
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="chip">
              <I n="film" size={12} /> {niche.aspect} masters
            </span>
            <span className="chip">
              <I n="mic" size={12} /> {niche.voice}
            </span>
            <span className="chip">
              <I n="type" size={12} /> {niche.captions}
            </span>
            <span className="chip">
              <I n="music" size={12} /> {niche.music}
            </span>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-4">
            <button className="btn btn-acc px-5 py-2.5 text-[14px]" onClick={go}>
              Start this lane <I n="arrowR" size={15} />
            </button>
            <span className="mono text-[11.5px] tracking-[0.12em] uppercase" style={{ color: accent }}>
              {niche.stat}
            </span>
          </div>
        </div>
        <div className={`relative min-h-[300px] border-t border-[var(--line)] bg-[var(--bg-soft)] lg:col-span-5 lg:min-h-0 lg:border-t-0 ${flip ? "lg:order-1 lg:border-r" : "lg:border-l"}`}>
          <Postcard src={THUMBS[niche.thumbs[0]]} alt={`${niche.name} sample frame A`} tilt={-5} hue={0} className="top-[9%] left-[10%] h-[62%] w-[46%]" />
          <Postcard src={THUMBS[niche.thumbs[1]]} alt={`${niche.name} sample frame B`} tilt={4} hue={28} className="top-[24%] right-[8%] h-[62%] w-[46%]" />
          <span className="mono absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-[var(--line-strong)] bg-[var(--panel)] px-3 py-1 text-[9.5px] tracking-[0.18em] text-[var(--dim)] uppercase">
            live from the render pool
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function Lanes() {
  const { niches } = useApp();
  const [a, b, c] = niches;
  return (
    <section id="lanes" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="01 · Pick a lane, not a tool"
        title={
          <>
            Built for <span className="text-[var(--acc)]">exactly one job</span> — yours.
          </>
        }
        sub="General video editors make you decide everything. Reelmatic decides nothing at runtime, because every decision is preprogrammed per lane. You land on your niche and know: this is exactly what I need."
      />
      <div className="space-y-8">
        <LanePanel niche={a} />
        <LanePanel niche={b} flip />
        <LanePanel niche={c} />
      </div>
    </section>
  );
}

/* ----------------------------- autopilot ---------------------------- */

const STEPS = [
  {
    n: "01",
    icon: "link",
    title: "Paste one link",
    body: "AliExpress, Amazon, Chewy, your Shopify product — anything with a URL. No briefs, no storyboards, no asset uploads. One field. That's the whole onboarding.",
    details: ["URL → title, price, reviews", "Falls back to one line of text", "30 seconds, done forever"],
  },
  {
    n: "02",
    icon: "chip",
    title: "Autopilot takes the wheel",
    body: "Your lane's hook matrix writes 100 script variants, Kokoro voices them, Whisper times karaoke captions, Wan 2.1 renders vertical b-roll, MusicGen scores it. Nothing to approve mid-flight — approving 100 scripts is how people quit.",
    details: ["25 hooks × 4 structures", "Voice + captions pre-set per lane", "~11 min for a full 100-pack"],
  },
  {
    n: "03",
    icon: "zip",
    title: "Download a folder of ads",
    body: "100 ready-to-post masters, each named after its hook so you know exactly what you're testing. Drop them into TikTok, Facebook or your Amazon listing. Flop found a winner? Hit 'New hook' on any video and regenerate free.",
    details: ["Named TT-0421-001 … 100", "Commercial license included", "Regenerate any hook, $0"],
  },
];

function Autopilot() {
  return (
    <section id="autopilot" className="border-y border-[var(--line)] bg-[var(--bg-soft)]/60">
      <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <p className="kicker mb-4">02 · The autopilot</p>
              <h2 className="font-display text-4xl leading-[1.04] font-bold sm:text-5xl">
                It does the part <span className="stroke-acc">you hate.</span>
              </h2>
              <p className="mt-5 max-w-md text-[17px] text-[var(--muted)]">
                Writing hooks, cutting captions, picking music — that's the blank-page tax. Reelmatic pays it for you,
                100 times per pack, with niche-tuned defaults you never have to touch.
              </p>
              <div className="panel-flat mono mt-8 max-w-md rounded-xl p-5 text-[12px] leading-relaxed text-[var(--muted)]">
                <p className="mb-2 text-[10.5px] tracking-[0.18em] text-[var(--dim)] uppercase">average session</p>
                <p>
                  <span className="text-[var(--mint)]">input time</span> — 41 seconds<br />
                  <span className="text-[var(--amber)]">decisions made</span> — 1 (the link)<br />
                  <span className="text-[var(--acc)]">decisions avoided</span> — 1,400+
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6 lg:col-span-7">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 90}>
                <div className="panel card-lift flex gap-6 p-7 sm:p-8">
                  <div className="flex flex-col items-center">
                    <span className="font-display stroke-word text-5xl font-extrabold">{s.n}</span>
                    <span className="mt-3 h-full w-px bg-[var(--line-strong)]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--line-strong)] text-[var(--acc)]">
                        <I n={s.icon} size={17} />
                      </span>
                      <h3 className="font-display text-2xl font-bold">{s.title}</h3>
                    </div>
                    <p className="mt-3 text-[15.5px] text-[var(--muted)]">{s.body}</p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {s.details.map((d) => (
                        <li key={d} className="chip">
                          <I n="check" size={11} /> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- stack ------------------------------ */

function Stack() {
  const { packs } = useApp();
  const creator = packs.find((p) => p.featured) ?? packs[1];
  return (
    <section id="stack" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="03 · Under the hood"
        title={
          <>
            Open models. <span className="text-[var(--mint)]">Vending-machine prices.</span>
          </>
        }
        sub="No black-box API markup. Every stage runs on open-weights models — on cheap cloud GPUs or your own. That's why the app can be free and packs can be this cheap."
        right={<Pill tone="mint">100% open weights</Pill>}
      />
      <div className="grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-8">
          <div className="panel-flat overflow-x-auto rounded-xl">
            <table className="tbl min-w-[560px]">
              <thead>
                <tr>
                  <th>Model</th>
                  <th>Job in the pipeline</th>
                  <th>Runs on</th>
                  <th className="text-right">Cost / 1k videos</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {STACK_ROWS.map((r) => (
                  <tr key={r.model}>
                    <td className="font-semibold text-[var(--ink)]">{r.model}</td>
                    <td>{r.role}</td>
                    <td className="mono text-[12px]">{r.host}</td>
                    <td className="mono text-right text-[var(--amber)]">${r.per1k.toFixed(2)}</td>
                    <td>
                      <Pill tone="mint">open</Pill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
        <Reveal delay={120} className="lg:col-span-4">
          <div className="panel ticket h-full rounded-xl p-7">
            <p className="lbl">your margin, per pack</p>
            <p className="mono mt-4 text-[12.5px] text-[var(--muted)]">cloud compute · 100 videos</p>
            <p className="font-display text-4xl font-extrabold text-[var(--red)]">−$3.80</p>
            <p className="mono mt-4 text-[12.5px] text-[var(--muted)]">{creator.name} sells for</p>
            <p className="font-display text-4xl font-extrabold text-[var(--mint)]">+{fmtMoney(creator.price)}</p>
            <div className="my-5 h-px bg-[var(--line-strong)]" />
            <p className="mono text-[12.5px] text-[var(--muted)]">you keep</p>
            <p className="font-display text-5xl font-extrabold text-[var(--amber)]">{fmtMoney(creator.price - 3.8)}</p>
            <p className="mt-3 text-[13px] text-[var(--dim)]">
              per Creator Crate. Change the price anytime from your owner console — the storefront updates live.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------- packs ------------------------------ */

function Packs() {
  const { packs, setQueuedPack, setView, notify } = useApp();
  const buy = (id: string, name: string) => {
    setQueuedPack(id);
    notify(`${name} queued — finish checkout in the Studio`, "acc");
    setView("studio");
  };
  const featured = packs.find((p) => p.featured);
  const others = packs.filter((p) => !p.featured);
  return (
    <section id="packs" className="border-y border-[var(--line)] bg-[var(--bg-soft)]/60">
      <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
        <SectionHead
          kicker="04 · Packs, not subscriptions"
          title={
            <>
              The app is free. <span className="stroke-word">Videos come in packs.</span>
            </>
          }
          sub="No monthly fee, no seat licenses, no watermark hostage situation. Buy a pack when you need videos; unused credits never expire."
          right={
            <div className="mono text-right text-[11.5px] leading-relaxed tracking-[0.12em] text-[var(--dim)] uppercase">
              every pack includes<br />
              <span className="text-[var(--mint)]">✓ commercial license · ✓ no expiry · ✓ all lanes</span>
            </div>
          }
        />
        <div className="grid items-stretch gap-6 lg:grid-cols-12">
          <Reveal className="order-2 lg:order-1 lg:col-span-3">
            <PackTicket pack={others[0]} onBuy={buy} />
          </Reveal>
          {featured && (
            <Reveal delay={100} className="order-1 lg:order-2 lg:col-span-6">
              <PackTicket pack={featured} onBuy={buy} big />
            </Reveal>
          )}
          <Reveal delay={180} className="order-3 lg:col-span-3">
            <PackTicket pack={others[1]} onBuy={buy} />
          </Reveal>
        </div>
        <Reveal delay={120}>
          <p className="mono mx-auto mt-10 max-w-2xl text-center text-[12px] leading-relaxed tracking-[0.08em] text-[var(--dim)]">
            Need 5,000+ videos/mo for an agency? The owner console supports custom pallet pricing, white-label renders
            and webhook delivery. <span className="text-[var(--muted)]">That's the robust part — it's ours.</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function PackTicket({
  pack,
  onBuy,
  big,
}: {
  pack: { id: string; name: string; videos: number; price: number; tag?: string; featured?: boolean; note: string };
  onBuy: (id: string, name: string) => void;
  big?: boolean;
}) {
  const per = (pack.price / pack.videos).toFixed(2);
  return (
    <div
      className={`ticket card-lift relative flex h-full flex-col rounded-xl p-7 ${
        pack.featured
          ? "border-[var(--acc)] bg-[linear-gradient(180deg,rgba(255,107,53,0.1),var(--panel))]"
          : "bg-[var(--panel)]"
      }`}
    >
      {pack.tag && (
        <span className="mono absolute -top-3 left-6 rounded-full bg-[var(--acc)] px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-[#17100b] uppercase">
          {pack.tag}
        </span>
      )}
      <p className="mono text-[11px] tracking-[0.2em] text-[var(--muted)] uppercase">{pack.name}</p>
      <p className={`font-display mt-4 font-extrabold ${big ? "text-7xl" : "text-5xl"}`}>
        {pack.videos}
        <span className="ml-2 text-lg font-semibold text-[var(--muted)]">videos</span>
      </p>
      <p className={`font-display mt-3 font-bold text-[var(--amber)] ${big ? "text-4xl" : "text-3xl"}`}>
        ${pack.price}
        <span className="mono ml-2 text-[12px] font-normal text-[var(--dim)]">${per}/video</span>
      </p>
      <p className="mt-3 text-[14px] text-[var(--muted)]">{pack.note}</p>
      <ul className="mono mt-5 space-y-2 text-[12px] text-[var(--muted)]">
        <li className="flex gap-2">
          <span className="text-[var(--mint)]">✓</span> hooks + scripts + voice + captions
        </li>
        <li className="flex gap-2">
          <span className="text-[var(--mint)]">✓</span> cleared generated music
        </li>
        <li className="flex gap-2">
          <span className="text-[var(--mint)]">✓</span> unlimited hook regenerations
        </li>
        {big && (
          <>
            <li className="flex gap-2">
              <span className="text-[var(--mint)]">✓</span> priority GPU lane (~11 min / 100)
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--mint)]">✓</span> ZIP + Google Drive delivery
            </li>
          </>
        )}
      </ul>
      <div className="mt-auto pt-7">
        <button className={`btn w-full ${pack.featured ? "btn-acc" : "btn-ghost"} py-3 text-[14.5px]`} onClick={() => onBuy(pack.id, pack.name)}>
          Load pack <I n="arrowR" size={15} />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- proof ------------------------------ */

function Proof() {
  return (
    <section id="proof" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <SectionHead
        kicker="05 · From the testing trenches"
        title={
          <>
            People who <span className="text-[var(--acc)]">stopped editing.</span>
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-12">
        {TESTIMONIALS.map((t, i) => (
          <Reveal key={t.name} delay={i * 110} className={i === 0 ? "lg:col-span-5" : i === 1 ? "lg:col-span-4" : "lg:col-span-3"}>
            <figure className={`panel card-lift flex h-full flex-col p-7 ${i === 0 ? "border-l-2 border-l-[var(--acc)]" : ""}`}>
              <svg viewBox="0 0 24 24" width="30" height="30" className="mb-4 text-[var(--acc)]" fill="currentColor" aria-hidden="true">
                <path d="M4 13c0-4.4 2.8-7.6 7-8.8l.9 1.9c-2.6 1-4.1 2.8-4.4 4.9.4-.2.9-.3 1.4-.3 2 0 3.4 1.4 3.4 3.5S10.8 17.7 8.6 17.7C5.9 17.7 4 15.9 4 13Zm10.5 0c0-4.4 2.8-7.6 7-8.8l.9 1.9c-2.6 1-4.1 2.8-4.4 4.9.4-.2.9-.3 1.4-.3 2 0 3.4 1.4 3.4 3.5s-1.5 3.5-3.7 3.5c-2.7 0-4.6-1.8-4.6-4.7Z" transform="scale(0.95)" />
              </svg>
              <blockquote className={`font-display leading-snug font-semibold ${i === 0 ? "text-2xl" : "text-lg"}`}>“{t.quote}”</blockquote>
              <figcaption className="mt-auto pt-6">
                <p className="mono text-[12.5px] font-semibold text-[var(--ink)]">{t.name}</p>
                <p className="mono text-[11px] tracking-[0.1em] text-[var(--dim)] uppercase">{t.role}</p>
                <span className="mt-3 inline-block">
                  <Pill tone={i === 1 ? "mint" : "amber"}>{t.metric}</Pill>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------- faq ------------------------------- */

function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="border-t border-[var(--line)] bg-[var(--bg-soft)]/60">
      <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="kicker mb-4">06 · Straight answers</p>
            <h2 className="font-display text-4xl leading-[1.05] font-bold">
              Asked <span className="text-[var(--acc)]">every week.</span>
            </h2>
            <div className="panel-flat mono mt-8 rounded-xl p-5 text-[12px] leading-relaxed text-[var(--muted)]">
              <p className="mb-1 text-[10.5px] tracking-[0.18em] text-[var(--dim)] uppercase">still stuck?</p>
              <p>
                <span className="text-[var(--mint)]">support@reelmatic.app</span>
                <br />
                median reply — 3h 12m
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 60}>
                  <div className={`border-b border-[var(--line)] ${i === 0 ? "border-t" : ""}`}>
                    <button
                      className="flex w-full items-center justify-between gap-6 py-5 text-left"
                      onClick={() => setOpen(isOpen ? -1 : i)}
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display text-lg font-semibold transition-colors sm:text-xl ${isOpen ? "text-[var(--acc)]" : "text-[var(--ink)]"}`}>
                        {f.q}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen ? "rotate-180 border-[var(--acc)] text-[var(--acc)]" : "border-[var(--line-strong)] text-[var(--muted)]"
                        }`}
                      >
                        <I n={isOpen ? "minus" : "plus"} size={15} />
                      </span>
                    </button>
                    <div className={`faq-body ${isOpen ? "open" : ""}`}>
                      <div>
                        <p className="max-w-2xl pb-6 text-[15.5px] text-[var(--muted)]">{f.a}</p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ footer ------------------------------ */

function Footer() {
  const { setView, setQueuedNiche } = useApp();
  const lane = (id: NicheId) => {
    setQueuedNiche(id);
    setView("studio");
  };
  return (
    <footer className="overflow-hidden border-t border-[var(--line)]">
      <div className="mx-auto max-w-7xl px-5 pt-16">
        <div className="grid gap-10 pb-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Logo />
              <span className="font-display text-lg font-bold">REELMATIC</span>
            </div>
            <p className="mt-4 max-w-sm text-[14.5px] text-[var(--muted)]">
              The niche video machine. Free app, paid video packs, open models underneath — built for sellers who'd
              rather test creatives than make them.
            </p>
            <div className="mono mt-5 flex gap-2">
              <span className="chip">est. 2025</span>
              <span className="chip">3 lanes</span>
              <span className="chip">0 subscriptions</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <p className="lbl mb-4">Product</p>
            <ul className="space-y-2.5 text-[14.5px] text-[var(--muted)]">
              <li><button className="transition-colors hover:text-[var(--acc)]" onClick={() => setView("studio")}>Open Studio</button></li>
              <li><a className="transition-colors hover:text-[var(--acc)]" href="#packs">Video packs</a></li>
              <li><a className="transition-colors hover:text-[var(--acc)]" href="#stack">Model stack</a></li>
              <li><a className="transition-colors hover:text-[var(--acc)]" href="#faq">FAQ</a></li>
            </ul>
          </div>
          <div className="md:col-span-3">
            <p className="lbl mb-4">Lanes</p>
            <ul className="space-y-2.5 text-[14.5px] text-[var(--muted)]">
              <li><button className="transition-colors hover:text-[var(--acc)]" onClick={() => lane("dropship")}>TikTok Dropshipping</button></li>
              <li><button className="transition-colors hover:text-[var(--acc)]" onClick={() => lane("pets")}>Facebook Pet Supplies</button></li>
              <li><button className="transition-colors hover:text-[var(--acc)]" onClick={() => lane("amazon")}>Amazon Listing Reels</button></li>
            </ul>
          </div>
          <div className="md:col-span-2">
            <p className="lbl mb-4">Owner</p>
            <ul className="space-y-2.5 text-[14.5px] text-[var(--muted)]">
              <li>
                <button className="mono flex items-center gap-2 text-[12px] tracking-[0.14em] uppercase transition-colors hover:text-[var(--amber)]" onClick={() => setView("admin")}>
                  <I n="key" size={13} /> Owner console
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="font-display stroke-word text-center text-[17vw] leading-[0.8] font-extrabold tracking-tight select-none" aria-hidden="true">
        REELMATIC
      </p>
      <div className="border-t border-[var(--line)]">
        <div className="mono mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-[10.5px] tracking-[0.12em] text-[var(--dim)] uppercase">
          <span>© 2026 Reelmatic Labs</span>
          <span>rendered on open-weights models · app free forever · packs fund the GPUs</span>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------ landing ----------------------------- */

export default function Landing() {
  const ticker = useMemo(
    () => [
      "Dropship TikToks",
      "Pet supply Facebook ads",
      "Amazon listing reels",
      "100 videos / one link",
      "Hooks written for you",
      "Captions burned in",
      "Music cleared",
      "The app is free",
    ],
    []
  );
  return (
    <div>
      <Nav />
      <Hero />
      <div className="border-y border-[var(--line)]">
        <Marquee items={ticker} />
      </div>
      <Lanes />
      <Autopilot />
      <Stack />
      <Packs />
      <Proof />
      <Faq />
      <Footer />
    </div>
  );
}
