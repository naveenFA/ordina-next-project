#!/usr/bin/env node
/**
 * Capture full-page homepage screenshots (Framer vs local),
 * stitch side-by-side, and produce a pixel diff heatmap.
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

async function capture(page, url, name) {
  await page.setViewportSize(VIEWPORT);
  await page.goto(url, { waitUntil: "networkidle", timeout: 120_000 });
  await page.waitForTimeout(2000);
  const path = join(OUT, `${name}-full.png`);
  await page.screenshot({ path, fullPage: true });
  console.log(`Captured ${name}: ${path}`);
  return path;
}

function loadPng(path) {
  return PNG.sync.read(readFileSync(path));
}

function writePng(path, png) {
  writeFileSync(path, PNG.sync.write(png));
}

function stitchHorizontal(left, right, labelLeft, labelRight) {
  const gap = 4;
  const labelH = 40;
  const w = left.width + gap + right.width;
  const h = Math.max(left.height, right.height) + labelH;
  const out = new PNG({ width: w, height: h });

  // white background
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2;
      out.data[i] = 255;
      out.data[i + 1] = 255;
      out.data[i + 2] = 255;
      out.data[i + 3] = 255;
    }
  }

  // label bars
  const barColor = [1, 40, 60]; // navy
  for (let y = 0; y < labelH; y++) {
    for (let x = 0; x < w; x++) {
      const i = (w * y + x) << 2;
      out.data[i] = barColor[0];
      out.data[i + 1] = barColor[1];
      out.data[i + 2] = barColor[2];
      out.data[i + 3] = 255;
    }
  }

  blit(out, left, 0, labelH);
  blit(out, right, left.width + gap, labelH);

  return out;
}

function blit(dest, src, dx, dy) {
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      const sx = x;
      const sy = y;
      const dx2 = dx + x;
      const dy2 = dy + y;
      if (dx2 >= dest.width || dy2 >= dest.height) continue;
      const si = (src.width * sy + sx) << 2;
      const di = (dest.width * dy2 + dx2) << 2;
      dest.data[di] = src.data[si];
      dest.data[di + 1] = src.data[si + 1];
      dest.data[di + 2] = src.data[si + 2];
      dest.data[di + 3] = src.data[si + 3];
    }
  }
}

function cropToHeight(img, height) {
  if (img.height <= height) return img;
  const out = new PNG({ width: img.width, height });
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < img.width; x++) {
      const si = (img.width * y + x) << 2;
      const di = (out.width * y + x) << 2;
      out.data[di] = img.data[si];
      out.data[di + 1] = img.data[si + 1];
      out.data[di + 2] = img.data[si + 2];
      out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

function resizeToWidth(img, targetW) {
  if (img.width === targetW) return img;
  const scale = targetW / img.width;
  const targetH = Math.round(img.height * scale);
  const out = new PNG({ width: targetW, height: targetH });
  for (let y = 0; y < targetH; y++) {
    for (let x = 0; x < targetW; x++) {
      const sx = Math.min(img.width - 1, Math.round(x / scale));
      const sy = Math.min(img.height - 1, Math.round(y / scale));
      const si = (img.width * sy + sx) << 2;
      const di = (out.width * y + x) << 2;
      out.data[di] = img.data[si];
      out.data[di + 1] = img.data[si + 1];
      out.data[di + 2] = img.data[si + 2];
      out.data[di + 3] = img.data[si + 3];
    }
  }
  return out;
}

function diffImages(a, b) {
  const w = Math.min(a.width, b.width);
  const ah = resizeToWidth(a, w);
  const bh = resizeToWidth(b, w);
  const h = Math.min(ah.height, bh.height);
  const ca = cropToHeight(ah, h);
  const cb = cropToHeight(bh, h);
  const diff = new PNG({ width: w, height: h });
  const mismatched = pixelmatch(ca.data, cb.data, diff.data, w, h, {
    threshold: 0.1,
    includeAA: false,
  });
  return { diff, mismatched, total: w * h, width: w, height: h, ca, cb };
}

function stitchSections(sections, cols = 2) {
  const maxW = Math.max(...sections.map((s) => s.width));
  const normalized = sections.map((s) => resizeToWidth(s, maxW));
  const rows = [];
  for (let i = 0; i < normalized.length; i += cols) {
    rows.push(normalized.slice(i, i + cols));
  }
  const gap = 8;
  const rowH = rows.map((r) => Math.max(...r.map((s) => s.height)));
  const totalH = rowH.reduce((a, b) => a + b, 0) + gap * (rows.length - 1);
  const totalW = maxW * cols + gap * (cols - 1);
  const out = new PNG({ width: totalW, height: totalH });
  for (let y = 0; y < totalH; y++) {
    for (let x = 0; x < totalW; x++) {
      const i = (totalW * y + x) << 2;
      out.data[i] = 240;
      out.data[i + 1] = 240;
      out.data[i + 2] = 240;
      out.data[i + 3] = 255;
    }
  }
  let yOff = 0;
  for (let r = 0; r < rows.length; r++) {
    let xOff = 0;
    for (const s of rows[r]) {
      blit(out, s, xOff, yOff);
      xOff += maxW + gap;
    }
    yOff += rowH[r] + gap;
  }
  return out;
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const framerPath = await capture(page, URLS.framer, "framer");
  const localPath = await capture(page, URLS.local, "local");
  await browser.close();

  const framer = loadPng(framerPath);
  const local = loadPng(localPath);

  // Side-by-side full pages (same width)
  const targetW = 720;
  const framerR = resizeToWidth(framer, targetW);
  const localR = resizeToWidth(local, targetW);
  const stitched = stitchHorizontal(framerR, localR, "Framer", "Local");
  const stitchedPath = join(OUT, "stitched-full.png");
  writePng(stitchedPath, stitched);
  console.log(`Stitched: ${stitchedPath}`);

  // Pixel diff on aligned viewport-height slices
  const sliceH = 900;
  const slices = [];
  const diffReport = [];
  const maxSlices = Math.ceil(Math.max(framerR.height, localR.height) / sliceH);

  for (let i = 0; i < maxSlices; i++) {
    const y = i * sliceH;
    const extract = (img) => {
      const h = Math.min(sliceH, img.height - y);
      if (h <= 0) return null;
      const out = new PNG({ width: img.width, height: h });
      for (let row = 0; row < h; row++) {
        for (let x = 0; x < img.width; x++) {
          const si = (img.width * (y + row) + x) << 2;
          const di = (out.width * row + x) << 2;
          out.data[di] = img.data[si];
          out.data[di + 1] = img.data[si + 1];
          out.data[di + 2] = img.data[si + 2];
          out.data[di + 3] = img.data[si + 3];
        }
      }
      return out;
    };
    const fa = extract(framerR);
    const la = extract(localR);
    if (!fa || !la) continue;
    const { diff, mismatched, total, ca, cb } = diffImages(fa, la);
    const pct = ((mismatched / total) * 100).toFixed(1);
    diffReport.push({ slice: i, y, pct: parseFloat(pct), mismatched, total });
    slices.push(ca, cb, diff);
  }

  const slicesPath = join(OUT, "stitched-slices.png");
  writePng(slicesPath, stitchSections(slices, 3));
  console.log(`Slice comparison: ${slicesPath}`);

  const reportPath = join(OUT, "diff-report.json");
  writeFileSync(reportPath, JSON.stringify({ viewport: VIEWPORT, slices: diffReport }, null, 2));
  console.log(`Report: ${reportPath}`);

  console.log("\n=== Per-section diff (top → bottom) ===");
  for (const s of diffReport) {
    const bar = "█".repeat(Math.round(s.pct / 5)) + "░".repeat(20 - Math.round(s.pct / 5));
    console.log(`  y=${String(s.y).padStart(5)}px  ${String(s.pct).padStart(5)}%  ${bar}`);
  }
  const avg = diffReport.reduce((a, s) => a + s.pct, 0) / diffReport.length;
  console.log(`\nAverage pixel mismatch: ${avg.toFixed(1)}%`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
