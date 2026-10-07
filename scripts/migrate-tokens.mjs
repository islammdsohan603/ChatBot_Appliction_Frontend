// One-off codemod: Tailwind palette / arbitrary colours  ->  NEXORA semantic token utilities.
// Usage: node scripts/migrate-tokens.mjs [--dry]
import fs from "node:fs";
import path from "node:path";

const DRY = process.argv.includes("--dry");
const root = path.resolve("src");
const SKIP = [path.join("styles", "variables.css"), "index.css"];

const FAM = {
  neutral: ["slate", "gray", "zinc", "neutral", "stone"],
  brand: ["violet", "purple", "fuchsia", "pink", "indigo"],
  cyan: ["cyan", "sky", "teal"],
  blue: ["blue"],
  green: ["green", "emerald", "lime"],
  red: ["red", "rose"],
  warm: ["amber", "yellow", "orange"],
};
const famOf = (n) => Object.keys(FAM).find((k) => FAM[k].includes(n));
const NAMES = Object.values(FAM).flat().join("|");
const VALUE_RE = new RegExp(
  `^(?:(white|black)|(${NAMES})-(\\d{2,3})|\\[(#[0-9a-fA-F]{3,8}|rgba?\\([^\\]]+\\))\\])(?:\\/(\\d{1,3}|\\[[\\d.]+\\]))?$`
);
const UTIL_RE = /^(bg|text|border(?:-[trblxyse])?|from|via|to|ring|shadow|divide|placeholder|fill|stroke|outline|decoration|caret)-(.+)$/;

const leftovers = new Map();
const note = (k) => leftovers.set(k, (leftovers.get(k) || 0) + 1);

/* ── helpers ── */
function splitVariants(tok) {
  const parts = [];
  let depth = 0, cur = "";
  for (const ch of tok) {
    if (ch === "[" || ch === "(") depth++;
    if (ch === "]" || ch === ")") depth--;
    if (ch === ":" && depth === 0) { parts.push(cur); cur = ""; } else cur += ch;
  }
  parts.push(cur);
  return { variants: parts.slice(0, -1), util: parts[parts.length - 1] };
}
function hexToRgb(h) {
  h = h.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}
function lum([r, g, b]) {
  const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
function parseArbitrary(s) {
  if (s.startsWith("#")) return { rgb: hexToRgb(s), a: null };
  const m = s.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)/);
  if (!m) return null;
  return { rgb: [+m[1], +m[2], +m[3]], a: m[4] != null ? +m[4] : null };
}
const fmtAlpha = (a) => {
  const p = Math.round(a * 100);
  return Math.abs(p - a * 100) < 0.01 ? `/${p}` : `/[${a}]`;
};
const alphaNum = (al) => (al == null ? null : al.startsWith("[") ? parseFloat(al.slice(1, -1)) * 100 : +al);

