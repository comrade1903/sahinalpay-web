---
name: Şahin Alpay Archive
description: A reading room for a life in print — lilac paper, press ink, and the editor's red.
colors:
  paper-0: "#f5f3f7"
  paper-50: "#e1d8e9"
  paper-100: "#d7cae2"
  paper-200: "#cab9da"
  paper-300: "#bba5cf"
  paper-400: "#a98dc4"
  ink-900: "#1a171c"
  ink-700: "#332e37"
  ink-500: "#57505d"
  mark-600: "#a32b22"
  mark-700: "#7d1f18"
  mark-container: "#f0dcd8"
  line: "#bdb0c9"
  line-strong: "#6c5c7a"
  error: "#8c1710"
typography:
  display:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(3rem, 9vw, 5.5rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "0"
  headline:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(2rem, 4.5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "0"
  title:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.3rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0"
  title-sm:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 700
    lineHeight: 1.35
    letterSpacing: "0"
  reading:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "1.05rem"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
    fontFeature: "'kern' 1, 'liga' 1, 'onum' 1"
  body:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.72
    letterSpacing: "normal"
    fontFeature: "'kern' 1, 'liga' 1, 'onum' 1"
  lead:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "clamp(1.3rem, 2.4vw, 1.6rem)"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
  body-sm:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "0.95rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  body-xs:
    fontFamily: "Literata, Georgia, serif"
    fontSize: "0.85rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  ui:
    fontFamily: "Nunito Sans, system-ui, sans-serif"
    fontSize: "0.85rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.01em"
  label:
    fontFamily: "Nunito Sans, system-ui, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.16em"
  label-sm:
    fontFamily: "Nunito Sans, system-ui, sans-serif"
    fontSize: "0.72rem"
    fontWeight: 800
    lineHeight: 1.3
    letterSpacing: "0.06em"
rounded:
  sm: "0.5rem"
  lg: "1rem"
  xl: "1.5rem"
  full: "9999px"
spacing:
  "1": "0.5rem"
  "2": "1rem"
  "3": "1.5rem"
  "4": "2.5rem"
  "5": "4rem"
  "6": "6rem"
  "7": "9rem"
components:
  button-primary:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper-0}"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1.6rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.ink-700}"
    textColor: "{colors.paper-0}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1.6rem"
    height: "44px"
  button-ghost-hover:
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.full}"
    padding: "0.5rem 0.9rem"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.ink-900}"
    textColor: "{colors.paper-0}"
    rounded: "{rounded.full}"
    padding: "0.5rem 0.9rem"
    height: "44px"
  search-field:
    backgroundColor: "{colors.paper-0}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.full}"
    padding: "0 0.9rem"
    height: "44px"
  card-hub:
    backgroundColor: "{colors.paper-0}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
    height: "220px"
  card-hub-pending:
    backgroundColor: "transparent"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
    height: "220px"
  card-lifted:
    backgroundColor: "{colors.paper-0}"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.lg}"
    padding: "1.5rem"
  badge-count:
    backgroundColor: "{colors.paper-200}"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.7rem"
  badge-medium:
    backgroundColor: "transparent"
    textColor: "{colors.ink-500}"
    rounded: "{rounded.full}"
    padding: "0.12rem 0.45rem"
  badge-scan:
    backgroundColor: "transparent"
    textColor: "{colors.mark-700}"
    rounded: "{rounded.full}"
    padding: "0.12rem 0.45rem"
---

# Design System: Şahin Alpay Archive

## Overview

**Creative North Star: "The Reading Room"**

A quiet, well-lit room where a body of writing is kept and read. Not a monument and
not a newsfeed — a room with good light, lilac paper on the tables, press ink on the
paper, and an editor's red pencil for the marks that say where things are. The
interface is the room, not the exhibit: it holds the material at a comfortable height
and then gets out of the way.

The stock is deliberate. Paper and ink sit on **one hue axis** — a deeper violet-lilac,
set on 2026-08-15 one ladder step darker and a few degrees closer to true violet (271°)
than the pale lilac tried on 2026-08-13, itself in place of the neutral green-grey the
system launched with — rather than a warm paper against a cool grey text, which is what
the palette used to do before that and what made it read as two systems bolted together.
There are exactly two families and one mark. Not cream, not parchment, and no third
metallic hue: this is a working archive, not a heritage brochure.

