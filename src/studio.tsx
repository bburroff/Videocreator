import { useEffect, useMemo, useRef, useState } from "react";
import { NICHES, THUMBS, makeHooks, makeVideos, productNameFrom } from "./data";
import type { Pack, VideoItem } from "./data";
import { I, Logo, Pill, Reveal } from "./ui";
import { useApp } from "./store";
import type { ActiveNiche } from "./store";

const VOICES = ["Maya — energetic", "Jon — warm", "Ava — confident", "Kai — chill"];
const CAPTIONS = ["Karaoke Bold", "Clean Sub", "Spec Callouts", "Hype Caps"];
const MUSIC = ["Phonk / lo-fi beds", "Acoustic warm beds", "Neutral tech beds", "Upbeat pop beds"];
const BATCHES = [10, 25, 50, 100];

type Phase = "setup" | "pipeline" | "results";

/* ------------------------------ header ------------------------------ */

function StudioHeader({ credits }: { credits: number }) {
  const { setView } = useApp();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(12,19,16,0.9)] backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
        <button className="flex items-center gap-2.5" onClick={() => setView("home")}>
          <Logo size={26} />
          <span className="font-display text-base font-bold">REELMATIC</span>
          <span className="mono ml-1 rounded-md border border-[var(--line-strong)] px-2 py-0.5 text-[10px] tracking-[0.16em] text-[var(--muted)] uppercase">
            studio
          </span>
        </button>
        <div className="flex items-center gap-3">
          <span className="mono flex items-center gap-2 rounded-full border border-[var(--line-strong)] px-3.5 py-1.5 text-[11px] tracking-[0.12em] text-[var(--amber)] uppercase">
            <I n="wallet" size={14} /> {credits} credits
          </span>
          <button className="mono hidden text-[11px] tracking-[0.12em] text-[var(--dim)] uppercase transition-colors hover:text-[var(--muted)] sm:block" onClick={() => setView("admin")}>
            owner console
          </button>
        </div>
      </div>
    </header>
  );
}

/* --------------------------- checkout modal ------------------------- */

function CheckoutModal({
  pack,
  onClose,
  onPaid,
}: {
  pack: Pack;
  onClose: () => void;
  onPaid: (p: Pack) => void;
}) {
  const [busy, setBusy] = useState(false);
  const pay = () => {
    setBusy(true);
    window.setTimeout(() => onPaid(pack), 1300);
  };
  return (
    <div className="fixed inset-0 z-[65] flex items-center justify-center bg-[rgba(8,12,10,0.78)] p-5 backdrop-blur-sm" onClick={busy ? undefined : onClose}>
      <div className="panel toast-in w-full max-w-md rounded-2xl p-7" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="flex items-start justify-between">
          <div>
            <p className="lbl">demo checkout</p>
            <h3 className="font-display mt-1 text-2xl font-bold">{pack.name}</h3>
          </div>
          <button className="text-[var(--muted)] transition-colors hover:text-[var(--acc)]" onClick={onClose} aria-label="Close checkout">
            <I n="x" size={20} />
          </button>
        </div>
        <div className="mono mt-5 space-y-2.5 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] p-4 text-[12.5px]">
          <p className="flex justify-between">
            <span className="text-[var(--dim)]">videos</span>
            <span className="text-[var(--ink)]">{pack.videos}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-[var(--dim)]">price / video</span>
            <span className="text-[var(--ink)]">${(pack.price / pack.videos).toFixed(2)}</span>
          </p>
          <p className="flex justify-between">
            <span className="text-[var(--dim)]">expiry</span>
            <span className="text-[var(--mint)]">never</span>
          </p>
          <p className="flex justify-between border-t border-[var(--line)] pt-2.5 text-[14px] font-bold">
            <span className="text-[var(--muted)]">total</span>
            <span className="text-[var(--amber)]">${pack.price}</span>
          </p>
        </div>
        <div className="mono mt-4 flex items-center gap-3 rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3 text-[12px] text-[var(--muted)]">
          <I n="key" size={15} />
          <span>•••• •••• •••• 4242 — demo card, no real charge</span>
        </div>
        <button className="btn btn-acc mt-5 w-full py-3.5 text-[15px]" onClick={pay} disabled={busy}>
          {busy ? (
            <>
              <span className="spinner" /> Processing…
            </>
          ) : (
            <>
              Pay ${pack.price} <I n="bolt" size={15} />
            </>
          )}
        </button>
        <p className="mono mt-3 text-center text-[10.5px] tracking-[0.12em] text-[var(--dim)] uppercase">
          credits land instantly · refunds anytime from the owner console
        </p>
      </div>
    </div>
  );
}