/* ── per-property mappers: return semantic colour string (e.g. "primary/10") or null ── */
function semantic(prop, variants, desc) {
  // desc: {kind:'white'|'black'|'pal'|'arb', fam, shade, rgb, alpha(string|null), a(num|null)}
  const interactive = variants.some((v) => /^(hover|focus|focus-within|focus-visible|group-hover|group-focus-within|active|peer-focus)$/.test(v));
  const al = desc.alpha; // raw suffix without slash e.g. "10" or "[0.85]"
  const A = al ? "/" + al : "";
  const an = alphaNum(al);
  const sh = desc.shade;

  // arbitrary colours → classify to a family-like role by luminance
  if (desc.kind === "arb") {
    const L = lum(desc.rgb);
    const a = desc.a != null ? desc.a : an != null ? an / 100 : null;
    const AA = a != null && a < 1 ? fmtAlpha(a) : "";
    const [r, g, b] = desc.rgb;
    const sat = Math.max(r, g, b) - Math.min(r, g, b);
    const isViolet = b > g && r > g && sat > 60 && L > 0.04;
    if (prop === "bg") {
      if (isViolet) return "primary" + AA;
      if (L < 0.02) return "canvas" + AA;
      if (L < 0.06) return "surface" + AA;
      if (L < 0.12) return "surface-hover" + AA;
      if (L > 0.8) return "surface" + AA;
      return null;
    }
    if (prop === "text") { if (L > 0.5) return "fg"; if (L < 0.1) return "fg"; return null; }
    if (prop === "border" || prop === "ring" || prop === "divide" || prop === "outline") {
      if (isViolet) return "primary" + AA;
      return L < 0.1 ? "line" : "line-strong";
    }
    if (["from", "via", "to"].includes(prop)) {
      if (isViolet) return "brand-violet" + AA;
      if (L < 0.02) return "canvas" + AA;
      if (L < 0.12) return "surface" + AA;
      return null;
    }
    if (prop === "shadow") return isViolet ? "primary" + AA : "scrim" + AA;
    return null;
  }

  /* TEXT-like props */
  if (prop === "text" || prop === "fill" || prop === "stroke" || prop === "placeholder" || prop === "decoration" || prop === "caret") {
    if (desc.kind === "white") return "primary-contrast" + A;
    if (desc.kind === "black") return "fg" + A;
    const f = desc.fam;
    if (f === "neutral") return (sh >= 800 ? "fg" : sh >= 600 ? "fg-secondary" : sh >= 400 ? "fg-muted" : sh >= 300 ? "fg-secondary" : "fg") + A;
    if (f === "brand") return "primary-text" + A;
    if (f === "cyan") return "accent-text" + A;
    if (f === "blue") return "info-text" + A;
    if (f === "green") return "success-text" + A;
    if (f === "red") return "error-text" + A;
    if (f === "warm") return "warning-text" + A;
  }

  /* BG */
  if (prop === "bg") {
    if (desc.kind === "white") return an != null && an <= 20 ? "fg" + A : "surface" + A;
    if (desc.kind === "black") return "scrim" + A;
    const f = desc.fam;
    if (f === "neutral") {
      if (sh <= 50) return "canvas" + A;
      if (sh <= 200) return "surface-hover" + A;
      if (an != null) return "fg-muted" + A;
      if (sh <= 300) return "surface-hover";
      if (sh <= 500) return "fg-muted";
      if (sh <= 700) return "surface-hover";
      if (sh <= 800) return "surface";
      if (sh <= 900) return "code";
      return "canvas";
    }
    if (f === "brand") {
      if (an != null) return "primary" + A;
      if (sh <= 100) return "primary/10";
      if (sh <= 200) return "primary/20";
      if (sh >= 700) return "primary-hover";
      return "primary";
    }
    const m = { cyan: "accent", blue: "info", green: "success", red: "error", warm: "warning" }[f];
    if (m) { if (an == null && sh <= 100) return m + "/10"; if (an == null && sh <= 200) return m + "/20"; return m + A; }
  }

  /* BORDER-like */
  if (prop === "border" || prop === "ring" || prop === "divide" || prop === "outline") {
    const solidRing = prop === "ring";
    if (desc.kind === "white") return an != null && an <= 10 ? "line" : "line-strong";
    if (desc.kind === "black") return "line-strong";
    const f = desc.fam;
    if (f === "neutral") return interactive ? "line-strong" : sh <= 200 ? "line" : "line-strong";
    if (f === "brand") {
      if (solidRing) return "primary" + (A || "/50");
      if (an != null) {
        if (interactive) return an >= 25 ? "primary" + A : "line-strong";
        if (sh <= 300) return "line-strong";
        if (an <= 15) return "line";
        if (an <= 24) return "line-strong";
        return "primary" + A;
      }
      if (interactive) return "primary";
      return sh <= 300 ? "line-strong" : "primary";
    }
    const m = { cyan: "accent", blue: "info", green: "success", red: "error", warm: "warning" }[f];
    if (m) return m + (A || (sh <= 300 ? "/30" : ""));
  }

  /* GRADIENT STOPS */
  if (["from", "via", "to"].includes(prop)) {
    if (desc.kind === "white") return "primary-contrast" + A;
    if (desc.kind === "black") return "scrim" + A;
    const f = desc.fam;
    if (f === "neutral") return (sh <= 300 ? "surface-hover" : sh <= 600 ? "fg-muted" : sh <= 900 ? "surface" : "canvas") + A;
    if (f === "brand") return (desc.name === "indigo" ? "brand-indigo" : "brand-violet") + A;
    const m = { cyan: "brand-cyan", blue: "info", green: "success", red: "error", warm: "warning" }[f];
    if (m) return m + A;
  }

  /* SHADOW colour */
  if (prop === "shadow") {
    if (desc.kind === "white") return "primary-contrast" + A;
    if (desc.kind === "black") return "scrim" + A;
    const f = desc.fam;
    if (f === "neutral") return "scrim" + A;
    if (f === "brand") return "primary" + A;
    const m = { cyan: "accent", blue: "info", green: "success", red: "error", warm: "warning" }[f];
    if (m) return m + A;
  }
  return null;
}

