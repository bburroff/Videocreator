/* ------------------------------------------------------------------ */
/*  Reelmatic data layer: niches, packs, hook matrices, admin dataset  */
/* ------------------------------------------------------------------ */

export type NicheId = "dropship" | "pets" | "amazon";

export interface Niche {
  id: NicheId;
  lane: string;
  name: string;
  platform: string;
  aspect: string;
  prefix: string;
  pitch: string;
  who: string;
  hooks: string[];
  voice: string;
  captions: string;
  music: string;
  stat: string;
  thumbs: [string, string];
  accent: string;
  sample: string;
}

export interface Pack {
  id: string;
  name: string;
  videos: number;
  price: number;
  tag?: string;
  featured?: boolean;
  note: string;
}

export interface VideoItem {
  id: string;
  hook: string;
  dur: number;
  voice: string;
  captions: string;
  music: string;
  thumb: string;
  hue: number;
  model: string;
  status: "ready";
}

export const THUMBS: Record<string, string> = {
  "ds-1":
    "https://image.qwenlm.ai/generated-images/deacb5a1-ae59-4aca-918a-6386c58437f3/_result.png",
  "ds-2":
    "https://image.qwenlm.ai/generated-images/370a1a1c-e4cf-4fa3-a7b6-ccd86ccba5cd/_result.png",
  "pet-1":
    "https://image.qwenlm.ai/generated-images/5e733157-4d40-486f-a234-4276b59068ae/_result.png",
  "pet-2":
    "https://image.qwenlm.ai/generated-images/3c013d3b-80e6-41d3-b0d7-7af610fe0ba3/_result.png",
  "amz-1":
    "https://image.qwenlm.ai/generated-images/dbd9a02c-b60f-420d-a82b-1a994991af92/_result.png",
  "amz-2":
    "https://image.qwenlm.ai/generated-images/66e922ca-3103-4537-9fa3-07b48793b3a4/_result.png",
};

export const NICHES: Niche[] = [
  {
    id: "dropship",
    lane: "Lane 01",
    name: "TikTok Dropshipping",
    platform: "TikTok · 9:16 vertical",
    aspect: "9:16",
    prefix: "TT",
    pitch: "For the 3 a.m. product researchers who find a winner and need creatives by breakfast.",
    who: "Dropshippers · TikTok Shop sellers · UGC arbitrage",
    hooks: [
      "TikTok made me buy it — round 47",
      "This $14 thing replaced my $80 one",
      "POV: your room looks like a spaceship now",
      "Nobody is talking about this AliExpress find",
      "I tested the viral gadget so you don't have to",
      "3 reasons this is selling out everywhere",
    ],
    voice: "Maya — energetic",
    captions: "Karaoke Bold",
    music: "Phonk / lo-fi beds",
    stat: "+38% avg CTR lift",
    thumbs: ["ds-1", "ds-2"],
    accent: "var(--acc)",
    sample: "galaxy star projector",
  },
  {
    id: "pets",
    lane: "Lane 02",
    name: "Facebook Pet Supplies",
    platform: "Facebook · 4:5 + 1:1",
    aspect: "4:5",
    prefix: "FB",
    pitch: "For the dog-mom demographic that buys on feeling. Warm hooks, gentle proof, instant trust.",
    who: "Pet stores · Chewy resellers · Groomers & shelters",
    hooks: [
      "The vet trick most owners never learn",
      "He stopped pulling in 3 walks",
      "Your cat is quietly dehydrated. Here's the fix.",
      "We asked 100 groomers. Same answer every time.",
      "The $19 upgrade your dog can't tell you about",
      "Senior dogs deserve this more than anything",
    ],
    voice: "Jon — warm narrator",
    captions: "Clean Sub",
    music: "Acoustic warm beds",
    stat: "CPA $21 → $9 in week 1",
    thumbs: ["pet-1", "pet-2"],
    accent: "var(--mint)",
    sample: "no-pull dog harness",
  },
  {
    id: "amazon",
    lane: "Lane 03",
    name: "Amazon Listing Reels",
    platform: "Amazon · 16:9 + 9:16",
    aspect: "16:9",
    prefix: "AMZ",
    pitch: "For the listing that needs 7 seconds of proof above the fold. Demo-first, spec-callout captions.",
    who: "FBA sellers · Private label · Amazon agencies",
    hooks: [
      "The 7-second demo that answers every question",
      "Side by side with the $60 version",
      "What's actually in the box — uncut",
      "Why 4.6 stars on 12,000 reviews",
      "Set it up in 40 seconds. Timed.",
      "The detail the photos never show",
    ],
    voice: "Ava — confident demo",
    captions: "Spec Callouts",
    music: "Neutral tech beds",
    stat: "+22% conversion on listings",
    thumbs: ["amz-1", "amz-2"],
    accent: "var(--amber)",
    sample: "ergonomic laptop stand",
  },
];