The register is composed and unhurried. The material is serious and recent enough to
be painful, so the design states things and lets them carry their own weight; it never
raises its voice to fill a silence. Two rejections are binding. This is a **record, not
a memorial** — Şahin Alpay is alive, so no mourning palette, no black-and-white
gravestone gravity, no valedictory hush. And there is **no victim language**: the
imprisonment is documented, never dramatized, so no bar motifs, no alarm reds, no
campaign-poster urgency. Facts stand calmly.

Density is generous throughout. The readership skews older, so scale, contrast, and
hit size are load-bearing structure rather than preference: 18px base text, a 1.72
reading line-height, a 44px floor under every control. Nothing here is small, and
nothing is fast.

**Key Characteristics:**
- Paper-and-ink palette on one hue axis, currently a deeper violet-lilac; the page is
  never pure white, never pure black
- Two fonts with two jobs: Literata reads, Nunito Sans operates
- Reading text carries old-style figures — dates sit on the baseline like print
- Flat at rest; depth comes from tonal layering and hairlines, shadow only answers a state
- Ink carries the affordance, red marks the page; red is never a fill
- 44px minimum on every interactive control, at every breakpoint
- Every motion is optional by construction

## Colors

Two neutral families on a single hue axis — paper and ink, currently a deeper
violet-lilac — plus one mark colour. Every semantic token in the system resolves to one of these, and both
themes are composed rather than one being a filter over the other.

The system has exactly **two roles**, and the whole palette follows from them:

| Role | Colour | Where it appears |
|---|---|---|
| **Affordance** | Ink | Button fills, active chips and pages, link text, hover borders, the skip link |
| **Mark** | Red | Rules, underlines, the focus ring, "you are here", the drop cap, the end mark, plotted data |

### The Mark

- **Proof Red** (`#a32b22`, dark `#e2796c`): The editor's pencil. The 24px rule before
  every kicker, the pull-quote rule, the article-subtitle rule, the nav underline on the
  current page, the link underline, the focus ring, the drop cap, the end mark, the
  timeline and chronicle markers, the coverage bands, the reading-progress bar, the
  monogram stamp. It marks; it never fills.
- **Proof Red Deep** (`#7d1f18`, dark `#f0968c`): Red at text weight, where it must pass
  4.5:1 as small type. Only two places earn it: the hero eyebrow, and the clipping badge
  that says a piece survives only as a scan.
- **Mark Container** (`#f0dcd8`, dark `#4a221c`): The wash behind **selected text** and
  nothing else. Counts and status pills are metadata, not marks, so they take a paper
  step instead — this is the boundary that keeps the mark from leaking.

### The Affordance

There is no separate action *hue*. Ink is the affordance, which is why a primary button
is a solid press of ink on paper rather than a coloured pill, and why link text sits at
full ink contrast with a red underline beneath it — the proofreader's convention, and
the most legible link treatment available to an older readership.

- **Action** (`ink-900` in light, `ink-900` in dark — which is the *pale* value there):
  Button and active-chip fills. In dark theme ink is the light, so a button correctly
  inverts to paper-on-black instead of staying a dark rectangle on a dark page.
- **Action Hover** (`ink-700` light / `#ffffff` dark): The hover step. It is a token, not
  a `filter: brightness()`, because a brightness multiplier that reads well on a
  near-black button blows out a near-white one.

### Neutral

- **Paper 50** (`#e1d8e9`): The page itself. A deeper violet-lilac, not a cream — one
  ladder step darker and more saturated than the pale lilac this replaced on 2026-08-15,
  per a request to push the stock closer to true violet.
- **Paper 0** (`#f5f3f7`): The lightest sheet, reserved for surfaces lifted off the page:
  cards holding material, input fields, clipping frames, menus.
- **Paper 100–400** (`#d7cae2` → `#a98dc4`): The tonal ladder. This is how the system
  builds depth — a card is a step along the ladder, not a shadow.
