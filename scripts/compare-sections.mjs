#!/usr/bin/env node
/**
 * Section-aligned homepage comparison: match h2 headings on both sites,
 * capture viewport screenshots per section, stitch + diff.
 */
import { chromium } from "playwright";
import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "tmp-compare");
mkdirSync(OUT, { recursive: true });

const VIEWPORT = { width: 1440, height: 900 };
const URLS = {
  framer: "https://ordina.framer.website/",
  local: process.env.LOCAL_URL ?? "http://localhost:3000/",
};

async function getSectionAnchors(page) {
  return page.evaluate(() => {
    const headings = [...document.querySelectorAll("h2")].map((el) => ({
      text: el.textContent?.trim().replace(/\s+/g, " ") ?? "",
      y: Math.round(el.getBoundingClientRect().top + window.scrollY),
    }));
    return headings.filter((h) => h.text.length > 10);
  });
}

async function captureAtScroll(page, y, name) {
  await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
  await page.waitForTimeout(400);
  const path = join(OUT, name);
  await page.screenshot({ path, fullPage: false });
  return path;
}

function loadPng(path) {
  return PNG.sync.read(readFileSync(path));
}

function writePng(path, png) {
  writeFileSync(path, PNG.sync.write(png));
}

function blit(dest, src, dx, dy) {
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const dx2 = dx + x;
      const dy2 = dy + y;
      if (dx2 >= dest.width || dy2 >= dest.height) continue;
      const si = (src.width * y + x) << 2;
      const di = (dest.width * dy2 + dx2) << 2;
      dest.data[di] = src.data[si];
      dest.data[di + 1] = src.data[si + 1];
      dest.data[di + 2] = src.data[si + 2];
      dest.data[di + 3] = src.data[si + 3];
    }
  }
}

function stitchRow(images, labels) {
  const gap = 4;
  const labelH = 28;
  const w = images.reduce((a, img) => a + img.width, gap * (images.length - 1));
  const h = Math.max(...images.map((i) => i.height)) + labelH;
  const out = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2;
      out.data[i] = 30;
      out.data[i + 1] = 30;
      out.data[i + 2] = 30;
      out.data[i + 3] = 255;
    }
  }
  let xOff = 0;
  for (const img of images) {
    blit(out, img, xOff, labelH);
    xOff += img.width + gap;
  }
  return out;
}

function diffPair(a, b) {
  const w = Math.min(a.width, b.width);
  const h = Math.min(a.height, b.height);
  const ca = new PNG({ width: w, height: h });
  const cb = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      for (const [src, dst] of [
        [a, ca],
        [b, cb],
      ]) {
        const si = (src.width * y + x) << 2;
        const di = (dst.width * y + x) << 2;
        dst.data[di] = src.data[si];
        dst.data[di + 1] = src.data[si + 1];
        dst.data[di + 2] = src.data[si + 2];
        dst.data[di + 3] = src.data[si + 3];
      }
    }
  }
  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(ca.data, cb.data, diff.data, w, h, {
    threshold: 0.12,
    includeAA: false,
  });
  return { ca, cb, diff, pct: +((mismatched / (w * h)) * 100).toFixed(1) };
}

function stitchVertical(rows) {
  const gap = 6;
  const w = Math.max(...rows.map((r) => r.width));
  const totalH = rows.reduce((a, r) => a + r.height, 0) + gap * (rows.length - 1);
  const out = new PNG({ width: w, height: totalH });
  for (let y = 0; y < totalH; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2;
      out.data[i] = 245;
      out.data[i + 1] = 245;
      out.data[i + 2] = 245;
      out.data[i + 3] = 255;
    }
  }
  let yOff = 0;
  for (const row of rows) {
    blit(out, row, 0, yOff);
    yOff += row.height + gap;
  }
  return out;
}

function normalizeText(t) {
  return t.toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();
}

async function main() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: VIEWPORT });
  const framerPage = await ctx.newPage();
  const localPage = await ctx.newPage();

  await framerPage.goto(URLS.framer, { waitUntil: "networkidle", timeout: 120_000 });
  await localPage.goto(URLS.local, { waitUntil: "networkidle", timeout: 120_000 });
  await framerPage.waitForTimeout(2000);
  await localPage.waitForTimeout(2000);

  const framerH2 = await getSectionAnchors(framerPage);
  const localH2 = await getSectionAnchors(localPage);

  console.log("\nFramer h2 sections:", framerH2.length);
  framerH2.forEach((h) => console.log(`  y=${h.y}  ${h.text.slice(0, 60)}`));
  console.log("\nLocal h2 sections:", localH2.length);
  localH2.forEach((h) => console.log(`  y=${h.y}  ${h.text.slice(0, 60)}`));

  const pairs = [];
  for (const fh of framerH2) {
    const fn = normalizeText(fh.text);
    const match = localH2.find((lh) => normalizeText(lh.text) === fn);
    if (match) pairs.push({ text: fh.text, framerY: fh.y, localY: match.y });
  }

  // Hero (before first h2)
  pairs.unshift({
    text: "Hero",
    framerY: 0,
    localY: 0,
  });

  const report = [];
  const sectionRows = [];

  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i];
    const slug = p.text.slice(0, 30).replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    const fPath = await captureAtScroll(framerPage, Math.max(0, p.framerY - 80), `sec-${i}-framer-${slug}.png`);
    const lPath = await captureAtScroll(localPage, Math.max(0, p.localY - 80), `sec-${i}-local-${slug}.png`);
    const fImg = loadPng(fPath);
    const lImg = loadPng(lPath);
    const { ca, cb, diff, pct } = diffPair(fImg, lImg);
    report.push({ section: p.text, framerY: p.framerY, localY: p.localY, mismatchPct: pct });
    sectionRows.push(stitchRow([ca, cb, diff], ["Framer", "Local", "Diff"]));
    console.log(`  [${String(pct).padStart(5)}%] ${p.text.slice(0, 55)}`);
  }

  const stitchedSections = stitchVertical(sectionRows);
  writePng(join(OUT, "stitched-by-section.png"), stitchedSections);

  writeFileSync(
    join(OUT, "section-diff-report.json"),
    JSON.stringify({ viewport: VIEWPORT, pageHeights: { framer: framerH2.at(-1)?.y, local: localH2.at(-1)?.y }, sections: report }, null, 2),
  );

  await browser.close();

  const avg = report.reduce((a, s) => a + s.mismatchPct, 0) / report.length;
  console.log(`\nSection-aligned average mismatch: ${avg.toFixed(1)}%`);
  console.log(`Output: ${join(OUT, "stitched-by-section.png")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