function transformToken(tok, ctx) {
  let t = tok;
  let important = "";
  const { variants, util } = splitVariants(t);
  let u = util;
  if (u.startsWith("!")) { important = "!"; u = u.slice(1); }
  const m = u.match(UTIL_RE);
  if (!m) return { out: tok };
  let prop = m[1];
  const sideMatch = prop.match(/^border(-[trblxyse])$/);
  const side = sideMatch ? sideMatch[1] : "";
  if (sideMatch) prop = "border";
  const val = m[2];

  // arbitrary shadows etc. handled elsewhere (rgba rewrite); skip unrecognised values
  const vm = val.match(VALUE_RE);
  if (!vm) {
    if (/^(bg|text|border|from|via|to|ring|shadow|divide)$/.test(prop) && /#[0-9a-fA-F]{3,8}|rgba?\(/.test(val) && !/^\[.*(?:rgba?\(|#)/.test(val) === false) {
      // arbitrary compound value – leave to rgba rewrite / manual pass
    }
    return { out: tok };
  }
  const desc = { kind: "pal" };
  if (vm[1]) desc.kind = vm[1];
  else if (vm[2]) { desc.name = vm[2]; desc.fam = famOf(vm[2]); desc.shade = +vm[3]; }
  else { desc.kind = "arb"; const p = parseArbitrary(vm[4]); if (!p) return { out: tok }; desc.rgb = p.rgb; desc.a = p.a; }
  desc.alpha = vm[5] ? vm[5] : null;

  const sem = semantic(prop, variants, desc);
  if (!sem) { note(tok); return { out: tok }; }
  const outProp = prop === "border" ? "border" + side : prop;
  const out = [...variants, important + outProp + "-" + sem].join(":");
  return { out, prop: outProp, variants, mapped: true, sem };
}

/* ── run-level processing ── */
function processRun(run) {
  const parts = run.split(/([ \t]+)/);
  const toks = [];
  parts.forEach((p, i) => { if (i % 2 === 0 && p) toks.push({ raw: p }); });
  const hasClipText = toks.some((t) => t.raw === "bg-clip-text");
  let changed = false;

  // gradient-text special case
  if (hasClipText) {
    const kill = (r) => {
      const { util } = splitVariants(r);
      return /^(bg-gradient-to-\w+|from-.+|via-.+|to-.+)$/.test(util);
    };
    if (toks.some((t) => kill(t.raw) && /(from|via|to)-/.test(t.raw))) {
      let added = false;
      for (const t of toks) if (kill(t.raw)) { t.drop = true; changed = true; }
      toks.find((t) => t.raw === "bg-clip-text").raw = "text-gradient";
      // keep text-transparent harmlessly
      added = true;
    }
  }

  for (const t of toks) {
    if (t.drop) continue;
    const r = transformToken(t.raw);
    if (r.out !== t.raw) { t.raw = r.out; changed = true; }
    t.meta = r;
  }

  // drop `dark:` duplicates when a light twin (same prop & variants) exists
  const key = (variants, prop) => prop + "|" + variants.filter((v) => v !== "dark").sort().join(",");
  const light = new Map();
  for (const t of toks) if (!t.drop && t.meta?.mapped && !t.meta.variants.includes("dark")) light.set(key(t.meta.variants, t.meta.prop), true);
  for (const t of toks) {
    if (t.drop || !t.meta?.mapped) continue;
    if (t.meta.variants.includes("dark") && light.has(key(t.meta.variants, t.meta.prop))) { t.drop = true; changed = true; }
  }
  // de-duplicate identical tokens
  const seen = new Set();
  for (const t of toks) {
    if (t.drop) continue;
    if (t.meta?.mapped) { if (seen.has(t.raw)) { t.drop = true; changed = true; } else seen.add(t.raw); }
  }
  if (!changed) return run;

  // rebuild preserving original separators of kept tokens
  let out = "";
  let ti = 0;
  let pendingSep = "";
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) { pendingSep = parts[i]; continue; }
    if (!parts[i]) continue;
    const t = toks[ti++];
    if (t.drop) continue;
    out += (out ? pendingSep || " " : "") + t.raw;
  }
  return out;
}