- **Ink 900** (`#1a171c`): Headings, reading text, and every affordance. Never `#000`.
- **Ink 700** (`#332e37`): Default body and UI text — the colour `<body>` actually sets.
- **Ink 500** (`#57505d`): Muted metadata — captions, placeholders, source notes, dates,
  kickers, the medium badge, and the large section icons.
- **Line** (`#bdb0c9`) / **Line Strong** (`#6c5c7a` light, `#7b6c89` dark): The hairline
  vocabulary. Section dividers, list-row rules, card borders, ghost-button strokes. Line
  Strong is bound to `--control-border` and draws the visible boundary of real controls,
  so it is held at 3:1 against **every surface a control can sit on**, not just the page
  — 4.41 / 3.89 / 3.32 in light and 3.91 / 3.52 / 3.25 in dark, against the page, the low
  surface and the mid surface (WCAG 1.4.11). Measuring only against the page is how this
  token shipped under-contrast once already, and the deeper violet-lilac pass of
  2026-08-15 was checked against all three surfaces before shipping for exactly that
  reason. Plain Line is decorative separation and is exempt.
- **Error** (`#8c1710`, dark `#f5a49a`): Form and validation only. Deeper than the mark so
  the two do not read as the same signal — and because red is no longer exclusive to
  failure, an error state must always carry an icon and a worded message as well.

### Dark

Dark is composed, not inverted. The paper goes to a violet-black (`#140f19`) rather than a
neutral charcoal, so the stock is recognisably the same stock; ink becomes the light
(`#e4e1e7`); the mark lifts to `#e2796c` because a proof mark has to stay legible against
a dark sheet.

`--surface-raised` exists because of this: it is the *lifted* sheet and must move toward
the light in both themes, which is the opposite direction from `--surface-lowest`, the
inset end of the ladder that correctly flips to the darkest value after dark. A card that
holds material uses raised; a card that is inset uses lowest. Using lowest for a lifted
card is how a card turns into a hole at night.

### Named Rules

**The Two Roles Rule.** Ink carries the affordance; red marks the page. A red button, a
red chip fill, or a red pill is a defect, not a variant — red may rule off, underline,
point at, and plot, but the moment it fills something the user is expected to press, the
one signal a visitor can read at a glance is gone.

**The Rarity Rule.** The mark earns its force by being rare. A badge that appears on
almost every row is metadata and takes ink or a paper step; a badge that appears on a
handful of rows because those pieces survive only as scans is exactly what the mark is
for. When something reads as "coloured because everything else is", it is drift.

**The One Hue Axis Rule.** Paper and ink share a hue. There is no warm-paper /
cool-text split, and no third hue — no brass, no gold, no second accent. When a screen
seems to need another colour, the answer is a tonal surface step or a red mark.

**The Paper Floor Rule.** The page is never pure white and text is never pure black.
`paper-0` is reserved for surfaces that have lifted off the page; the page itself is
always `paper-50`. In dark theme the same rule inverts: the page is `#140f19`, and the
darkest value (`#0f0c11`) belongs to inset surfaces, not the background.

## Typography

**Display Font:** Literata (with Georgia, serif)
**Body Font:** Literata for reading text; Nunito Sans (with system-ui, sans-serif) for
interface text
**Label Font:** Nunito Sans

**Character:** Literata is a serif drawn for long-form screen reading — it gives the
archive the texture of a printed page without period costume. Nunito Sans is the
room's signage: humanist, unfussy, legible at small sizes and heavy weights. The split
is functional, not decorative. When you are reading Şahin Alpay, you are in Literata.
When you are operating the site, you are in Nunito Sans.

### Hierarchy

- **Display** (700, `clamp(3rem, 9vw, 5.5rem)`, 1.12): The name in the hero, once per
  site. Its italic span differs by style and weight (500) alone, not by colour — the
  coloured second word was the single loudest generic-template tell on the page.
- **Headline** (700, `clamp(2rem, 4.5vw, 3rem)`, 1.12): Section and page titles, capped
  at 26ch so they break into readable lines rather than stretching the container.
- **Title** (700, 1.3rem, 1.35): Card headings — hub cards, book cards, the clipping
  viewer, related articles.
