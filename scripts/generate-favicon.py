#!/usr/bin/env python3
"""Builds public/favicon.svg: the wordmark's Ş on the masthead plate.

The site shipped Vite's default lightning bolt until 2026-09-22. What belongs
in a browser tab here is what sits in the header: the first letter of his name,
set in the same face as the wordmark (Literata, weight 800, optical size 72) on
the same fixed light plate the masthead is printed on. A tab strip is 16px, so
the mark has to survive at that size — one letter does, a portrait or a stack of
newspapers does not.

The glyph is written out as a path rather than as <text>: an SVG favicon gets no
web fonts, so a font-family would fall back to whatever serif the machine has.

One-off tool, not part of `npm run build`; the SVG it writes is committed.

    python3 scripts/generate-favicon.py
"""

from pathlib import Path

from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
FONT = ROOT / "public" / "fonts" / "literata-latin-ext.woff2"
OUT = ROOT / "public" / "favicon.svg"

LETTER = "Ş"
WEIGHT = 800  # .wordmark's font-weight
OPTICAL_SIZE = 72  # display end of Literata's opsz axis

PLATE = "#f5f3f7"  # --masthead-plate: the paper the logo is printed on
INK = "#1a171c"  # --ink-900

TILE = 32.0
RADIUS = 7.0
# Share of the tile the glyph's own bounding box fills. Chosen by comparing
# renderings at 16px: below ~0.7 the letter turns into a speck adrift on the
# plate, above ~0.8 the cedilla crowds the corner.
FILL = 0.76


def glyph_path() -> tuple[str, tuple[float, float, float, float]]:
    font = TTFont(FONT)
    font = instancer.instantiateVariableFont(
        font, {"wght": WEIGHT, "opsz": OPTICAL_SIZE}, inplace=True
    )
    name = font.getBestCmap()[ord(LETTER)]
    glyphs = font.getGlyphSet()
    pen = SVGPathPen(glyphs)
    glyphs[name].draw(pen)
    bounds = font["glyf"][name] if "glyf" in font else None
    box = (bounds.xMin, bounds.yMin, bounds.xMax, bounds.yMax)
    return pen.getCommands(), box


def main() -> None:
    path, (x_min, y_min, x_max, y_max) = glyph_path()
    width = x_max - x_min
    height = y_max - y_min
    scale = TILE * FILL / max(width, height)
    # Font units run upwards, SVG units downwards, so the glyph is flipped and
    # then centred on its own box — cedilla included, or the letter would sit
    # high on the plate.
    dx = TILE / 2 - (x_min + width / 2) * scale
    dy = TILE / 2 + (y_min + height / 2) * scale

    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {TILE:.0f} {TILE:.0f}">
  <title>Şahin Alpay</title>
  <rect width="{TILE:.0f}" height="{TILE:.0f}" rx="{RADIUS:.0f}" fill="{PLATE}"/>
  <path transform="translate({dx:.3f} {dy:.3f}) scale({scale:.5f} {-scale:.5f})" fill="{INK}" d="{path}"/>
</svg>
"""
    OUT.write_text(svg, encoding="utf-8")
    print(f"Wrote {OUT.relative_to(ROOT)} ({len(svg)} bytes)")


if __name__ == "__main__":
    main()