/* ---------------------------- video card ---------------------------- */

function VideoCard({
  v,
  aspect,
  onReroll,
  onSwapVoice,
  onDownload,
}: {
  v: VideoItem;
  aspect: string;
  onReroll: (id: string) => void;
  onSwapVoice: (id: string) => void;
  onDownload: (id: string) => void;
}) {
  const aspectClass = aspect === "16:9" ? "aspect-video" : aspect === "4:5" ? "aspect-[4/5]" : "aspect-[9/16]";
  return (
    <div className="vcard panel-flat group overflow-hidden rounded-xl">
      <div className={`relative overflow-hidden ${aspectClass}`}>
        <img
          src={v.thumb}
          alt={`Rendered ad ${v.id}`}
          loading="lazy"
          className="vimg absolute inset-0 h-full w-full object-cover"
          style={{ filter: `hue-rotate(${v.hue}deg) saturate(1.08) contrast(1.02)` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,12,10,0.92)] via-transparent to-[rgba(8,12,10,0.35)]" />
        <div className="scanline" />
        <span className="mono absolute top-2 left-2 rounded bg-[rgba(8,12,10,0.75)] px-1.5 py-0.5 text-[9px] tracking-[0.14em] text-[var(--muted)]">
          {v.id}
        </span>
        <span className="mono absolute top-2 right-2 flex items-center gap-1 rounded bg-[var(--mint)] px-1.5 py-0.5 text-[9px] font-bold tracking-[0.1em] text-[#0c1712] uppercase">
          <I n="check" size={9} /> {v.dur}s
        </span>
        <div className="absolute inset-x-2.5 bottom-2.5">
          <p className="font-display line-clamp-3 text-[13px] leading-tight font-bold text-[var(--ink)] [text-shadow:0_1px_8px_rgba(0,0,0,0.8)]">
            {v.hook}
          </p>
          <div className="vbar mt-2 h-[3px] rounded-full bg-[var(--acc)]" />
        </div>
      </div>
      <div className="flex items-center justify-between gap-1 px-2.5 py-2">
        <span className="mono truncate text-[9.5px] tracking-[0.06em] text-[var(--dim)]">{v.voice.split(" — ")[0]} · {v.captions}</span>
        <div className="flex shrink-0 gap-1">
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--acc)] hover:text-[var(--acc)]"
            onClick={() => onReroll(v.id)}
            title="New hook (free)"
            aria-label={`New hook for ${v.id}`}
          >
            <I n="refresh" size={13} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--mint)] hover:text-[var(--mint)]"
            onClick={() => onSwapVoice(v.id)}
            title="Swap voice (free)"
            aria-label={`Swap voice for ${v.id}`}
          >
            <I n="mic" size={13} />
          </button>
          <button
            className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--line)] text-[var(--muted)] transition-all hover:border-[var(--amber)] hover:text-[var(--amber)]"
            onClick={() => onDownload(v.id)}
            title="Download MP4"
            aria-label={`Download ${v.id}`}
          >
            <I n="download" size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- studio ------------------------------ */

