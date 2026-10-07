import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src");
const counts = new Map();
const walk = (d) => {
  for (const f of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, f.name);
    if (f.isDirectory()) walk(p);
    else if (/\.(jsx?|css)$/.test(f.name)) scan(p);
  }
};
const re =
  /(?:[\w-]+:)*(?:bg|text|border|from|via|to|ring|shadow|fill|stroke|divide|placeholder|outline|decoration|accent|caret)-(?:\[[^\]\s]+\]|(?:slate|gray|zinc|neutral|stone|violet|purple|indigo|cyan|sky|blue|emerald|green|rose|red|pink|amber|yellow|orange|teal|fuchsia|lime|white|black)(?:-\d{2,3})?(?:\/\[?[\d.]+\]?)?)/g;
const scan = (p) => {
  const s = fs.readFileSync(p, "utf8");
  for (const m of s.matchAll(re)) counts.set(m[0], (counts.get(m[0]) || 0) + 1);
};
walk(root);
const out = [...counts.entries()].sort((a, b) => b[1] - a[1]);
fs.writeFileSync("scripts/audit-out.txt", out.map(([k, v]) => `${v}\t${k}`).join("\n"));
console.log("distinct:", out.length);