- **Title small** (700, 1.05rem, 1.35): The dense heading step — archive list rows,
  recent cards, chronicle years, timeline eras, heritage features. Five components had
  independently reached into the 1–1.15rem gap before this role existed; it is a real
  role, not drift, and pretending otherwise is what let the gap refill.
- **Reading** (400, 1.05rem, 1.72): The article reader's own base, a touch above site
  body because that page is nothing but long-form. The A−/A+ control multiplies this
  token rather than a number buried in the component.
- **Body** (400, 18px / 17px below 768px, 1.72): Reading text — prose, biography.
  Literata, capped at `68ch`, with `'kern' 1, 'liga' 1, 'onum' 1`.
- **Lead** (500, `clamp(1.3rem, 2.4vw, 1.6rem)`, 1.5): Literata at Ink 900, the
  standfirst under a section title, and the article subtitle.
- **Body small** (400, 0.95rem, 1.6): Literata for secondary reading text — card
  descriptions, notes, citations, the body-load error.
- **Body extra small** (400, 0.85rem, 1.5): Literata for the archive list excerpt, and
  only there. The archive list is the densest surface in the system and a scannable list
  outranks the comfort of the reading step; at Body small the rows read well but the list
  goes sparse enough to lose its shape. Same value as UI, different job and different
  face — this is prose, not a control label, so it does not borrow the UI role.
- **UI** (600, 0.85rem): Nunito Sans for anything operable — nav links, buttons, sort
  controls, footer links, pagination.
- **Label** (800, 0.78rem, 0.16em, uppercase): Kickers, eyebrows, outlet names, filter
  headings, captions.
- **Label small** (800, 0.72rem, 0.06em, uppercase): Badges, counts, list-row metadata —
  the smallest type in the system.

Every one of these ships as a custom property (`--text-title-sm`, `--text-ui`, …). A
literal `font-size` in this stylesheet is now either the root size, an icon step, or one
of the six one-offs below — there are no other literals, and that is the point.

### The Icon Scale

Material Symbols ligatures are sized independently of the text roles, in **px**, not rem.
The root size is 18px, so a "1rem" icon would be 18px and every icon in the system would
silently resize with the reading base. Icon size is a glyph decision; reading size is not.

`--icon-sm` 16px (inline with label and badge text) · `--icon-md` 18px (inline with UI
text — arrows, the back link) · `--icon-lg` 20px (leading icon inside a field) ·
`--icon-xl` 36px (section and card icons).

### Lettermarks

Literata initials set inside a frame — the portrait monogram and the about avatar. Not
type, because nobody reads them, and not icons, because they are letters. Two steps,
`--lettermark-md` 2rem and `--lettermark-lg` 5rem, and they *do* scale with the reading
base because they are set in the reading face.

### One-Offs

Four values are deliberately outside every scale, each with a reason recorded at its
declaration: the root size (18px / 17px), the **wordmark** (1.4rem — a brand lockup sized
to the 72px header), the **article body paragraph** (`1em`, inheriting the reader's scaled
base), and the **drop cap** (`3.4em`, relative to the paragraph it opens).

Two more stood here until the About page was rewritten as a first-person narrative: the
pull quote and the fact number. Both were the only users of their rules, so the rules went
with the markup rather than waiting to be reused.

### Named Rules

**The Two Fonts, Two Jobs Rule.** Literata reads, Nunito Sans operates. A paragraph set
in Nunito Sans is wrong; a control label set in Literata is wrong. There is no third
font, and no weight of one substitutes for the other's job.

**The Old-Style Figures Rule.** Reading text carries `onum` — the numerals in a 1994
dateline sit on the baseline with ascenders and descenders, the way the original page
printed them. Interface numerals (counts, filters, years in badges) stay lining. Never
apply `onum` to a UI number; never strip it from prose.

**The 68ch Rule.** Reading measure is capped at `68ch` and never widened for a
"denser" layout. Wide viewports get more margin, not longer lines.

**The No-Literal Rule.** Every `font-size` is `var(--text-*)`, `var(--icon-*)`,
`var(--lettermark-*)`, or one of the six recorded one-offs. This system reached
thirty-seven distinct sizes doing the work of ten by adding "just this one" values a
component at a time, each defensible alone. If a role is genuinely missing, add it here
and to the tokens — that is a design decision, and it should look like one.

