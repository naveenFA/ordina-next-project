#!/usr/bin/env python3
"""Download homepage images from framerusercontent.com."""

from __future__ import annotations

import re
import urllib.parse
import urllib.request
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "public" / "assets" / "home"
MJS_URL = (
    "https://framerusercontent.com/sites/xDaHWZrVDlmJjknlY42X3/"
    "Bn7pEsehLFSizysI9xnmiR4U1aYkycVNDk1R16rQxF4.CTMOS3fU.mjs"
)

ASSETS: dict[str, str] = {
    "hero-unlock-workflows.jpg": "https://framerusercontent.com/images/AMwgF9Crfb6QMJYduglXzstULM.jpg?width=1200&height=679",
    "hero-quote-card.jpg": "https://framerusercontent.com/images/HIHdQmn1RGqhhRkeXgj2Fd8.jpg?width=2000&height=1400",
    "feature-workspaces.png": "https://framerusercontent.com/images/cj8XBv7mKAz6boSmBNZrFqCX0c.png?width=696&height=476",
    "feature-collaboration.png": "https://framerusercontent.com/images/aqftJPaNWobVL52koqIgdZXmJM.png?width=632&height=416",
    "feature-automation.png": "https://framerusercontent.com/images/kbuDsez6EtsCPkRp6mvYkGOHjyk.png?width=632&height=416",
    "feature-tagging.png": "https://framerusercontent.com/images/KSuPfMvC8uaoRETernQxLVWYo.png?width=688&height=424",
    "workflow-bg.jpg": "https://framerusercontent.com/images/HIHdQmn1RGqhhRkeXgj2Fd8.jpg?width=2000&height=1400",
    "workflow-screenshot.jpg": "https://framerusercontent.com/images/T35gweFjEteJieIVRMRGDFplw0.jpg?width=1507&height=2000",
    "logo-strip.png": "https://framerusercontent.com/images/6xj4hfY9fYiK6R77v6XYhCiT4XY.png?width=656&height=202",
    "avatar-daniel.png": "https://framerusercontent.com/images/Ct50uJMBz4qAbAESZeOrSeHZJKg.png?width=80&height=80",
    "avatar-liam.png": "https://framerusercontent.com/images/JfqA0cJ23tke9gwM45p66KhVPE.png?width=80&height=80",
    "avatar-sofia.png": "https://framerusercontent.com/images/PY5YgbTN3btUisTEFHMyKuDxw.png?width=80&height=80",
    "blog-featured.jpg": "https://framerusercontent.com/images/x0Jjzj0DUxwnhBH4CWI8nJyeBAw.jpg?width=1200&height=1200",
    "blog-1.jpg": "https://framerusercontent.com/images/zUfHlL2LXUXkV7tT7LdHuKAXJd8.jpg?width=2000&height=1333",
    "blog-2.jpg": "https://framerusercontent.com/images/FztDg01PbwZEE9muThllzfKyiM.jpg?width=1200&height=715",
    "blog-3.jpg": "https://framerusercontent.com/images/AMwgF9Crfb6QMJYduglXzstULM.jpg?width=1200&height=679",
    "cta-bg.jpg": "https://framerusercontent.com/images/CHsWpnCBrcqHs2T4uqmomqptpc.jpg?width=1800&height=1019",
    "bridge-dot-pattern.png": "https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png",
    "bridge-widget-1.png": "https://framerusercontent.com/images/EowUp1Qeaxe3M6OF0Uy6sRSK9w.png?width=440&height=360",
    "bridge-widget-2.png": "https://framerusercontent.com/images/cj8XBv7mKAz6boSmBNZrFqCX0c.png?width=696&height=476",
    "bridge-widget-5.png": "https://framerusercontent.com/images/L83fLuFHMrruQTIATHSQTdEfs.png?width=440&height=440",
    "bridge-widget-6.png": "https://framerusercontent.com/images/hrQuAArXUd98E9B4VL821vff0.png?width=440&height=360",
    "bridge-widget-8.png": "https://framerusercontent.com/images/DwfnmfD2OV6WEObBxpczeBR0EA.png?width=452&height=196",
    "bridge-widget-11.png": "https://framerusercontent.com/images/QI1evdbe2y1wld0xcyE5DSHAA.png?width=440&height=360",
    "bridge-widget-3.png": "https://framerusercontent.com/images/aqftJPaNWobVL52koqIgdZXmJM.png?width=632&height=416",
    "bridge-widget-4.png": "https://framerusercontent.com/images/DtqwDOMQ7HQWkxFEDvMDS4CDu8.png?width=672&height=144",
    "bridge-widget-7.png": "https://framerusercontent.com/images/kbuDsez6EtsCPkRp6mvYkGOHjyk.png?width=632&height=416",
    "bridge-widget-9.png": "https://framerusercontent.com/images/KSuPfMvC8uaoRETernQxLVWYo.png?width=688&height=424",
    "bridge-widget-10.png": "https://framerusercontent.com/images/6xj4hfY9fYiK6R77v6XYhCiT4XY.png?width=656&height=202",
    "bridge-widget-12.png": "https://framerusercontent.com/images/UTqro9Gu1I2KCfWcqoRjjLs3eI.png?width=636&height=136",
    "bridge-widget-13.png": "https://framerusercontent.com/images/1aEFBzPWj7jJfFf24QLQ85PajA.png?width=672&height=454",
    "bridge-widget-14.jpg": "https://framerusercontent.com/images/lTK6Fqv6er0WyICsZKInHPqJ4.jpg?width=636&height=136",
    "bridge-widget-15.png": "https://framerusercontent.com/images/1p2D9gx107o4gonq8IExvlShA8.png?width=688&height=316",
    "testimonial-daniel.jpg": "https://framerusercontent.com/images/kmie4WXDJ4m1XBfKYqIo8AKvzE.jpg?width=840&height=1200",
    "testimonial-liam.jpg": "https://framerusercontent.com/images/eswOc5NMKv15gFLDITCiyll5OOk.jpg?width=904&height=1200",
    "testimonial-sofia.jpg": "https://framerusercontent.com/images/9VmngxnjWgx7dbM9TTyrhidUrQ.jpg?width=840&height=1200",
    "impact-0.jpg": "https://framerusercontent.com/images/FztDg01PbwZEE9muThllzfKyiM.jpg?width=840&height=1200",
    "impact-1.jpg": "https://framerusercontent.com/images/g8IUmUUgthDQIiabJ3fOofINwA.jpg?width=840&height=1200",
    "impact-2.jpg": "https://framerusercontent.com/images/8G51URioIUTlkPHBbJRKhGRPLc.jpg?width=840&height=1200",
    "impact-3.jpg": "https://framerusercontent.com/images/eswOc5NMKv15gFLDITCiyll5OOk.jpg?width=904&height=1200",
    "impact-4.jpg": "https://framerusercontent.com/images/x0Jjzj0DUxwnhBH4CWI8nJyeBAw.jpg?width=840&height=1200",
    "impact-5.jpg": "https://framerusercontent.com/images/TSPhVjvTnyfG9Gc6vp73XqSqp8.jpg?width=840&height=1200",
    "impact-6.jpg": "https://framerusercontent.com/images/KjaGXILAh51axFNjL1p3WOzvkY.jpg?width=840&height=1200",
    "impact-7.jpg": "https://framerusercontent.com/images/9VmngxnjWgx7dbM9TTyrhidUrQ.jpg?width=840&height=1200",
    "impact-8.jpg": "https://framerusercontent.com/images/zUfHlL2LXUXkV7tT7LdHuKAXJd8.jpg?width=840&height=1200",
    "impact-9.jpg": "https://framerusercontent.com/images/kmie4WXDJ4m1XBfKYqIo8AKvzE.jpg?width=840&height=1200",
}