export const DEFAULT_PACKS: Pack[] = [
  {
    id: "starter",
    name: "Starter Reel",
    videos: 25,
    price: 12,
    note: "Test one product, one niche.",
  },
  {
    id: "creator",
    name: "Creator Crate",
    videos: 100,
    price: 39,
    tag: "Most packs",
    featured: true,
    note: "One product link → a full testing matrix.",
  },
  {
    id: "scale",
    name: "Scale Pallet",
    videos: 500,
    price: 159,
    note: "Weekly creatives for 3+ stores.",
  },
];

/* ------------------------- hook generation ------------------------ */

const OPENERS: Record<NicheId, string[]> = {
  dropship: [
    "Stop scrolling — {p} just went viral again",
    "TikTok made me buy {p}. Verdict:",
    "POV: you finally found {p} under $20",
    "Nobody told you about this {p} hack",
    "I gatekept {p} for a month. No more.",
    "This {p} has 4M views for a reason",
    "Your cart needs {p} and here's why",
    "Testing {p} so your $15 doesn't go to waste",
  ],
  pets: [
    "Vet-approved: why {p} changes walk time",
    "Your dog can't say thank you. But after {p}…",
    "The {p} 100 groomers swear by",
    "We tried {p} on 12 rescue dogs. Results:",
    "If your pet does this, they need {p}",
    "The {p} your vet wishes you knew about",
    "3 walks. That's all {p} needed",
    "Senior pet parents: {p} is the answer",
  ],
  amazon: [
    "The honest 20-second demo of {p}",
    "{p}: what's actually in the box",
    "We timed the {p} setup — 40 seconds",
    "{p} vs the $60 name brand. Same factory.",
    "The spec everyone misses on {p}",
    "12,000 reviews later: the truth about {p}",
    "{p} stress test — does it hold?",
    "Before you buy {p}, watch this",
  ],
};

const ANGLES: Record<NicheId, string[]> = {
  dropship: [
    "ships free this week",
    "works better than the brand-name version",
    "solves the problem you didn't know you had",
    "under $20 until the algorithm finds it",
    "the comments section is losing it",
    "sold 40k units last month",
    "small enough to hide, loud enough to impress",
    "the gift everyone pretends they bought first",
  ],
  pets: [
    "soft on joints, tough on habits",
    "vet-checked and washer-safe",
    "calms the pullers, saves your shoulder",
    "one refill lasts a full month",
    "no batteries, no apps, no gimmicks",
    "backed by a 60-day happy-tail guarantee",
    "designed with groomers, not marketers",
    "the quiet upgrade your pet notices instantly",
  ],
  amazon: [
    "folds flat, holds 8kg",
    "tool-free assembly, honestly",
    "the warranty is longer than the review section",
    "passes the wobble test at max height",
    "fits 11–17 inch laptops, even chunky ones",
    "dishwasher-safe, stain-proof, BPA-free",
    "backed by a 12-month no-questions return",
    "the hinge is aluminum, not plastic — check the close-up",
  ],
};

const CLOSERS: Record<NicheId, string[]> = {
  dropship: ["Link's in bio before it sells out", "Grab it before the price jumps", "Comment LINK and I'll send it", "It's in my storefront — go", "Don't sleep on this one", "Add to cart, thank me later"],
  pets: ["Your pet deserves the upgrade", "Tap shop — they'll feel the difference", "Every order funds a shelter meal", "Try it risk-free for 60 days", "Share with a pet parent who needs this", "Stock up — it sells out monthly"],
  amazon: ["Prime-eligible, ships today", "Check today's coupon on the listing", "Compare the spec sheet — we'll wait", "Add to cart while the deal's live", "Questions? The demo answers them", "Warranty info is on the listing"],
};

export function makeHooks(niche: NicheId, product: string, count: number): string[] {
  const p = product.trim() || "this find";
  const O = OPENERS[niche];
  const A = ANGLES[niche];
  const C = CLOSERS[niche];
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const mode = i % 3;
    let h: string;
    if (mode === 0) h = O[i % O.length].replace("{p}", p);
    else if (mode === 1)
      h = `${O[(i * 3 + 1) % O.length].replace("{p}", p)} — ${A[(i * 5 + 2) % A.length]}`;
    else h = `${O[(i * 7 + 3) % O.length].replace("{p}", p)}. ${C[(i * 2 + 1) % C.length]}`;
    out.push(h);
  }
  return out;
}