export default function Studio() {
  const app = useApp();
  const {
    credits,
    spendCredits,
    addCredits,
    packs,
    niches,
    notify,
    queuedPack,
    setQueuedPack,
    queuedNiche,
    setQueuedNiche,
    settings,
    addLifetimeVideos,
  } = app;

  const activeNiches = useMemo(() => niches.filter((n) => n.active), [niches]);

  const [phase, setPhase] = useState<Phase>("setup");
  const [step, setStep] = useState(1);
  const [nicheId, setNicheId] = useState<string>(() => queuedNiche ?? activeNiches[0]?.id ?? "dropship");
  const [mode, setMode] = useState<"link" | "text">("link");
  const [product, setProduct] = useState("");
  const [voice, setVoice] = useState(VOICES[0]);
  const [captions, setCaptions] = useState(CAPTIONS[0]);
  const [music, setMusic] = useState(MUSIC[0]);
  const [batch, setBatch] = useState(100);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [visible, setVisible] = useState(18);
  const [checkout, setCheckout] = useState<Pack | null>(null);
  const [runId, setRunId] = useState(0);

  const niche: ActiveNiche =
    activeNiches.find((n) => n.id === nicheId) ?? activeNiches[0] ?? (niches[0] as ActiveNiche);

  /* preselect lane defaults when niche changes */
  useEffect(() => {
    setVoice(niche.voice);
    setCaptions(niche.captions);
    setMusic(niche.music);
  }, [niche]);

  /* queued pack from landing → open checkout */
  useEffect(() => {
    if (queuedPack) {
      const p = packs.find((x) => x.id === queuedPack) ?? null;
      if (p) setCheckout(p);
      setQueuedPack(null);
    }
  }, [queuedPack, packs, setQueuedPack]);

  useEffect(() => {
    if (queuedNiche) setQueuedNiche(null);
  }, [queuedNiche, setQueuedNiche]);

  const productName = productNameFrom(product, niche.sample);

  /* ---------------------------- pipeline ---------------------------- */
  const [stageIdx, setStageIdx] = useState(0);
  const [rendered, setRendered] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [eta, setEta] = useState(0);
  const logRef = useRef<HTMLDivElement>(null);
  const cancelled = useRef(false);

  const STAGES = useMemo(
    () => [
      { name: "Reading product page", sub: `fetch → ${productName}` },
      { name: "Extracting selling angles", sub: "price · reviews · pain points" },
      { name: "Writing hook matrix", sub: "llama-3.1-70b · 25 hooks × 4 structures" },
      { name: "Scripting variants", sub: `${batch} scripts · ${niche.aspect} runtime targets` },
      { name: "Synthesizing voiceover", sub: `kokoro · ${voice.toLowerCase()}` },
      { name: "Cutting b-roll", sub: "wan-2.1 · scene pool per hook" },
      { name: "Burning captions", sub: `whisper-v3 · ${captions.toLowerCase()}` },
      { name: "Scoring music", sub: `musicgen · ${music.toLowerCase()}` },
      { name: "Rendering masters", sub: `${batch} × ${niche.aspect} · h264 1080p` },
    ],
    [batch, productName, niche.aspect, voice, captions, music]
  );

  useEffect(() => {
    if (phase !== "pipeline") return;
    cancelled.current = false;
    setStageIdx(0);
    setRendered(0);
    setLogs([]);
    const total = 38 + Math.round(batch * 0.55);
    setEta(total);
    const timers: number[] = [];
    const push = (s: string) => setLogs((l) => [...l.slice(-80), s]);
    const t0 = Date.now();
    const stamp = () => `+${((Date.now() - t0) / 1000).toFixed(1)}s`;

    push(`$ reelmatic run --lane ${niche.id} --batch ${batch}`);
    push(`job ${niche.prefix.toLowerCase()}-${String(runId).padStart(4, "0")} queued on gpu-pool/07`);

    STAGES.forEach((s, i) => {
      const start = 500 + i * 950;
      timers.push(
        window.setTimeout(() => {
          if (cancelled.current) return;
          setStageIdx(i);
          push(`▸ ${s.name.toLowerCase()} … started`);
        }, start)
      );
      if (i < STAGES.length - 1) {
        timers.push(
          window.setTimeout(() => {
            if (cancelled.current) return;
            push(`  ${s.name.toLowerCase()} … ok [${stamp()}]`);
          }, start + 780)
        );
      }
    });

    const renderStart = 500 + (STAGES.length - 1) * 950;
    const per = Math.max(60, Math.min(240, 6200 / batch));
    for (let k = 1; k <= batch; k++) {
      timers.push(
        window.setTimeout(() => {
          if (cancelled.current) return;
          setRendered(k);
          if (k % Math.max(1, Math.round(batch / 8)) === 0 || k === batch) {
            push(`  render ${String(k).padStart(3, "0")}/${batch} … ${niche.prefix}-batch-${String(k).padStart(3, "0")} written`);
          }
        }, renderStart + k * per)
      );
    }
    timers.push(
      window.setTimeout(() => {
        if (cancelled.current) return;
        push(`✓ batch complete — ${batch} masters in /out/${niche.id}/ (${stamp()})`);
        const vids = makeVideos(niche, productName, batch, voice, captions, music, String(runId).padStart(4, "0"));
        setVideos(vids);
        setVisible(18);
        addLifetimeVideos(batch);
        setPhase("results");
        notify(`${batch} videos ready — folder /out/${niche.id}/`, "ok");
      }, renderStart + batch * per + 700)
    );

    const etaTimer = window.setInterval(() => {
      setEta((e) => Math.max(0, e - 1));
    }, 1000);
    timers.push(etaTimer);

    return () => {
      cancelled.current = true;
      timers.forEach((t) => {
        window.clearTimeout(t);
        window.clearInterval(t);
      });
    };
  }, [phase, runId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  /* ----------------------------- actions ---------------------------- */

  const startRun = () => {
    if (credits < batch) {
      notify(`Need ${batch - credits} more credits — grab a pack below`, "warn");
      setCheckout(packs.find((p) => p.videos >= batch) ?? packs[1]);
      return;
    }
    spendCredits(batch);
    setRunId((r) => r + 1);
    setPhase("pipeline");
  };

  const cancelRun = () => {
    cancelled.current = true;
    const refund = batch - rendered;
    if (refund > 0) addCredits(refund);
    setPhase("setup");
    setStep(4);
    notify(refund > 0 ? `Run cancelled — ${refund} unrendered credits refunded` : "Run cancelled", "warn");
  };

  const rerollHook = (id: string) => {
    setVideos((vs) =>
      vs.map((v) => {
        if (v.id !== id) return v;
        const pool = makeHooks(niche.id, productName, 120);
        const next = pool[Math.floor(Math.random() * pool.length)];
        return { ...v, hook: next };
      })
    );
    notify(`New hook generated for ${id} — free, always`, "acc");
  };

  const swapVoice = (id: string) => {
    setVideos((vs) =>
      vs.map((v) => {
        if (v.id !== id) return v;
        const i = VOICES.indexOf(v.voice);
        return { ...v, voice: VOICES[(i + 1) % VOICES.length] };
      })
    );
    notify(`Voice re-synthesized for ${id}`, "acc");
  };

  const onPaid = (p: Pack) => {
    addCredits(p.videos);
    setCheckout(null);
    notify(`${p.videos} credits added — ${p.name} is yours`, "ok");
  };

  const stepOk = [
    true,
    nicheId.length > 0,
    true,
    credits > 0,
  ];

  /* ------------------------------ render ----------------------------- */

  return (
    <div className="min-h-screen">
      <StudioHeader credits={credits} />
      {settings.maintenance && (
        <div className="border-b border-[var(--amber)] bg-[var(--amber-soft)] px-5 py-2.5 text-center">
          <span className="mono text-[11px] tracking-[0.14em] text-[var(--amber)] uppercase">
            ⚠ maintenance mode is on — renders may queue longer than usual (owner console → system)
          </span>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-5 py-10">
        {/* phase: pipeline */}
        {phase === "pipeline" && (
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="kicker mb-4">autopilot engaged</p>
              <h2 className="font-display text-4xl font-extrabold">
                Making <span className="text-[var(--acc)]">{batch}</span> ads about{" "}
                <span className="text-[var(--mint)]">{productName}</span>
              </h2>
              <p className="mono mt-3 text-[11.5px] tracking-[0.12em] text-[var(--dim)] uppercase">
                lane: {niche.name} · you can walk away, we'll keep the folder warm
              </p>

              <div className="panel-flat mt-8 rounded-xl p-5">
                <div className="mb-4 flex items-end justify-between">
                  <span className="mono text-[11px] tracking-[0.16em] text-[var(--dim)] uppercase">masters rendered</span>
                  <span className="font-display text-4xl font-extrabold text-[var(--amber)]">
                    {rendered}
                    <span className="text-lg text-[var(--dim)]">/{batch}</span>
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--panel-3)]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--acc)] via-[var(--amber)] to-[var(--mint)] transition-[width] duration-300"
                    style={{ width: `${(rendered / Math.max(1, batch)) * 100}%` }}
                  />
                </div>
                <div className="mono mt-3 flex justify-between text-[11px] text-[var(--dim)]">
                  <span>eta ~{Math.floor(eta / 60)}:{String(eta % 60).padStart(2, "0")}</span>
                  <span>gpu-pool/07 · wan-2.1</span>
                </div>
              </div>

              <ol className="mt-6 space-y-2.5">
                {STAGES.map((s, i) => {
                  const state = i < stageIdx || rendered >= batch ? "done" : i === stageIdx ? "run" : "wait";
                  return (
                    <li
                      key={s.name}
                      className={`flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-all duration-300 ${
                        state === "run"
                          ? "border-[var(--acc)] bg-[var(--acc-soft)]"
                          : state === "done"
                            ? "border-[var(--line)] opacity-70"
                            : "border-[var(--line)] opacity-40"
                      }`}
                    >
                      <span className="w-5">
                        {state === "done" ? (
                          <span className="text-[var(--mint)]">
                            <I n="check" size={15} />
                          </span>
                        ) : state === "run" ? (
                          <span className="spinner" />
                        ) : (
                          <span className="mono text-[11px] text-[var(--dim)]">{String(i + 1).padStart(2, "0")}</span>
                        )}
                      </span>
                      <span className="flex-1">
                        <span className={`block text-[14px] font-semibold ${state === "run" ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>
                          {s.name}
                        </span>
                        <span className="mono block text-[10.5px] tracking-[0.08em] text-[var(--dim)]">{s.sub}</span>
                      </span>
                    </li>
                  );
                })}
              </ol>
              <button className="btn btn-ghost mt-6 px-5 py-2.5 text-[13.5px]" onClick={cancelRun}>
                <I n="x" size={14} /> Cancel run (unrendered credits refund)
              </button>
            </div>

            <div className="lg:col-span-7">
              <div className="panel-flat flex h-full min-h-[520px] flex-col overflow-hidden rounded-xl">
                <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
                  <span className="mono text-[10.5px] tracking-[0.18em] text-[var(--dim)] uppercase">pipeline console</span>
                  <span className="flex items-center gap-1.5">
                    <span className="live-dot h-2 w-2 rounded-full bg-[var(--mint)]" />
                    <span className="mono text-[10.5px] tracking-[0.14em] text-[var(--mint)] uppercase">streaming</span>
                  </span>
                </div>
                <div ref={logRef} className="mono thin-scroll flex-1 overflow-y-auto px-4 py-4 text-[12px] leading-[1.9] text-[var(--muted)]" style={{ maxHeight: 560 }}>
                  {logs.map((l, i) => (
                    <p key={i} className={`whitespace-pre-wrap ${l.startsWith("✓") ? "text-[var(--mint)]" : l.startsWith("$") ? "text-[var(--ink)]" : l.includes("… ok") ? "text-[var(--muted)]" : "text-[var(--muted)]"}`}>
                      {l.startsWith("▸") ? <span className="text-[var(--acc)]">{l.slice(0, l.indexOf("…") > 0 ? l.indexOf("…") : l.length)}</span> : null}
                      {l.startsWith("▸") ? l.slice(l.indexOf("…") > 0 ? l.indexOf("…") : l.length) : l}
                    </p>
                  ))}
                  <span className="cursor-blink text-[var(--acc)]">█</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* phase: results */}
        {phase === "results" && (
          <div>
            <Reveal>
              <div className="flex flex-wrap items-end justify-between gap-6">
                <div>
                  <p className="kicker mb-3">batch complete</p>
                  <h2 className="font-display text-4xl font-extrabold sm:text-5xl">
                    {videos.length} ads, <span className="text-[var(--mint)]">ready to post.</span>
                  </h2>
                  <p className="mono mt-3 text-[11.5px] tracking-[0.12em] text-[var(--dim)] uppercase">
                    /out/{niche.id}/ · named by hook · commercial license included
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="btn btn-ghost px-4 py-2.5 text-[13.5px]" onClick={() => { setPhase("setup"); setStep(1); }}>
                    <I n="plus" size={14} /> New batch
                  </button>
                  <button className="btn btn-ghost px-4 py-2.5 text-[13.5px]" onClick={() => notify("Folder synced to Google Drive (demo)", "acc")}>
                    <I n="external" size={14} /> Send to Drive
                  </button>
                  <button className="btn btn-acc px-5 py-2.5 text-[13.5px]" onClick={() => notify(`ZIP queued — ${videos.length} masters, ~${(videos.length * 2.1).toFixed(0)} MB (demo)`, "ok")}>
                    <I n="zip" size={15} /> Download all (.zip)
                  </button>
                </div>
              </div>
            </Reveal>

            <div className={`mt-8 grid gap-4 ${niche.aspect === "16:9" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
              {videos.slice(0, visible).map((v, i) => (
                <Reveal key={v.id} delay={Math.min(i % 10, 6) * 50}>
                  <VideoCard v={v} aspect={niche.aspect} onReroll={rerollHook} onSwapVoice={swapVoice} onDownload={(id) => notify(`${id}.mp4 downloaded (demo)`, "ok")} />
                </Reveal>
              ))}
            </div>

            {visible < videos.length && (
              <div className="mt-8 text-center">
                <button className="btn btn-ghost px-6 py-3 text-[14px]" onClick={() => setVisible((v) => v + 30)}>
                  Show {Math.min(30, videos.length - visible)} more <I n="download" size={14} className="rotate-180" />
                </button>
              </div>
            )}

            <p className="mono mt-10 text-center text-[11px] tracking-[0.14em] text-[var(--dim)] uppercase">
              hook flopped? hit <span className="text-[var(--acc)]">↻</span> on any video — regeneration is always free
            </p>
          </div>
        )}

        {/* phase: setup */}
        {phase === "setup" && (
          <div className="grid gap-10 lg:grid-cols-12">
            {/* rail */}
            <aside className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <p className="lbl mb-4">the run</p>
                <ol className="space-y-1.5">
                  {[
                    ["Lane & product", 1],
                    ["Style defaults", 2],
                    ["Credits", 3],
                    ["Ignition", 4],
                  ].map(([label, n]) => {
                    const done = step > (n as number);
                    const now = step === n;
                    return (
                      <li key={n as number}>
                        <button
                          onClick={() => (done ? setStep(n as number) : null)}
                          className={`flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                            now ? "border-[var(--acc)] bg-[var(--acc-soft)]" : done ? "border-[var(--line)] hover:border-[var(--line-strong)]" : "border-[var(--line)] opacity-50"
                          }`}
                        >
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                              done ? "bg-[var(--mint)] text-[#0c1712]" : now ? "bg-[var(--acc)] text-[#17100b]" : "bg-[var(--panel-3)] text-[var(--dim)]"
                            }`}
                          >
                            {done ? <I n="check" size={12} /> : n}
                          </span>
                          <span className={`text-[14px] font-semibold ${now ? "text-[var(--ink)]" : "text-[var(--muted)]"}`}>{label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                <div className="panel-flat mt-6 rounded-xl p-5">
                  <p className="lbl mb-3">lane presets · locked in</p>
                  <ul className="mono space-y-2.5 text-[11.5px] text-[var(--muted)]">
                    <li className="flex items-center gap-2.5"><I n="film" size={13} /> {niche.aspect} masters</li>
                    <li className="flex items-center gap-2.5"><I n="mic" size={13} /> {niche.voice}</li>
                    <li className="flex items-center gap-2.5"><I n="type" size={13} /> {niche.captions}</li>
                    <li className="flex items-center gap-2.5"><I n="music" size={13} /> {niche.music}</li>
                  </ul>
                  <p className="mono mt-4 rounded-md bg-[var(--mint-soft)] px-3 py-2 text-[10.5px] tracking-[0.1em] text-[var(--mint)] uppercase">
                    preprogrammed — you don't have to think
                  </p>
                </div>
              </div>
            </aside>

            {/* steps */}
            <div className="lg:col-span-9">
              {activeNiches.length === 0 && (
                <div className="panel rounded-xl p-10 text-center">
                  <p className="font-display text-2xl font-bold">All lanes are in draft mode</p>
                  <p className="mt-2 text-[var(--muted)]">The owner console has hidden every lane from the storefront. Toggle one live to open the Studio.</p>
                </div>
              )}

              {activeNiches.length > 0 && step === 1 && (
                <Reveal key="s1">
                  <p className="kicker mb-3">step 1 · lane & product</p>
                  <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                    What are we <span className="text-[var(--acc)]">selling today?</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-[15.5px] text-[var(--muted)]">
                    Pick the lane that matches where you'll post. Everything else on this page is preloaded for it.
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-3">
                    {activeNiches.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => setNicheId(n.id)}
                        className={`rounded-xl border p-5 text-left transition-all ${
                          nicheId === n.id ? "border-[var(--acc)] bg-[var(--acc-soft)] shadow-[0_10px_30px_-12px_rgba(255,107,53,0.4)]" : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--line-strong)]"
                        }`}
                      >
                        <span className="mono text-[10px] tracking-[0.18em] uppercase" style={{ color: n.accent }}>
                          {n.lane}
                        </span>
                        <span className="font-display mt-1.5 block text-[17px] leading-tight font-bold">{n.name}</span>
                        <span className="mono mt-2 block text-[10.5px] tracking-[0.08em] text-[var(--dim)]">{n.platform}</span>
                      </button>
                    ))}
                  </div>

                  <div className="panel-flat mt-7 rounded-xl p-6">
                    <div className="mb-4 flex items-center gap-2">
                      <button
                        className={`mono rounded-md px-3.5 py-1.5 text-[11px] tracking-[0.12em] uppercase transition-all ${mode === "link" ? "bg-[var(--panel-3)] text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--muted)]"}`}
                        onClick={() => setMode("link")}
                      >
                        <I n="link" size={12} className="mr-1.5 inline" /> paste a link
                      </button>
                      <button
                        className={`mono rounded-md px-3.5 py-1.5 text-[11px] tracking-[0.12em] uppercase transition-all ${mode === "text" ? "bg-[var(--panel-3)] text-[var(--ink)]" : "text-[var(--dim)] hover:text-[var(--muted)]"}`}
                        onClick={() => setMode("text")}
                      >
                        <I n="type" size={12} className="mr-1.5 inline" /> one line of text
                      </button>
                      <span className="mono ml-auto hidden text-[10px] tracking-[0.12em] text-[var(--dim)] uppercase sm:block">optional — autopilot has defaults</span>
                    </div>
                    <input
                      className="input"
                      placeholder={mode === "link" ? "https://aliexpress.com/item/galaxy-star-projector…" : "e.g. galaxy star projector with remote"}
                      value={product}
                      onChange={(e) => setProduct(e.target.value)}
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <span className="mono text-[10.5px] tracking-[0.14em] text-[var(--dim)] uppercase">try:</span>
                      {[niche.sample, "under-$20 kitchen gadget", "pet water fountain"].map((s) => (
                        <button key={s} className="chip transition-colors hover:border-[var(--acc)] hover:text-[var(--acc)]" onClick={() => setProduct(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <p className="mono text-[11.5px] tracking-[0.1em] text-[var(--dim)] uppercase">
                      detected product: <span className="text-[var(--mint)]">{productName}</span>
                    </p>
                    <button className="btn btn-acc px-6 py-3 text-[14.5px]" onClick={() => setStep(2)} disabled={!stepOk[1]}>
                      Continue <I n="arrowR" size={15} />
                    </button>
                  </div>
                </Reveal>
              )}

              {activeNiches.length > 0 && step === 2 && (
                <Reveal key="s2">
                  <p className="kicker mb-3">step 2 · style defaults</p>
                  <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                    Already decided <span className="text-[var(--mint)]">for you.</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-[15.5px] text-[var(--muted)]">
                    These are preprogrammed per lane because testing beats tweaking. Change them only if you must.
                  </p>

                  <div className="mt-7 grid gap-6 md:grid-cols-2">
                    <div className="panel-flat rounded-xl p-6">
                      <p className="lbl mb-4">
                        <I n="mic" size={12} className="mr-2 inline" /> voiceover
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        {VOICES.map((v) => (
                          <button
                            key={v}
                            onClick={() => setVoice(v)}
                            className={`rounded-lg border px-3.5 py-3 text-left text-[13.5px] font-semibold transition-all ${
                              voice === v ? "border-[var(--mint)] bg-[var(--mint-soft)] text-[var(--mint)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]"
                            }`}
                          >
                            <svg viewBox="0 0 60 16" className="mb-1.5 h-3.5 w-full opacity-70" aria-hidden="true">
                              {Array.from({ length: 30 }).map((_, i) => (
                                <rect key={i} x={i * 2} y={8 - (Math.abs(Math.sin(i * 1.7 + v.length)) * 6 + 1)} width="1.2" height={Math.abs(Math.sin(i * 1.7 + v.length)) * 12 + 2} rx="0.6" fill="currentColor" />
                              ))}
                            </svg>
                            {v}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="panel-flat rounded-xl p-6">
                        <p className="lbl mb-4">
                          <I n="type" size={12} className="mr-2 inline" /> captions
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {CAPTIONS.map((c) => (
                            <button
                              key={c}
                              onClick={() => setCaptions(c)}
                              className={`rounded-lg border px-4 py-2.5 text-[13.5px] font-semibold transition-all ${
                                captions === c ? "border-[var(--acc)] bg-[var(--acc-soft)] text-[var(--acc)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]"
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div className="panel-flat rounded-xl p-6">
                        <p className="lbl mb-4">
                          <I n="music" size={12} className="mr-2 inline" /> music bed · generated, cleared
                        </p>
                        <div className="flex flex-wrap gap-2.5">
                          {MUSIC.map((m) => (
                            <button
                              key={m}
                              onClick={() => setMusic(m)}
                              className={`rounded-lg border px-4 py-2.5 text-[13.5px] font-semibold transition-all ${
                                music === m ? "border-[var(--amber)] bg-[var(--amber-soft)] text-[var(--amber)]" : "border-[var(--line)] text-[var(--muted)] hover:border-[var(--line-strong)]"
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-7 flex items-center justify-between">
                    <button className="btn btn-ghost px-5 py-3 text-[14px]" onClick={() => setStep(1)}>
                      <I n="arrowL" size={15} /> Back
                    </button>
                    <button className="btn btn-acc px-6 py-3 text-[14.5px]" onClick={() => setStep(3)}>
                      Continue <I n="arrowR" size={15} />
                    </button>
                  </div>
                </Reveal>
              )}

              {activeNiches.length > 0 && step === 3 && (
                <Reveal key="s3">
                  <p className="kicker mb-3">step 3 · credits</p>
                  <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                    1 video = <span className="text-[var(--amber)]">1 credit.</span>
                  </h2>
                  <p className="mt-3 max-w-xl text-[15.5px] text-[var(--muted)]">
                    Your balance: <strong className="text-[var(--amber)]">{credits} credits</strong>. Packs never expire and work across every lane.
                  </p>
                  <div className="mt-7 grid gap-4 md:grid-cols-3">
                    {packs.map((p) => (
                      <div key={p.id} className={`panel card-lift flex flex-col rounded-xl p-6 ${p.featured ? "border-[var(--acc)]" : ""}`}>
                        <div className="flex items-center justify-between">
                          <p className="mono text-[10.5px] tracking-[0.18em] text-[var(--muted)] uppercase">{p.name}</p>
                          {p.tag && <Pill tone="acc">{p.tag}</Pill>}
                        </div>
                        <p className="font-display mt-3 text-4xl font-extrabold">
                          {p.videos}
                          <span className="ml-1.5 text-sm font-semibold text-[var(--dim)]">videos</span>
                        </p>
                        <p className="font-display mt-1 text-2xl font-bold text-[var(--amber)]">
                          ${p.price}
                          <span className="mono ml-2 text-[11px] font-normal text-[var(--dim)]">${(p.price / p.videos).toFixed(2)}/vid</span>
                        </p>
                        <button className="btn btn-ghost mt-5 w-full py-2.5 text-[13.5px]" onClick={() => setCheckout(p)}>
                          <I n="cart" size={14} /> Buy pack
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex items-center justify-between">
                    <button className="btn btn-ghost px-5 py-3 text-[14px]" onClick={() => setStep(2)}>
                      <I n="arrowL" size={15} /> Back
                    </button>
                    <div className="flex items-center gap-4">
                      {credits === 0 && (
                        <span className="mono text-[11px] tracking-[0.12em] text-[var(--red)] uppercase">grab a pack to continue</span>
                      )}
                      <button className="btn btn-acc px-6 py-3 text-[14.5px]" onClick={() => setStep(4)} disabled={!stepOk[3]}>
                        Continue <I n="arrowR" size={15} />
                      </button>
                    </div>
                  </div>
                </Reveal>
              )}

              {activeNiches.length > 0 && step === 4 && (
                <Reveal key="s4">
                  <p className="kicker mb-3">step 4 · ignition</p>
                  <h2 className="font-display text-3xl font-extrabold sm:text-4xl">
                    How big is <span className="text-[var(--acc)]">the batch?</span>
                  </h2>
                  <div className="mt-7 flex flex-wrap gap-3">
                    {BATCHES.map((b) => {
                      const disabled = credits < b;
                      return (
                        <button
                          key={b}
                          onClick={() => !disabled && setBatch(b)}
                          disabled={disabled}
                          className={`rounded-xl border px-7 py-5 text-left transition-all disabled:cursor-not-allowed disabled:opacity-35 ${
                            batch === b ? "border-[var(--acc)] bg-[var(--acc-soft)]" : "border-[var(--line)] bg-[var(--panel)] hover:border-[var(--line-strong)]"
                          }`}
                        >
                          <span className="font-display block text-3xl font-extrabold">{b}</span>
                          <span className="mono text-[10.5px] tracking-[0.12em] text-[var(--dim)] uppercase">videos · {b} credits</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="panel-flat mono mt-7 max-w-xl rounded-xl p-6 text-[12.5px] leading-[2]">
                    <p className="lbl mb-2">run summary</p>
                    <p className="flex justify-between gap-4"><span className="text-[var(--dim)]">lane</span><span className="text-[var(--ink)]">{niche.name}</span></p>
                    <p className="flex justify-between gap-4"><span className="text-[var(--dim)]">product</span><span className="text-[var(--mint)]">{productName}</span></p>
                    <p className="flex justify-between gap-4"><span className="text-[var(--dim)]">voice / captions</span><span className="text-[var(--ink)]">{voice.split(" — ")[0]} · {captions}</span></p>
                    <p className="flex justify-between gap-4"><span className="text-[var(--dim)]">music</span><span className="text-[var(--ink)]">{music}</span></p>
                    <p className="flex justify-between gap-4 border-t border-[var(--line)] pt-2"><span className="text-[var(--dim)]">cost</span><span className="text-[var(--amber)]">{batch} credits · balance after: {Math.max(0, credits - batch)}</span></p>
                  </div>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <button className="btn btn-acc px-8 py-4 text-[16px]" onClick={startRun} disabled={credits < batch}>
                      <I n="bolt" size={17} /> Run autopilot — render {batch}
                    </button>
                    <button className="btn btn-ghost px-5 py-4 text-[14px]" onClick={() => setStep(3)}>
                      <I n="arrowL" size={15} /> Back
                    </button>
                    {credits < batch && (
                      <span className="mono text-[11px] tracking-[0.12em] text-[var(--red)] uppercase">
                        {batch - credits} credits short — <button className="underline" onClick={() => setCheckout(packs.find((p) => p.videos >= batch) ?? packs[1])}>add a pack</button>
                      </span>
                    )}
                  </div>
                </Reveal>
              )}
            </div>
          </div>
        )}
      </main>

      {checkout && <CheckoutModal pack={checkout} onClose={() => setCheckout(null)} onPaid={onPaid} />}
    </div>
  );
}