FRAMER_BASE = "https://framerusercontent.com/sites/xDaHWZrVDlmJjknlY42X3/"
# Hero logo ticker order from Framer: Pt, At, Ft, Tt, Lt, Gt, Nt, Ut
HERO_LOGO_CHUNKS = [
    (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", "sym-132"),
    (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", "sym-120"),
    (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 3),
    (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", 0),
    (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 2),
    (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 0),
    (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", 1),
    (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 1),
]

LOGO_CHUNKS = {
    "impact-logo-gt.svg": (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 0),
    "impact-logo-ut.svg": (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 1),
    "impact-logo-lt.svg": (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 2),
    "impact-logo-ft.svg": (f"{FRAMER_BASE}I3AQgzggj.BlSPrpqF.mjs", 3),
    "impact-logo-nt.svg": (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", 1),
    "impact-logo-tt.svg": (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", 0),
    "impact-logo-at.svg": (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", "sym-120"),
    "impact-logo-pt.svg": (f"{FRAMER_BASE}geHywu1kQ.DkPocy9h.mjs", "sym-132"),
    "impact-logo-tn.svg": (f"{FRAMER_BASE}SYZ6OvniY.A0M7LynT.mjs", 0),
    "impact-logo-an.svg": (f"{FRAMER_BASE}SYZ6OvniY.A0M7LynT.mjs", 1),
}


def download(name: str, url: str) -> None:
    dest = OUT / name
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": "ordina-asset-sync/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        dest.write_bytes(resp.read())
    print(f"  {name}")


def _fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "ordina-asset-sync/1.0"})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read().decode("utf-8", errors="replace")


def _mask_svgs(mjs: str) -> list[str]:
    matches = re.findall(r"url\('(data:image/svg\+xml,.*?)'\)", mjs)
    return [urllib.parse.unquote(m.split(",", 1)[1]) for m in matches]


def _inline_svgs(mjs: str) -> dict[str, str]:
    found: dict[str, str] = {}
    for m in re.finditer(
        r'`<svg display="block" role="presentation" viewBox="0 0 (\d+) (\d+)"[^`]+`',
        mjs,
    ):
        key = f"sym-{m.group(1)}"
        found[key] = m.group(0)[1:-1]
    return found


def _hero_logo_svg(svg: str) -> str:
    svg = re.sub(
        r'fill="var\([^"]+\)"',
        'fill="rgba(255,255,255,0.7)"',
        svg,
    )
    svg = re.sub(
        r'stroke="var\([^"]+\)"',
        'stroke="rgba(255,255,255,0.7)"',
        svg,
    )
    return svg


def extract_hero_logos() -> None:
    cache: dict[str, str] = {}
    for idx, (url, index) in enumerate(HERO_LOGO_CHUNKS):
        if url not in cache:
            cache[url] = _fetch(url)
        mjs = cache[url]
        if isinstance(index, str):
            svg = _inline_svgs(mjs)[index]
        else:
            svg = _mask_svgs(mjs)[index]
        dest = OUT / f"hero-logo-{idx}.svg"
        dest.write_text(_hero_logo_svg(svg), encoding="utf-8")
        print(f"  {dest.name}")


def extract_impact_logos() -> None:
    cache: dict[str, str] = {}
    for filename, (url, index) in LOGO_CHUNKS.items():
        if url not in cache:
            cache[url] = _fetch(url)
        mjs = cache[url]
        if isinstance(index, str):
            svg = _inline_svgs(mjs)[index]
        else:
            svg = _mask_svgs(mjs)[index]
        dest = OUT / filename
        dest.write_text(svg, encoding="utf-8")
        print(f"  {filename}")


def extract_integration_svgs(mjs: str) -> None:
    seen: set[str] = set()
    idx = 0
    for m in re.finditer(r"src:`data:image/svg\+xml,(<svg[^`]+)`", mjs):
        svg_encoded = m.group(1)
        if svg_encoded in seen:
            continue
        seen.add(svg_encoded)
        svg = urllib.parse.unquote(svg_encoded)
        (OUT / f"integration-{idx}.svg").write_text(svg, encoding="utf-8")
        print(f"  integration-{idx}.svg")
        idx += 1


def main() -> None:
    print(f"Downloading to {OUT}")
    for name, url in ASSETS.items():
        download(name, url)

    print("Extracting integration SVGs from Framer module…")
    mjs = _fetch(MJS_URL)
    extract_integration_svgs(mjs)

    print("Extracting hero logo ticker SVGs from Framer modules…")
    extract_hero_logos()

    print("Extracting impact company logos from Framer modules…")
    extract_impact_logos()
    print("Done.")


if __name__ == "__main__":
    main()