**The Round-Up Rule.** When a size sits between two roles, it collapses to the **larger**
one. The readership skews older; a system that resolves ties downward quietly erodes the
legibility floor the rest of this document is built on.

## Layout

A single centred column, `1320px` maximum (widened from `1200px` on 2026-08-31 — the
narrower column read as excessive side gutter on wide monitors), with `1.5rem` inline padding that opens to
`2.5rem` from 768px up. Sections are separated by a 1px hairline and `6rem` of vertical
breathing room (`4rem` below 768px); a page whose content starts at the top drops the
rule and uses `clamp(2.5rem, 5vw, 4rem)` instead, so no page opens with an orphan
divider.

Spacing is a seven-step scale — `0.5 / 1 / 1.5 / 2.5 / 4 / 6 / 9rem` — deliberately
non-linear, widening as it goes so that section-level rhythm is unmistakably different
from component-level rhythm. Use the scale; there are no arbitrary gaps.

Responsive behaviour is progressive disclosure of structure rather than a redraw. The
observed breakpoints are `600px` (facts grid), `640px` (list rows go from stacked to
date-column + body), `700px` (three-up card grids), `768px` (container padding, base
font size), `900px` (desktop nav appears, hero splits `1.1fr / 0.9fr`, chronicle
timeline moves from a left spine to a centre spine), and `1080px` (four-up hub grid).
Below 900px the navigation collapses into a drawer; the header itself stays sticky at
`72px` with a saturating backdrop blur, gaining its bottom hairline only once scrolled.

Article list rows are the archive's densest surface: a fixed `9rem` metadata column
carrying date and outlet, then a fluid body. Below 640px that column unstacks into an
inline meta row so nothing is truncated.

## Elevation & Depth

This system is **flat at rest**. Depth is built from the tonal paper ladder plus 1px
hairlines: a card is a surface one step up (`paper-100` on a `paper-50` page), an input
is a surface at the top of the ladder (`paper-0`), a page divider is a single line.
Shadow is not a material property here — it is a response.

Two shadows exist, and both are answers to state or layer:

### Shadow Vocabulary

- **Soft** (`box-shadow: 0 4px 20px rgba(26, 23, 28, 0.08)`): The hover response on
  cards and list surfaces, and the resting treatment for genuinely separate objects —
  filter panels, timeline cards, clipping frames.
- **Lift** (`box-shadow: 0 10px 32px -8px rgba(26, 23, 28, 0.2)`): True overlays only —
  the skip link, drawers, dialogs, the clipping viewer.

Both shadow colours sit on the neutral hue axis, not on a blue-grey — a shadow cast by
a different light than the page is the kind of detail that reads as assembled.

In dark theme both deepen (`0.4` and `0.6` alpha) and turn neutral black rather than
carrying the lilac hue, because a shadow this dark reads as depth either way and a
tinted one would compete with the surfaces it is meant to separate.

### Named Rules

**The Flat-At-Rest Rule.** Surfaces are flat until something happens. Shadow appears on
hover, on focus, or because an element has genuinely left the page plane. A card that
carries a shadow while idle is over-dressed.

**The Hairline-First Rule.** When two regions need separating, try a `1px solid var(--line)`
first, a tonal step second, and a shadow only if the element actually overlays content.

## Shapes

Two radii, two meanings. **`1rem` (rounded rectangle)** is the container language:
cards, buttons, panels, filter cards, clipping frames, image wells. **`9999px` (pill)**
is the status and control language: chips, badges, counts, the search field, the
timeline marker, the red kicker rule, the nav underline. `0.5rem` is the inner
radius — an image or input nested inside an already-rounded container — and `1.5rem`
is reserved for the largest panels (the home "recently added" panel uses `2rem`, the
one deliberate outlier).

Borders are hairlines, and card borders are deliberately softened with
`color-mix(in srgb, var(--line) 55%, transparent)` so a grid of cards reads as a group
rather than a set of boxes. Nothing in the system uses a border heavier than 1px except
the timeline marker's 3px surface-coloured ring, which exists to punch the dot out of
the spine behind it.

### Named Rules

