import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { DEFAULT_PACKS, NICHES } from "./data";
import type { Niche, NicheId, Pack } from "./data";

export type View = "home" | "studio" | "admin";

export interface Toast {
  id: number;
  msg: string;
  kind: "ok" | "acc" | "warn";
}

export type ActiveNiche = Niche & { active: boolean };

interface NicheState {
  id: NicheId;
  active: boolean;
}

interface Settings {
  maintenance: boolean;
  provider: string;
  autoRender: boolean;
  marginTarget: number;
}

interface AppCtx {
  view: View;
  setView: (v: View) => void;
  credits: number;
  addCredits: (n: number) => void;
  spendCredits: (n: number) => void;
  packs: Pack[];
  updatePackPrice: (id: string, price: number) => void;
  niches: ActiveNiche[];
  nicheState: NicheState[];
  toggleNiche: (id: NicheId) => void;
  settings: Settings;
  setSettings: (s: Partial<Settings>) => void;
  toasts: Toast[];
  notify: (msg: string, kind?: Toast["kind"]) => void;
  queuedPack: string | null;
  setQueuedPack: (id: string | null) => void;
  queuedNiche: NicheId | null;
  setQueuedNiche: (id: NicheId | null) => void;
  lifetimeVideos: number;
  addLifetimeVideos: (n: number) => void;
}

const Ctx = createContext<AppCtx | null>(null);

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode */
  }
}

const DEFAULT_SETTINGS: Settings = {
  maintenance: false,
  provider: "Replicate",
  autoRender: true,
  marginTarget: 90,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [view, setViewState] = useState<View>("home");
  const [credits, setCredits] = useState<number>(() => load("rm_credits", 12));
  const [packs, setPacks] = useState<Pack[]>(() => load("rm_packs", DEFAULT_PACKS));
  const [nicheState, setNicheState] = useState<NicheState[]>(() =>
    load("rm_niches", NICHES.map((n) => ({ id: n.id, active: true })))
  );
  const [settings, setSettingsState] = useState<Settings>(() => load("rm_settings", DEFAULT_SETTINGS));
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [queuedPack, setQueuedPack] = useState<string | null>(null);
  const [queuedNiche, setQueuedNiche] = useState<NicheId | null>(null);
  const [lifetimeVideos, setLifetimeVideos] = useState<number>(() => load("rm_lifetime", 2148902));
  const toastId = useRef(0);

  useEffect(() => save("rm_credits", credits), [credits]);
  useEffect(() => save("rm_packs", packs), [packs]);
  useEffect(() => save("rm_niches", nicheState), [nicheState]);
  useEffect(() => save("rm_settings", settings), [settings]);
  useEffect(() => save("rm_lifetime", lifetimeVideos), [lifetimeVideos]);

  const setView = useCallback((v: View) => {
    setViewState(v);
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  const notify = useCallback((msg: string, kind: Toast["kind"] = "ok") => {
    const id = ++toastId.current;
    setToasts((t) => [...t.slice(-3), { id, msg, kind }]);
    window.setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const niches = useMemo(
    () =>
      NICHES.map((n) => ({
        ...n,
        active: nicheState.find((s) => s.id === n.id)?.active ?? true,
      })) as (Niche & { active: boolean })[],
    [nicheState]
  );

  const value: AppCtx = {
    view,
    setView,
    credits,
    addCredits: (n) => setCredits((c) => c + n),
    spendCredits: (n) => setCredits((c) => Math.max(0, c - n)),
    packs,
    updatePackPrice: (id, price) =>
      setPacks((p) => p.map((x) => (x.id === id ? { ...x, price: Math.max(1, price) } : x))),
    niches,
    nicheState,
    toggleNiche: (id) =>
      setNicheState((s) => s.map((x) => (x.id === id ? { ...x, active: !x.active } : x))),
    settings,
    setSettings: (s) => setSettingsState((prev) => ({ ...prev, ...s })),
    toasts,
    notify,
    queuedPack,
    setQueuedPack,
    queuedNiche,
    setQueuedNiche,
    lifetimeVideos,
    addLifetimeVideos: (n) => setLifetimeVideos((v) => v + n),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): AppCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