/* ── rgba(...) literals → token channel vars (works in class arbitrary values and inline styles) ── */
const RGBA_MAP = [
  [[139, 92, 246], "primary"], [[124, 58, 237], "primary"], [[168, 85, 247], "primary"], [[167, 139, 250], "primary"],
  [[109, 40, 217], "primary"], [[124, 92, 255], "primary"], [[104, 71, 245], "primary"], [[91, 33, 182], "primary"],
  [[76, 29, 149], "primary"], [[46, 16, 101], "primary"],
  [[99, 102, 241], "brand-indigo"], [[79, 70, 229], "brand-indigo"],
  [[6, 182, 212], "accent"], [[34, 211, 238], "accent"], [[8, 145, 178], "accent"],
  [[236, 72, 153], "brand-violet"],
  [[0, 0, 0], "scrim"], [[255, 255, 255], "primary-contrast"],
  [[15, 20, 50], "surface"], [[13, 18, 48], "surface"], [[17, 24, 64], "surface-hover"], [[10, 15, 42], "surface"],
  [[13, 18, 54], "surface"], [[6, 9, 24], "bg"], [[12, 18, 45], "surface"], [[8, 13, 40], "surface"], [[15, 20, 48], "surface"],
  [[34, 197, 94], "success"], [[16, 185, 129], "success"], [[239, 68, 68], "error"], [[244, 63, 94], "error"],
  [[245, 158, 11], "warning"], [[251, 191, 36], "warning"], [[59, 130, 246], "info"],
];
function rewriteRgba(s) {
  return s.replace(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)/g, (full, r, g, b, a) => {
    const hit = RGBA_MAP.find(([[R, G, B]]) => R === +r && G === +g && B === +b);
    if (!hit) { note(full); return full; }
    return a != null ? `rgb(var(--${hit[1]}-rgb)/${a})` : `rgb(var(--${hit[1]}-rgb))`;
  });
}

function processFile(file) {
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  // 1) class runs
  src = src.replace(/[^\s"'`${}<>=]+(?:[ \t]+[^\s"'`${}<>=]+)*/g, (run) => {
    if (!/(bg|text|border|from|via|to|ring|shadow|divide|placeholder|fill|stroke|outline)-/.test(run)) return run;
    return processRun(run);
  });
  // 2) rgba literals
  src = rewriteRgba(src);
  if (src !== before) {
    if (!DRY) fs.writeFileSync(file, src);
    return true;
  }
  return false;
}

let n = 0;
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(jsx?|tsx?)$/.test(f.name)) { if (processFile(p)) n++; }
  }
};
walk(root);
console.log(`${DRY ? "[dry] " : ""}files changed: ${n}`);
const out = [...leftovers.entries()].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}\t${k}`).join("\n");
fs.writeFileSync("scripts/migrate-leftovers.txt", out);
console.log("unmapped entries:", leftovers.size);