**The Pill-for-Status Rule.** Fully round means status, filter, or metadata. Rounded
rectangle means content container. A pill-shaped card or a rectangular chip breaks the
one signal a user can read at a glance.

## Components

### Buttons

- **Shape:** Rounded rectangle (`1rem`), `44px` minimum height, `0.85rem 1.6rem` padding
- **Primary:** Ink fill, paper text, matching border. Nunito Sans 0.85rem/700
- **Hover:** Rises 1px, gains the Soft shadow, and steps to `--action-hover` — all over
  0.2s ease. A token, not a brightness filter, so it works in both themes
- **Ghost:** Transparent with a Line Strong stroke and Ink 900 text; on hover the stroke
  turns Ink, the fill becomes the 6%-alpha ink wash, the text stays Ink 900
- **Text link:** Ink 900 at weight 700 with a red underline that goes solid on hover.
  The underline is the mark and the colour is the contrast — links are never colour-only

### Chips

- **Style:** Pill, transparent, 1px Line border, Ink 700 label in Nunito Sans 0.75rem/700
- **Hover:** Border and text shift to Ink; **focus:** border shifts to the red mark
- **Active** (`data-active="true"`): Solid Ink fill with paper text
- **Dismissible variant:** Paper 0 fill with a trailing close affordance, used for the
  active-filter summary. All chips honour the 44px floor despite their small type

### Cards / Containers

- **Corner Style:** `1rem`
- **Background:** Hub cards carry **state, not decoration**, in two values: a section
  holding material takes `--surface-raised` (the lifted sheet), a section still pending
  takes a transparent fill with a dashed Line border. The six near-identical per-category
  tints this replaced read as muddiness rather than as a system, and carried no
  information — the counts underneath were identical
- **Shadow Strategy:** None at rest; Soft on hover (see Elevation)
- **Border:** 1px at 55% Line alpha; dashed on a pending card
- **Internal Padding:** `1.5rem`, with a `220px` minimum height on hub cards so a
  populated and an empty card sit at the same size
- **Hover:** `translateY(-3px)`, border to Ink, Soft shadow, 0.25s ease

### Inputs / Fields

- **Style:** Paper 0 fill, 1px Line border, pill radius for search, `0.5rem` for date
  fields; `44px` minimum height; leading Material Symbol in Ink 500
- **Focus:** The global treatment — `2px solid var(--accent)` (the red mark) at `3px`
  offset. Inputs do not define their own focus ring. The offset means the ring is
  measured against the page, which is where it clears 3:1 even over an ink-filled control
- **Placeholder:** Ink 500

### Navigation

- Nunito Sans 0.85rem/600 in Ink 700, hidden below 900px. Hover lifts text to Ink 900
  and grows a 2px red underline from 0 to 100% width over 0.25s. The current page takes
  Ink 900 text with the underline already full — position is the mark's job, so the
  underline is red while the text stays ink. Below 900px the same links move into a
  slide-in drawer over a scrim, where the active item gets a filled red wash instead of
  an underline.
- The header is sticky at `72px` with `saturate(1.3) blur(10px)` over a 90%-alpha
  surface, and grows its bottom hairline only once the page has scrolled.

### The Article Page

The system's signature surface, and the one place it lets print show through:

- A drop cap on the first paragraph — Literata 700 at `3.4em`, floated, `0.82`
  line-height, in Proof Red. Suppressible via `.no-dropcap` for texts that open with a
  dateline or an editor's note
- An end mark: `▪` in Proof Red, appended to the last paragraph — the printed-page
  signal that the text is complete and nothing was truncated
- A byline block with avatar, name, and date; a kicker-ruled subtitle carrying the
  issue and page citation; and a source note in Ink 500 italic below any scan
- Body paragraphs in Literata at `1.72` with old-style figures, capped at the reading
  measure

### The Autobiographical Introduction

The About page uses a portrait and title beside an introduction and chapter links,
followed by a single reading column capped at 72ch. Chapters use Literata and the
existing prose spacing, with a 100px anchor offset to clear the sticky header.
The first-person text is labelled as a new editorial introduction based on the
memoirs and essays. It carries no attributed pull quote or promotional statistics.
The narrative leads directly to the footer. Book cards remain on the dedicated Books page.

