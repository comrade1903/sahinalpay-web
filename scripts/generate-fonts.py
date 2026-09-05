#!/usr/bin/env python3
"""Builds the self-hosted web fonts in public/fonts/.

The site used to load Literata, Nunito Sans and Material Symbols from
fonts.googleapis.com, which meant every visitor's IP and User-Agent reached a
third party on every page view, and the Content-Security-Policy had to allow
two external origins. Serving the same faces from our own origin removes both.

Licences permit it: Literata and Nunito Sans are under the SIL Open Font
License 1.1, Material Symbols under Apache 2.0. See public/fonts/LICENSES.md.

One-off tool, not part of `npm run build`; the woff2 files it writes are
committed. `npm run validate:content` checks that every icon the app uses is
in ICONS below, so a new icon cannot silently render as a blank box.

Prerequisites (not repo dependencies):
    pip install 'fonttools[woff]' brotli
    the upstream variable fonts, e.g.
      curl -L -o /tmp/fonts/literata.ttf \
        'https://github.com/google/fonts/raw/main/ofl/literata/Literata%5Bopsz%2Cwght%5D.ttf'
      curl -L -o /tmp/fonts/literata-italic.ttf \
        'https://github.com/google/fonts/raw/main/ofl/literata/Literata-Italic%5Bopsz%2Cwght%5D.ttf'
      curl -L -o /tmp/fonts/nunito.ttf \
        'https://github.com/google/fonts/raw/main/ofl/nunitosans/NunitoSans%5BYTLC%2Copsz%2Cwdth%2Cwght%5D.ttf'
      curl -L -o /tmp/fonts/material.ttf \
        'https://github.com/google/material-design-icons/raw/master/variablefont/MaterialSymbolsOutlined%5BFILL%2CGRAD%2Copsz%2Cwght%5D.ttf'

Usage:
    python3 scripts/generate-fonts.py --src /tmp/fonts
"""
import argparse
import json
import pathlib
import subprocess
import sys

from fontTools.ttLib import TTFont

# Google's own latin + latin-ext ranges, which is what this site needs:
# Turkish (ğ Ğ ı İ ş Ş), the typographic quotes and dashes the archive text
# uses, and the currency and arrow marks in the UI.
LATIN = (
    "U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,"
    "U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,"
    "U+FEFF,U+FFFD"
)
LATIN_EXT = (
    "U+0100-02BA,U+02BD-02C5,U+02C7-02CC,U+02CE-02D7,U+02DD-02FF,U+0304,U+0308,"
    "U+0329,U+1D00-1DBF,U+1E00-1E9F,U+1EF2-1EFF,U+2020,U+20A0-20AB,U+20AD-20C0,"
    "U+2113,U+2C60-2C7F,U+A720-A7FF"
)

# Every Material Symbols ligature the app renders. Kept in sync with the app
# by scripts/validate-content.mjs, which fails on an icon that is not here.
ICONS = [
    "analytics",
    "arrow_back",
    "arrow_forward",
    "article",
    "close",
    "cookie",
    "flag",
    "format_quote",
    "forum",
    "home",
    "link",
    "menu",
    "menu_book",
    "person",
    "picture_as_pdf",
    "school",
    "search",
    "text_decrease",
    "text_increase",
    "timeline",
    "tune",
    "update",
    "warning",
    "zoom_in",
]

# Only the features this site's typography actually uses. `*` keeps every
# OpenType table and roughly doubles each file.
FEATURES = "kern,liga,clig,ccmp,mark,mkmk,locl,calt,onum,lnum"

RANGES = {"latin": LATIN, "latin-ext": LATIN_EXT}

parser = argparse.ArgumentParser()
parser.add_argument("--src", default="/tmp/fonts", help="directory holding the upstream TTFs")
parser.add_argument(
    "--out",
    default=str(pathlib.Path(__file__).resolve().parent.parent / "public" / "fonts"),
)
args = parser.parse_args()

src = pathlib.Path(args.src)
out = pathlib.Path(args.out)
out.mkdir(parents=True, exist_ok=True)