export function makeVideos(niche: Niche, product: string, count: number, voice: string, captions: string, music: string, batchTag: string): VideoItem[] {
  const hooks = makeHooks(niche.id, product, count);
  return hooks.map((hook, i) => ({
    id: `${niche.prefix}-${batchTag}-${String(i + 1).padStart(3, "0")}`,
    hook,
    dur: 8 + ((i * 7) % 19),
    voice,
    captions,
    music,
    thumb: THUMBS[niche.thumbs[i % 2]],
    hue: (i * 47) % 360,
    model: "wan-2.1 · 480p→upscaled",
    status: "ready" as const,
  }));
}

export function productNameFrom(input: string, fallback: string): string {
  const t = input.trim();
  if (!t) return fallback;
  try {
    if (/^https?:\/\//i.test(t)) {
      const u = new URL(t);
      const seg = u.pathname.split("/").filter(Boolean).pop() ?? "";
      const clean = seg.replace(/[-_+]/g, " ").replace(/\.\w+$/, "").replace(/\d{4,}/g, "").trim();
      if (clean.length > 2) return clean.split(" ").slice(0, 4).join(" ");
      return fallback;
    }
  } catch {
    /* fall through to raw text */
  }
  return t.split(" ").slice(0, 5).join(" ");
}

/* --------------------------- admin dataset ------------------------- */

export interface Order {
  id: string;
  user: string;
  email: string;
  pack: string;
  videos: number;
  amount: number;
  status: "paid" | "rendering" | "refunded" | "pending";
  date: string;
}

export const ORDERS: Order[] = [
  { id: "ORD-8412", user: "Marcus Tran", email: "marcus@3amfinds.co", pack: "Creator Crate", videos: 100, amount: 39, status: "paid", date: "2026-02-11 09:14" },
  { id: "ORD-8411", user: "Dana Ruiz", email: "dana@pawsome.supply", pack: "Scale Pallet", videos: 500, amount: 159, status: "rendering", date: "2026-02-11 08:47" },
  { id: "ORD-8410", user: "Leo Marsh", email: "leo.marsh@gmail.com", pack: "Starter Reel", videos: 25, amount: 12, status: "paid", date: "2026-02-11 07:59" },
  { id: "ORD-8409", user: "Priya Nair", email: "priya@fbalchemy.io", pack: "Creator Crate", videos: 100, amount: 39, status: "paid", date: "2026-02-10 22:31" },
  { id: "ORD-8408", user: "Jonas Weber", email: "jw@weber-fba.de", pack: "Scale Pallet", videos: 500, amount: 159, status: "paid", date: "2026-02-10 19:05" },
  { id: "ORD-8407", user: "Aisha Bell", email: "aisha@belledits.com", pack: "Creator Crate", videos: 100, amount: 39, status: "refunded", date: "2026-02-10 15:22" },
  { id: "ORD-8406", user: "Tom Okafor", email: "tom@okafor.store", pack: "Starter Reel", videos: 25, amount: 12, status: "paid", date: "2026-02-10 11:48" },
  { id: "ORD-8405", user: "Sofia Lima", email: "sofia@limabrands.co", pack: "Creator Crate", videos: 100, amount: 39, status: "paid", date: "2026-02-09 21:17" },
  { id: "ORD-8404", user: "Ray Chen", email: "ray@chensells.com", pack: "Scale Pallet", videos: 500, amount: 159, status: "pending", date: "2026-02-09 18:02" },
  { id: "ORD-8403", user: "Emma Kowalski", email: "emma@petreel.pl", pack: "Creator Crate", videos: 100, amount: 39, status: "paid", date: "2026-02-09 12:36" },
  { id: "ORD-8402", user: "Derek Holt", email: "derek@holtgoods.us", pack: "Starter Reel", videos: 25, amount: 12, status: "paid", date: "2026-02-08 16:54" },
  { id: "ORD-8401", user: "Nia Brooks", email: "nia@brooksbuy.co", pack: "Creator Crate", videos: 100, amount: 39, status: "paid", date: "2026-02-08 09:21" },
];

export interface UserRow {
  name: string;
  email: string;
  niche: string;
  videos: number;
  spent: number;
  joined: string;
  status: "active" | "trial" | "churned";
}