### The Chronicle Spine

A year-by-year timeline: a 2px left rail with a `4rem` year gutter (`3rem` below 560px)
at every width. Each year carries a proportional bar of published output and a count.

**Known gap — the axis is not continuous.** Only years that carry an item or an event
are rendered; a year with neither is omitted, so the spine jumps. A continuous axis
with labelled gap bands was built and then withdrawn, and this file described that
behaviour for a while as though it had shipped — it had not.

The design problem the withdrawn work was aimed at is still open and still real: an
omitted year reads as "he did not write", which is the one thing this page must never
imply about material that simply has not been recovered. The page introduction now
explicitly distinguishes archival gaps from years without writing. The axis itself
still omits empty years.

### The Coverage Strip

The homepage's answer to "what does this archive hold". One row per outlet on a shared
year axis: an uppercase outlet label, a track carrying a band across the years that
outlet covers, the year range, and decade ticks along the bottom. It reuses the
chronicle's bar vocabulary — a red band on a `--surface-mid` track — so the front page
and the timeline read as one system.

Every span is derived from the archive data, so no coverage is claimed for an outlet
whose material has not been recovered; the gaps between bands are the honest shape of
the record. The strip lists outlets from both languages, because the archive is
bilingual and filtering by UI language would show an English reader one outlet instead
of the real body of work.

### The Clipping Frame

Scanned material gets a physical container: Paper 0 mat, `1rem` radius, Soft shadow,
`1rem` of padding around the scan, with the image itself on a Paper 200 well at
`0.5rem`. A caption in Nunito Sans 0.78rem/700 Ink 500 sits below. Interactive clippings
reveal a pill-shaped "open the original" hint at the bottom-right on hover and focus —
and, under `prefers-reduced-motion`, that hint is simply always visible rather than
fading in.

## Do's and Don'ts

### Do:

- **Do** use Literata for anything the visitor reads and Nunito Sans for anything the
  visitor operates.
- **Do** build depth with the paper ladder and 1px hairlines first; reach for `--shadow-soft`
  only as a hover response or for a genuinely separate object.
- **Do** keep every interactive control at `44px` minimum height, including chips and
  icon buttons whose type is much smaller.
- **Do** reach for an existing semantic class (`.section`, `.container`, `.kicker`,
  `.btn btn-primary`, `.filter-card`, `.chip`, `.archive-row`) before writing new CSS,
  and for an existing custom property before writing a literal value.
- **Do** put every animation behind `useReducedMotion` or the global reduced-motion
  block, and give reduced-motion users the end state rather than nothing.
- **Do** pass `behavior: 'instant'` on any programmatic scroll reset — `html` sets
  `scroll-behavior: smooth` site-wide, so a bare `scrollTo` silently animates.
- **Do** check every visual change in both themes and at a mobile width; dark is a
  designed theme, not a filter.
- **Do** let empty archive sections read as pending record — a muted italic count and
  the same card size as a populated one — never as an error or a broken state.

### Don't:

- **Don't** make red clickable. It marks, rules off, underlines, and plots; ink carries
  every action. And don't spend it on something that appears on every row — rarity is
  what gives the mark its force.
- **Don't** introduce a third hue. Paper and ink share one axis and the mark is the only
  colour; when a screen seems to need another, use a tonal surface step or a red mark.
- **Don't** use pure `#ffffff` for a page background or `#000000` for text. The page is
  `paper-50`; text is `ink-900`/`ink-700`. Nothing in the palette is fully desaturated.
- **Don't** widen reading text past `68ch`, or set prose below the 18px base.
- **Don't** add a third font family, an icon component library, or a CSS framework.
  Icons are Material Symbols ligatures; styling is the hand-written system in
  `src/index.css`.
- **Don't** write utility classes. This system is semantic; Tailwind was removed
  deliberately and is not coming back.
- **Don't** give a card a resting shadow, or a chip a rectangular corner.
- **Don't** signal an action with colour alone — links carry an underline, active nav
  carries a rule, active chips carry a fill.
- **Don't** dramatize the imprisonment visually: no bars, no alarm reds, no
  campaign-poster typography. And don't reach for memorial styling — this is a record
  of a living person.