def subset(source, target, *extra):
    path = source if isinstance(source, pathlib.Path) else src / source
    if not path.is_file():
        sys.exit(f"{path} not found — see the header of this file.")
    subprocess.run(
        [
            sys.executable,
            "-m",
            "fontTools.subset",
            str(path),
            "--flavor=woff2",
            f"--output-file={out / target}",
            *extra,
        ],
        check=True,
    )
    return (out / target).stat().st_size


written = {}


def instance(source, target, **axes):
    """Pins variable axes the design never varies, before subsetting."""
    path = src / source
    if not path.is_file():
        sys.exit(f"{path} not found — see the header of this file.")
    subprocess.run(
        [
            sys.executable,
            "-m",
            "fontTools.varLib.instancer",
            str(path),
            *[f"{axis}={value}" for axis, value in axes.items()],
            "-o",
            str(target),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    return target


work = out / ".build"
work.mkdir(exist_ok=True)

# Nunito Sans ships four axes; the design varies only weight. Pinning the
# other three cuts each slice by roughly three quarters. Literata keeps its
# optical-size axis, which the browser applies automatically and which is
# visible across this site's range from 0.85rem labels to display headings.
nunito_wght = instance("nunito.ttf", work / "nunito-wght.ttf", YTLC=500, opsz=12, wdth=100)

faces = [
    ("literata.ttf", "literata"),
    ("literata-italic.ttf", "literata-italic"),
    (nunito_wght, "nunito-sans"),
]

for source, stem in faces:
    for range_name, unicodes in RANGES.items():
        written[f"{stem}-{range_name}.woff2"] = subset(
            source,
            f"{stem}-{range_name}.woff2",
            f"--unicodes={unicodes}",
            f"--layout-features={FEATURES}",
            "--drop-tables+=DSIG",
        )

def prune_ligatures(source, target, names):
    """Keeps only the ligature rules that produce the icons we render.

    The icon font is ligature-driven: the element's text ("arrow_forward")
    is substituted for a single glyph. Subsetting it naively does not work.
    Ask for the 24 icon glyphs plus the ASCII letters that spell them and the
    subsetter's layout closure pulls in every ligature reachable from those
    letters — the whole 4,277-rule set, 3.8 MB. Turn the closure off instead
    and the ligature lookups are dropped entirely, so the icons render as the
    literal word "arrow_forward".

    So the rules are pruned here first, in the full font, and the subsetter
    then closes over only what is left. The lookups are wrapped in Extension
    subtables, which is why this has to unwrap them.
    """
    font = TTFont(src / source, lazy=False)
    kept = dropped = 0
    for lookup in font["GSUB"].table.LookupList.Lookup:
        for subtable in lookup.SubTable:
            inner = getattr(subtable, "ExtSubTable", subtable)
            if not hasattr(inner, "ligatures"):
                continue
            for first, ligatures in list(inner.ligatures.items()):
                keep = [lig for lig in ligatures if lig.LigGlyph in names]
                dropped += len(ligatures) - len(keep)
                kept += len(keep)
                if keep:
                    inner.ligatures[first] = keep
                else:
                    del inner.ligatures[first]
    if kept == 0:
        sys.exit("No ligature rules matched ICONS — the upstream font changed.")
    print(f"icon ligature rules: kept {kept}, dropped {dropped}")
    font.save(target)
    return target


pruned_icons = prune_ligatures("material.ttf", work / "material-pruned.ttf", set(ICONS))

written["material-symbols.woff2"] = subset(
    pruned_icons,
    "material-symbols.woff2",
    f"--glyphs={','.join(ICONS)}",
    "--text=abcdefghijklmnopqrstuvwxyz_",
    # The font registers its ligatures across several feature tags; `liga`
    # alone silently produces a font with no substitutions at all.
    "--layout-features=liga,dlig,ccmp,rlig",
    "--drop-tables+=DSIG",
)

for leftover in work.iterdir():
    leftover.unlink()
work.rmdir()

(out / "icons.json").write_text(f"{json.dumps(sorted(ICONS), indent=2)}\n")

for name, size in written.items():
    print(f"{name:28} {size / 1024:7.1f} kB")
print(f"{'total':28} {sum(written.values()) / 1024:7.1f} kB")
