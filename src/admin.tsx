import { useMemo, useState } from "react";
import { ORDERS, RENDERED_WEEKS, REVENUE_WEEKS, STACK_ROWS, USERS, WEEK_LABELS, fmtMoney } from "./data";
import type { Order } from "./data";
import { I, Logo, Pill, Reveal } from "./ui";
import { useApp } from "./store";

type Tab = "overview" | "orders" | "users" | "catalog" | "models" | "system";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "gauge" },
  { id: "orders", label: "Orders", icon: "cart" },
  { id: "users", label: "Users", icon: "users" },
  { id: "catalog", label: "Catalog & pricing", icon: "tag" },
  { id: "models", label: "Models & costs", icon: "chip" },
  { id: "system", label: "System", icon: "gear" },
];

/* ------------------------------- login ------------------------------ */

function Gate({ onPass }: { onPass: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw.trim().toLowerCase() === "autopilot") {
      onPass();
    } else {
      setErr(true);
      window.setTimeout(() => setErr(false), 700);
    }
  };
  return (
    <div className="flex min-h-screen items-center justify-center px-5">
      <div className={`panel w-full max-w-sm rounded-2xl p-8 ${err ? "shake" : ""}`}>
        <div className="flex items-center gap-2.5">
          <Logo />
          <div>
            <p className="font-display text-base leading-tight font-bold">REELMATIC</p>
            <p className="mono text-[10px] tracking-[0.2em] text-[var(--dim)] uppercase">owner console</p>
          </div>
        </div>
        <p className="lbl mt-7 mb-2">access key</p>
        <input
          type="password"
          className="input"
          placeholder="••••••••••"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          autoFocus
        />
        {err && <p className="mono mt-2 text-[11px] tracking-[0.1em] text-[var(--red)] uppercase">wrong key — try the demo one ↓</p>}
        <button className="btn btn-acc mt-5 w-full py-3 text-[14.5px]" onClick={submit}>
          <I n="key" size={15} /> Unlock console
        </button>
        <p className="mono mt-4 text-center text-[11px] tracking-[0.12em] text-[var(--dim)]">
          demo key: <span className="text-[var(--amber)]">autopilot</span>
        </p>
        <p className="mt-6 border-t border-[var(--line)] pt-4 text-center text-[12.5px] text-[var(--muted)]">
          This is your back office: orders, users, lane catalog, pack pricing, model costs and the render fleet.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------ charts ------------------------------ */

function RevenueChart() {
  const max = Math.max(...REVENUE_WEEKS);
  return (
    <div className="panel-flat rounded-xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="lbl">pack revenue · 12 weeks</p>
          <p className="font-display mt-1 text-3xl font-extrabold text-[var(--mint)]">{fmtMoney(REVENUE_WEEKS.reduce((a, b) => a + b, 0))}</p>
        </div>
        <Pill tone="mint">+{Math.round(((REVENUE_WEEKS[11] - REVENUE_WEEKS[0]) / REVENUE_WEEKS[0]) * 100)}% vs W48</Pill>
      </div>
      <div className="flex h-40 items-end gap-2">
        {REVENUE_WEEKS.map((v, i) => (
          <div key={i} className="group relative flex-1">
            <div
              className={`bar-grow w-full rounded-t-md transition-colors ${i === REVENUE_WEEKS.length - 1 ? "bg-[var(--acc)]" : "bg-[var(--panel-3)] group-hover:bg-[var(--mint)]"}`}
              style={{ height: `${(v / max) * 150}px`, animationDelay: `${i * 50}ms` }}
              title={`${WEEK_LABELS[i]}: ${fmtMoney(v)}`}
            />
            <span className="mono absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] text-[var(--dim)]">{WEEK_LABELS[i]}</span>
            <span className="mono pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded bg-[var(--panel-3)] px-1.5 py-0.5 text-[9.5px] whitespace-nowrap text-[var(--ink)] opacity-0 transition-opacity group-hover:opacity-100">
              {fmtMoney(v)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RenderChart() {
  const max = Math.max(...RENDERED_WEEKS);
  const pts = RENDERED_WEEKS.map((v, i) => `${(i / (RENDERED_WEEKS.length - 1)) * 520 + 10},${150 - (v / max) * 120}`).join(" ");
  return (
    <div className="panel-flat rounded-xl p-6">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="lbl">videos rendered · thousands</p>
          <p className="font-display mt-1 text-3xl font-extrabold text-[var(--amber)]">{RENDERED_WEEKS[11]}k <span className="text-base text-[var(--dim)]">this week</span></p>
        </div>
        <Pill tone="amber">gpu 71% util</Pill>
      </div>
      <svg viewBox="0 0 540 160" className="w-full" role="img" aria-label="Videos rendered trend">
        {[0, 1, 2, 3].map((g) => (
          <line key={g} x1="10" x2="530" y1={30 + g * 40} y2={30 + g * 40} stroke="var(--line)" strokeWidth="1" />
        ))}
        <polygon points={`10,150 ${pts} 530,150`} fill="rgba(255,201,77,0.08)" />
        <polyline points={pts} fill="none" stroke="var(--amber)" strokeWidth="2.5" strokeLinecap="round" className="draw-line" />
        {RENDERED_WEEKS.map((v, i) => (
          <circle key={i} cx={(i / (RENDERED_WEEKS.length - 1)) * 520 + 10} cy={150 - (v / max) * 120} r="3.5" fill="var(--bg)" stroke="var(--amber)" strokeWidth="2">
            <title>{`${WEEK_LABELS[i]}: ${v}k videos`}</title>
          </circle>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------ overview ----------------------------- */

function Overview({ go }: { go: (t: Tab) => void }) {
  const { lifetimeVideos } = useApp();
  const kpis = [
    { label: "Pack revenue · Feb", value: "$3,815", delta: "+28% MoM", tone: "mint" as const },
    { label: "Videos rendered · Feb", value: "97,410", delta: "+14% MoM", tone: "amber" as const },
    { label: "Avg revenue / video", value: "$0.39", delta: "target $0.35", tone: "acc" as const },
    { label: "Cloud cost / video", value: "$0.038", delta: "margin 90.2%", tone: "mint" as const },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <Reveal key={k.label} delay={i * 70}>
            <div className="panel card-lift rounded-xl p-5">
              <p className="lbl">{k.label}</p>
              <p className="font-display mt-2 text-3xl font-extrabold">{k.value}</p>
              <p className={`mono mt-1.5 text-[11px] tracking-[0.1em] uppercase ${k.tone === "mint" ? "text-[var(--mint)]" : k.tone === "amber" ? "text-[var(--amber)]" : "text-[var(--acc)]"}`}>
                {k.delta}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Reveal>
          <RevenueChart />
        </Reveal>
        <Reveal delay={100}>
          <RenderChart />
        </Reveal>
      </div>
      <Reveal>
        <div className="panel-flat rounded-xl">
          <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
            <p className="lbl">latest orders</p>
            <button className="mono text-[11px] tracking-[0.14em] text-[var(--acc)] uppercase transition-colors hover:text-[var(--ink)]" onClick={() => go("orders")}>
              all orders →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="tbl min-w-[640px]">
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Pack</th><th>Videos</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {ORDERS.slice(0, 5).map((o) => (
                  <tr key={o.id}>
                    <td className="mono text-[var(--ink)]">{o.id}</td>
                    <td className="text-[var(--ink)]">{o.user}</td>
                    <td>{o.pack}</td>
                    <td className="mono">{o.videos}</td>
                    <td className="mono text-[var(--amber)]">{fmtMoney(o.amount)}</td>
                    <td><StatusPill s={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Reveal>
      <Reveal>
        <div className="mono flex flex-wrap items-center gap-x-8 gap-y-2 rounded-xl border border-[var(--line)] bg-[var(--bg-soft)] px-6 py-4 text-[11.5px] tracking-[0.1em] text-[var(--dim)] uppercase">
          <span>lifetime rendered: <span className="text-[var(--mint)]">{lifetimeVideos.toLocaleString()}</span></span>
          <span>active stores: <span className="text-[var(--ink)]">14,204</span></span>
          <span>refund rate: <span className="text-[var(--ink)]">0.7%</span></span>
          <span>median render: <span className="text-[var(--ink)]">11m 04s / 100</span></span>
        </div>
      </Reveal>
    </div>
  );
}

function StatusPill({ s }: { s: Order["status"] }) {
  const map = {
    paid: <Pill tone="mint">paid</Pill>,
    rendering: <Pill tone="amber">rendering</Pill>,
    refunded: <Pill tone="dim">refunded</Pill>,
    pending: <Pill tone="acc">pending</Pill>,
  } as const;
  return map[s];
}

/* ------------------------------- orders ------------------------------ */

function Orders() {
  const { notify } = useApp();
  const [rows, setRows] = useState(ORDERS);
  const [filter, setFilter] = useState<"all" | Order["status"]>("all");
  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);
  const act = (id: string, status: Order["status"], msg: string) => {
    setRows((r) => r.map((o) => (o.id === id ? { ...o, status } : o)));
    notify(msg, status === "refunded" ? "warn" : "ok");
  };
  return (
    <div className="panel-flat rounded-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] px-6 py-4">
        <p className="lbl">orders · {shown.length}</p>
        <div className="flex gap-2">
          {(["all", "paid", "rendering", "pending", "refunded"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`mono rounded-md px-3 py-1.5 text-[10.5px] tracking-[0.14em] uppercase transition-all ${
                filter === f ? "bg-[var(--acc)] font-bold text-[#17100b]" : "text-[var(--muted)] hover:bg-[var(--panel-3)]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="tbl min-w-[820px]">
          <thead>
            <tr><th>Order</th><th>Date</th><th>Customer</th><th>Pack</th><th>Videos</th><th>Amount</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {shown.map((o) => (
              <tr key={o.id}>
                <td className="mono text-[var(--ink)]">{o.id}</td>
                <td className="mono text-[12px]">{o.date}</td>
                <td>
                  <span className="block text-[var(--ink)]">{o.user}</span>
                  <span className="mono block text-[11px] text-[var(--dim)]">{o.email}</span>
                </td>
                <td>{o.pack}</td>
                <td className="mono">{o.videos}</td>
                <td className="mono text-[var(--amber)]">{fmtMoney(o.amount)}</td>
                <td><StatusPill s={o.status} /></td>
                <td>
                  <div className="flex gap-1.5">
                    {o.status === "pending" && (
                      <button className="rounded-md border border-[var(--mint)] px-2.5 py-1 text-[11px] font-semibold text-[var(--mint)] transition-colors hover:bg-[var(--mint-soft)]" onClick={() => act(o.id, "paid", `${o.id} marked paid`)}>
                        mark paid
                      </button>
                    )}
                    {(o.status === "paid" || o.status === "rendering") && (
                      <button className="rounded-md border border-[var(--line-strong)] px-2.5 py-1 text-[11px] text-[var(--muted)] transition-colors hover:border-[var(--red)] hover:text-[var(--red)]" onClick={() => act(o.id, "refunded", `${o.id} refunded · credits clawed back`)}>
                        refund
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* -------------------------------- users ------------------------------ */

function Users() {
  return (
    <div className="panel-flat rounded-xl">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-6 py-4">
        <p className="lbl">users · {USERS.length}</p>
        <button className="mono text-[11px] tracking-[0.14em] text-[var(--acc)] uppercase">export csv ↓</button>
      </div>
      <div className="overflow-x-auto">
        <table className="tbl min-w-[760px]">
          <thead>
            <tr><th>User</th><th>Lane</th><th>Videos rendered</th><th>Lifetime spend</th><th>Joined</th><th>Status</th></tr>
          </thead>
          <tbody>
            {USERS.map((u) => (
              <tr key={u.email}>
                <td>
                  <span className="block text-[var(--ink)]">{u.name}</span>
                  <span className="mono block text-[11px] text-[var(--dim)]">{u.email}</span>
                </td>
                <td>{u.niche}</td>
                <td className="mono">{u.videos.toLocaleString()}</td>
                <td className="mono text-[var(--amber)]">{fmtMoney(u.spent)}</td>
                <td className="mono text-[12px]">{u.joined}</td>
                <td>
                  <Pill tone={u.status === "active" ? "mint" : u.status === "trial" ? "amber" : "dim"}>{u.status}</Pill>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------- catalog ----------------------------- */

function Catalog() {
  const { niches, toggleNiche, packs, updatePackPrice, notify } = useApp();
  return (
    <div className="space-y-6">
      <div className="panel-flat rounded-xl">
        <div className="border-b border-[var(--line)] px-6 py-4">
          <p className="lbl">lanes on the storefront</p>
          <p className="mt-1 text-[13px] text-[var(--muted)]">Toggling a lane hides it from the landing page and the Studio instantly.</p>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {niches.map((n) => (
            <div key={n.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <span className="mono w-16 text-[10.5px] tracking-[0.18em] uppercase" style={{ color: n.accent }}>{n.lane}</span>
              <div className="min-w-[220px] flex-1">
                <p className="font-display text-[16px] font-bold">{n.name}</p>
                <p className="mono text-[11px] text-[var(--dim)]">{n.platform} · {n.stat}</p>
              </div>
              <span className={`mono text-[10.5px] tracking-[0.14em] uppercase ${n.active ? "text-[var(--mint)]" : "text-[var(--dim)]"}`}>
                {n.active ? "live" : "draft"}
              </span>
              <button
                role="switch"
                aria-checked={n.active}
                aria-label={`Toggle ${n.name}`}
                onClick={() => {
                  toggleNiche(n.id);
                  notify(`${n.name} is now ${n.active ? "draft (hidden)" : "live on storefront"}`, n.active ? "warn" : "ok");
                }}
                className={`relative h-7 rounded-full border transition-colors ${n.active ? "border-[var(--mint)] bg-[var(--mint-soft)]" : "border-[var(--line-strong)] bg-[var(--panel-3)]"}`}
                style={{ width: 52 }}
              >
                <span
                  className={`absolute top-[3px] h-[20px] w-[20px] rounded-full transition-all duration-200 ${n.active ? "left-[26px] bg-[var(--mint)]" : "left-[4px] bg-[var(--dim)]"}`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="panel-flat rounded-xl">
        <div className="border-b border-[var(--line)] px-6 py-4">
          <p className="lbl">pack pricing</p>
          <p className="mt-1 text-[13px] text-[var(--muted)]">Cloud cost ≈ $0.038 per video. Prices update the storefront and Studio live.</p>
        </div>
        <div className="divide-y divide-[var(--line)]">
          {packs.map((p) => {
            const cost = p.videos * 0.038;
            const margin = ((p.price - cost) / p.price) * 100;
            return (
              <div key={p.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                <div className="min-w-[180px] flex-1">
                  <p className="font-display text-[16px] font-bold">{p.name}</p>
                  <p className="mono text-[11px] text-[var(--dim)]">{p.videos} videos · cost {fmtMoney(cost)}</p>
                </div>
                <div className="mono w-28 text-[12px]">
                  margin <span className={margin >= 85 ? "text-[var(--mint)]" : margin >= 70 ? "text-[var(--amber)]" : "text-[var(--red)]"}>{margin.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="mono text-[13px] text-[var(--dim)]">$</span>
                  <input
                    type="number"
                    min={1}
                    className="input mono w-24 px-3 py-2 text-[14px]"
                    value={p.price}
                    onChange={(e) => updatePackPrice(p.id, Number(e.target.value) || 1)}
                    aria-label={`${p.name} price`}
                  />
                  <button className="btn btn-ghost px-3.5 py-2 text-[12px]" onClick={() => notify(`${p.name} price saved to storefront`, "ok")}>
                    save
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- models ------------------------------ */

function Models() {
  const { settings, setSettings, notify } = useApp();
  const [costs, setCosts] = useState(() => Object.fromEntries(STACK_ROWS.map((r) => [r.model, r.per1k])));
  const total = Object.values(costs).reduce((a, b) => a + (b as number), 0);
  const perVideo = total / 1000;
  return (
    <div className="space-y-6">
      <div className="panel-flat rounded-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] px-6 py-4">
          <div>
            <p className="lbl">render provider</p>
            <p className="mt-1 text-[13px] text-[var(--muted)]">Where Wan 2.1 b-roll actually renders. Everything else is self-hosted.</p>
          </div>
          <div className="flex gap-2">
            {["Replicate", "Fal", "RunPod", "Local ComfyUI"].map((p) => (
              <button
                key={p}
                onClick={() => {
                  setSettings({ provider: p });
                  notify(`Render provider → ${p}`, "acc");
                }}
                className={`mono rounded-md px-3.5 py-2 text-[11px] tracking-[0.12em] uppercase transition-all ${
                  settings.provider === p ? "bg-[var(--acc)] font-bold text-[#17100b]" : "border border-[var(--line-strong)] text-[var(--muted)] hover:text-[var(--ink)]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="tbl min-w-[680px]">
            <thead>
              <tr><th>Model</th><th>Role</th><th>Version</th><th>Cost / 1k videos</th><th></th></tr>
            </thead>
            <tbody>
              {STACK_ROWS.map((r) => (
                <tr key={r.model}>
                  <td className="font-semibold text-[var(--ink)]">{r.model}</td>
                  <td>{r.role}</td>
                  <td className="mono text-[12px]">{r.model.startsWith("Wan") ? "2.1-1.3B-fp8" : r.model.startsWith("Llama") ? "70B-instruct" : "latest"}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <span className="mono text-[12px] text-[var(--dim)]">$</span>
                      <input
                        type="number"
                        step="0.01"
                        min={0}
                        className="input mono w-24 px-3 py-1.5 text-[13px]"
                        value={costs[r.model]}
                        onChange={(e) => setCosts((c) => ({ ...c, [r.model]: Number(e.target.value) || 0 }))}
                        aria-label={`${r.model} cost per 1000`}
                      />
                    </div>
                  </td>
                  <td><Pill tone="mint">self-hostable</Pill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mono flex flex-wrap items-center gap-x-10 gap-y-2 border-t border-[var(--line)] px-6 py-4 text-[12px]">
          <span className="text-[var(--dim)]">cloud cost / 100-video pack</span>
          <span className="text-lg font-bold text-[var(--red)]">{fmtMoney(perVideo * 100)}</span>
          <span className="text-[var(--dim)]">at Creator Crate $39 →</span>
          <span className="text-lg font-bold text-[var(--mint)]">{(((39 - perVideo * 100) / 39) * 100).toFixed(1)}% margin</span>
        </div>
      </div>

      <div className="panel-flat flex flex-wrap items-center justify-between gap-4 rounded-xl px-6 py-5">
        <div>
          <p className="font-display text-[16px] font-bold">Auto-render on payment</p>
          <p className="text-[13px] text-[var(--muted)]">Kick off the GPU job the second Stripe confirms. Off = manual queue review.</p>
        </div>
        <button
          role="switch"
          aria-checked={settings.autoRender}
          onClick={() => {
            setSettings({ autoRender: !settings.autoRender });
            notify(`Auto-render ${settings.autoRender ? "disabled" : "enabled"}`, "acc");
          }}
          className="relative rounded-full border transition-colors"
          style={{ width: 52, height: 28, borderColor: settings.autoRender ? "var(--mint)" : "var(--line-strong)", background: settings.autoRender ? "var(--mint-soft)" : "var(--panel-3)" }}
        >
          <span
            className="absolute top-[3px] h-[20px] w-[20px] rounded-full transition-all duration-200"
            style={{ left: settings.autoRender ? 26 : 4, background: settings.autoRender ? "var(--mint)" : "var(--dim)" }}
          />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------- system ----------------------------- */

function System() {
  const { settings, setSettings, notify } = useApp();
  const workers = [
    { name: "gpu-pool/01", gpu: "RTX 4090", load: 82, jobs: 4 },
    { name: "gpu-pool/04", gpu: "A10G", load: 64, jobs: 3 },
    { name: "gpu-pool/07", gpu: "A100 40GB", load: 91, jobs: 6 },
    { name: "gpu-pool/09", gpu: "L4", load: 12, jobs: 1 },
  ];
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {workers.map((w, i) => (
          <div key={w.name} className="panel card-lift rounded-xl p-5">
            <div className="flex items-center justify-between">
              <p className="mono text-[12px] font-bold text-[var(--ink)]">{w.name}</p>
              <span className="live-dot h-2 w-2 rounded-full bg-[var(--mint)]" />
            </div>
            <p className="mono mt-0.5 text-[10.5px] tracking-[0.12em] text-[var(--dim)] uppercase">{w.gpu} · {w.jobs} jobs</p>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[var(--panel-3)]">
              <div
                className={`bar-grow h-full rounded-full ${w.load > 85 ? "bg-[var(--red)]" : w.load > 60 ? "bg-[var(--amber)]" : "bg-[var(--mint)]"}`}
                style={{ width: `${w.load}%`, animationDelay: `${i * 90}ms` }}
              />
            </div>
            <p className="mono mt-2 text-[11px] text-[var(--muted)]">{w.load}% util</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="panel-flat rounded-xl p-6">
          <p className="lbl mb-4">queue</p>
          <div className="mono space-y-2.5 text-[12.5px]">
            <p className="flex justify-between"><span className="text-[var(--dim)]">jobs queued</span><span className="text-[var(--ink)]">3</span></p>
            <p className="flex justify-between"><span className="text-[var(--dim)]">jobs rendering</span><span className="text-[var(--amber)]">14</span></p>
            <p className="flex justify-between"><span className="text-[var(--dim)]">failed last 24h</span><span className="text-[var(--mint)]">0</span></p>
            <p className="flex justify-between"><span className="text-[var(--dim)]">avg wait</span><span className="text-[var(--ink)]">42s</span></p>
            <p className="flex justify-between"><span className="text-[var(--dim)]">storage · rendered cache</span><span className="text-[var(--ink)]">4.2 TB / 10 TB</span></p>
          </div>
        </div>
        <div className="panel-flat rounded-xl p-6">
          <p className="lbl mb-4">danger zone</p>
          <div className="flex items-center justify-between gap-4 rounded-lg border border-[var(--line)] px-4 py-3.5">
            <div>
              <p className="text-[14px] font-semibold">Maintenance mode</p>
              <p className="text-[12.5px] text-[var(--muted)]">Shows a banner in the Studio; queues keep draining.</p>
            </div>
            <button
              role="switch"
              aria-checked={settings.maintenance}
              onClick={() => {
                setSettings({ maintenance: !settings.maintenance });
                notify(`Maintenance mode ${settings.maintenance ? "off" : "on"} — Studio banner updated`, "warn");
              }}
              className="relative shrink-0 rounded-full border transition-colors"
              style={{ width: 52, height: 28, borderColor: settings.maintenance ? "var(--amber)" : "var(--line-strong)", background: settings.maintenance ? "var(--amber-soft)" : "var(--panel-3)" }}
            >
              <span
                className="absolute top-[3px] h-[20px] w-[20px] rounded-full transition-all duration-200"
                style={{ left: settings.maintenance ? 26 : 4, background: settings.maintenance ? "var(--amber)" : "var(--dim)" }}
              />
            </button>
          </div>
          <button
            className="btn btn-ghost mt-4 w-full py-3 text-[13.5px] !text-[var(--red)] hover:!border-[var(--red)]"
            onClick={() => {
              Object.keys(localStorage).filter((k) => k.startsWith("rm_")).forEach((k) => localStorage.removeItem(k));
              notify("Demo data reset — reloading", "warn");
              window.setTimeout(() => window.location.reload(), 900);
            }}
          >
            <I n="refresh" size={14} /> Reset all demo data
          </button>
        </div>
      </div>

      <div className="panel-flat rounded-xl p-6">
        <p className="lbl mb-4">api keys · stored encrypted</p>
        <div className="mono grid gap-3 text-[12.5px] sm:grid-cols-2">
          {[
            ["STRIPE_SECRET", "sk_live_••••••••••••4k2J"],
            ["REPLICATE_TOKEN", "r8_••••••••••••9fQa"],
            ["GROQ_KEY", "gsk_••••••••••••Zx11"],
            ["DRIVE_SERVICE", "sa@reelmatic.iam.••••"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-lg border border-[var(--line)] bg-[var(--bg-soft)] px-4 py-3">
              <span className="text-[var(--dim)]">{k}</span>
              <span className="flex items-center gap-2 text-[var(--muted)]">
                {v} <I n="key" size={13} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- admin ------------------------------ */

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const { setView } = useApp();

  const title = useMemo(() => TABS.find((t) => t.id === tab)?.label ?? "", [tab]);

  if (!authed) return <Gate onPass={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[rgba(12,19,16,0.9)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-5">
          <button className="flex items-center gap-2.5" onClick={() => setView("home")}>
            <Logo size={26} />
            <span className="font-display text-base font-bold">REELMATIC</span>
            <span className="mono ml-1 rounded-md border border-[var(--amber)] px-2 py-0.5 text-[10px] tracking-[0.16em] text-[var(--amber)] uppercase">
              owner console
            </span>
          </button>
          <div className="flex items-center gap-3">
            <button className="mono hidden text-[11px] tracking-[0.12em] text-[var(--dim)] uppercase transition-colors hover:text-[var(--muted)] sm:block" onClick={() => setView("studio")}>
              open studio
            </button>
            <button className="btn btn-ghost px-4 py-2 text-[13px]" onClick={() => setAuthed(false)}>
              <I n="logout" size={14} /> Lock
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8">
        <div className="grid gap-8 lg:grid-cols-12">
          <aside className="lg:col-span-3">
            <nav className="flex gap-1.5 overflow-x-auto lg:sticky lg:top-24 lg:flex-col">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`flex shrink-0 items-center gap-3 rounded-lg border px-4 py-3 text-left text-[14px] font-semibold transition-all ${
                    tab === t.id ? "border-[var(--acc)] bg-[var(--acc-soft)] text-[var(--ink)]" : "border-transparent text-[var(--muted)] hover:border-[var(--line)] hover:text-[var(--ink)]"
                  }`}
                >
                  <span className={tab === t.id ? "text-[var(--acc)]" : "text-[var(--dim)]"}>
                    <I n={t.icon} size={16} />
                  </span>
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>
          <div className="lg:col-span-9">
            <Reveal key={tab}>
              <h1 className="font-display mb-6 text-3xl font-extrabold">{title}</h1>
            </Reveal>
            {tab === "overview" && <Overview go={setTab} />}
            {tab === "orders" && <Orders />}
            {tab === "users" && <Users />}
            {tab === "catalog" && <Catalog />}
            {tab === "models" && <Models />}
            {tab === "system" && <System />}
          </div>
        </div>
      </main>
    </div>
  );
}
