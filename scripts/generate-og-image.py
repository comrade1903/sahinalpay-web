#!/usr/bin/env python3
"""Regenerates public/og-image.png, the social-preview card.

Typographic only: the site's own palette and display face, no photograph —
the hero portrait is credited to expressioninterrupted.com and is not ours to
redistribute as a preview card.

One-off tool, not part of `npm run build`; the PNG it writes is committed.

Prerequisites (not repo dependencies):
    pip install Pillow
    Literata and Nunito Sans variable TTFs (SIL Open Font License 1.1), e.g.
      curl -L -o /tmp/literata.ttf \
        'https://github.com/google/fonts/raw/main/ofl/literata/Literata%5Bopsz%2Cwght%5D.ttf'
      curl -L -o /tmp/nunito.ttf \
        'https://github.com/google/fonts/raw/main/ofl/nunitosans/NunitoSans%5BYTLC%2Copsz%2Cwdth%2Cwght%5D.ttf'

Usage:
    python3 scripts/generate-og-image.py [--literata PATH] [--nunito PATH]
"""
import argparse
import pathlib
import sys

from PIL import Image, ImageDraw, ImageFont

# src/index.css primitives.
PAPER_50 = (225, 216, 233)
PAPER_0 = (245, 243, 247)
INK_900 = (26, 23, 28)
INK_500 = (87, 80, 93)
MARK_600 = (163, 43, 34)

WIDTH, HEIGHT = 1200, 630
MARGIN = 44
LEFT = MARGIN + 72

parser = argparse.ArgumentParser()
parser.add_argument("--literata", default="/tmp/literata.ttf")
parser.add_argument("--nunito", default="/tmp/nunito.ttf")
parser.add_argument(
    "--out",
    default=str(pathlib.Path(__file__).resolve().parent.parent / "public" / "og-image.png"),
)
args = parser.parse_args()

for label, font_path in (("Literata", args.literata), ("Nunito Sans", args.nunito)):
    if not pathlib.Path(font_path).is_file():
        sys.exit(f"{label} not found at {font_path} — see the header of this file.")


def variable(path, size, axes):
    font = ImageFont.truetype(path, size)
    try:
        font.set_variation_by_axes(axes)
    except Exception:  # noqa: BLE001 - a static build is an acceptable fallback
        pass
    return font


def literata(size, weight=400):
    return variable(args.literata, size, [12.0, float(weight)])  # opsz, wght


def nunito(size, weight=400):
    # axes: YTLC, opsz, wdth, wght
    return variable(args.nunito, size, [500.0, 12.0, 100.0, float(weight)])


def tracked(draw, xy, text, font, fill, tracking=0.0):
    """Draws text with letter-spacing, which .kicker uses on the site."""
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking


image = Image.new("RGB", (WIDTH, HEIGHT), PAPER_50)
draw = ImageDraw.Draw(image)

# The sheet lifted off the page — the site's --surface-raised card.
draw.rectangle([MARGIN, MARGIN, WIDTH - MARGIN, HEIGHT - MARGIN], fill=PAPER_0)

# The mark: the red rule that opens every .kicker.
draw.rectangle([LEFT, 150, LEFT + 96, 156], fill=MARK_600)

tracked(draw, (LEFT, 188), "ŞAHİN ALPAY", nunito(30, 700), INK_500, tracking=2.4)
draw.text((LEFT, 248), "Political Scientist,", font=literata(78, 700), fill=INK_900)
draw.text((LEFT, 338), "Author & Journalist", font=literata(78, 700), fill=INK_900)
draw.text(
    (LEFT, 456),
    "Kişisel ve siyasi arşiv  ·  A personal and political archive",
    font=nunito(28, 400),
    fill=INK_500,
)

image.save(args.out, "PNG", optimize=True)
print(f"Wrote {args.out} ({WIDTH}x{HEIGHT})")