export const USERS: UserRow[] = [
  { name: "Marcus Tran", email: "marcus@3amfinds.co", niche: "Dropship", videos: 1240, spent: 486, joined: "2025-09-02", status: "active" },
  { name: "Dana Ruiz", email: "dana@pawsome.supply", niche: "Pet Supply", videos: 2110, spent: 812, joined: "2025-08-14", status: "active" },
  { name: "Jonas Weber", email: "jw@weber-fba.de", niche: "Amazon", videos: 1730, spent: 699, joined: "2025-10-21", status: "active" },
  { name: "Priya Nair", email: "priya@fbalchemy.io", niche: "Pet Supply", videos: 640, spent: 243, joined: "2025-11-30", status: "active" },
  { name: "Leo Marsh", email: "leo.marsh@gmail.com", niche: "Dropship", videos: 25, spent: 12, joined: "2026-02-11", status: "trial" },
  { name: "Aisha Bell", email: "aisha@belledits.com", niche: "Dropship", videos: 100, spent: 0, joined: "2026-01-19", status: "churned" },
  { name: "Sofia Lima", email: "sofia@limabrands.co", niche: "Amazon", videos: 310, spent: 117, joined: "2025-12-05", status: "active" },
  { name: "Ray Chen", email: "ray@chensells.com", niche: "Dropship", videos: 965, spent: 372, joined: "2025-09-27", status: "active" },
];

export const REVENUE_WEEKS = [1180, 1420, 1310, 1760, 2040, 1890, 2380, 2610, 2450, 2980, 3420, 3815];
export const RENDERED_WEEKS = [28, 34, 31, 41, 49, 46, 58, 63, 59, 74, 86, 97]; // in thousands
export const WEEK_LABELS = ["W48", "W49", "W50", "W51", "W52", "W01", "W02", "W03", "W04", "W05", "W06", "W07"];

export const STACK_ROWS = [
  { model: "Llama 3.1 70B", role: "Hooks & scripts", host: "Groq / vLLM", per1k: 0.12, open: true },
  { model: "Kokoro-82M", role: "Voiceover (4 voices)", host: "Self-host · GPU", per1k: 0.9, open: true },
  { model: "Whisper v3", role: "Caption timing", host: "Faster-whisper", per1k: 0.6, open: true },
  { model: "Wan 2.1 1.3B", role: "B-roll generation", host: "Replicate / RunPod", per1k: 31, open: true },
  { model: "MusicGen Small", role: "Cleared music beds", host: "Self-host · GPU", per1k: 4.0, open: true },
];

export const FAQS = [
  {
    q: "Is the app really free?",
    a: "Yes. Reelmatic itself costs nothing — no subscription, no seat fees, no watermark tax. You only pay for video packs, and packs never expire. Your 12 free videos are waiting the moment you open the Studio.",
  },
  {
    q: "How little input do I actually give?",
    a: "One product link (or one line of text). That's it. The niche lane you pick is preprogrammed with hook matrices, script structures, voice, caption style and music — the machine handles the other ~14 decisions you'd normally make in an editing app.",
  },
  {
    q: "How fast are 100 videos?",
    a: "A 100-video Creator Crate renders in about 11 minutes on our GPU pool. You can watch the pipeline live — hooks, voiceover, captions and renders stream in as they finish.",
  },
  {
    q: "Do I own the videos commercially?",
    a: "100% yes. Every output ships with a commercial license, the music beds are generated (not licensed tracks), and nothing is watermarked. Post them on TikTok, Facebook, Amazon, anywhere.",
  },
  {
    q: "Which models run under the hood?",
    a: "Open-weights models wherever possible — Llama 3.1 for writing, Kokoro for voice, Whisper for captions, Wan 2.1 for b-roll, MusicGen for music. That's why a 100-video pack costs us ~$3.80 in cloud compute, and why the app can stay free.",
  },
  {
    q: "Can I tweak a script or voice before rendering?",
    a: "By design, no — that's the point. Approving 100 scripts is how people quit. If a hook flops, hit 'New hook' on any finished video and it regenerates in seconds, no credits charged for swaps.",
  },
];

export const TESTIMONIALS = [
  {
    quote: "I run three dropship stores. I paste links on Monday morning and spend the week testing creatives instead of writing them.",
    name: "Marcus T.",
    role: "3 stores · TikTok Shop",
    metric: "9.4k orders",
  },
  {
    quote: "The pet lane just gets Facebook. My cost per purchase dropped from $21 to $9 in the first week.",
    name: "Dana R.",
    role: "Pawsome Supplies",
    metric: "CPA −57%",
  },
  {
    quote: "I don't know what a keyframe is. That's exactly the point.",
    name: "Leo M.",
    role: "First-time seller",
    metric: "First 100 ads",
  },
];

export const fmtMoney = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });
