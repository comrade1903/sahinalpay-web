---
name: Şahin Alpay Archive
description: A reading room for a life in print — paper, ink, and a brass marker.
colors:
  paper-0: "#ffffff"
  paper-50: "#f7f6f2"
  paper-100: "#efede7"
  paper-200: "#e7e4dc"
  paper-300: "#dbd7cd"
  paper-400: "#cdc9bf"
  ink-900: "#1a1d21"
  ink-700: "#383d44"
  ink-500: "#5e646c"
  blue-700: "#2e5f8e"
  blue-900: "#1e4569"
  blue-container: "#dbe7f2"
  brass-600: "#b58b2b"
  brass-ink: "#6f4f12"
  brass-container: "#f3e5bf"
  line: "#d0cdc5"
  line-strong: "#8f8a7e"
  error: "#b83230"
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
    backgroundColor: "{colors.blue-700}"
    textColor: "{colors.paper-0}"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1.6rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blue-700}"
    textColor: "{colors.paper-0}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink-900}"
    rounded: "{rounded.lg}"
    padding: "0.85rem 1.6rem"
    height: "44px"
  button-ghost-hover:
    textColor: "{colors.blue-900}"
    rounded: "{rounded.lg}"
  chip:
    backgroundColor: "transparent"
    textColor: "{colors.ink-700}"
    rounded: "{rounded.full}"
    padding: "0.5rem 0.9rem"
    height: "44px"
  chip-active:
    backgroundColor: "{colors.blue-700}"
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
    backgroundColor: "{colors.paper-100}"
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
    backgroundColor: "{colors.blue-container}"
    textColor: "{colors.blue-900}"
    rounded: "{rounded.full}"
    padding: "0.25rem 0.7rem"
  badge-source:
    backgroundColor: "transparent"
    textColor: "{colors.brass-ink}"
    rounded: "{rounded.full}"
    padding: "0.12rem 0.45rem"
---

# Design System: Şahin Alpay Archive

## Overview

**Creative North Star: "The Reading Room"**

A quiet, well-lit room where a body of writing is kept and read. Not a monument and
not a newsfeed — a room with good light, paper on the tables, ink on the paper, and a
few brass fittings that tell you where things are. The interface is the room, not the
exhibit: it holds the material at a comfortable height and then gets out of the way.
Warmth is deliberate. The palette is built on paper tones and a warm near-black
rather than corporate white and cool grey, because the subject is a person's working
life, not a database of records.

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
- Paper-and-ink palette; the page is never pure white, never pure black
- Two fonts with two jobs: Literata reads, Nunito Sans operates
- Reading text carries old-style figures — dates sit on the baseline like print
- Flat at rest; depth comes from tonal layering and hairlines, shadow only answers a state
- Brass marks, blue carries; brass is never clickable
- 44px minimum on every interactive control, at every breakpoint
- Every motion is optional by construction

## Colors

Two warm neutral families — paper and ink — with a single carrying accent and a rarer
brass marker; every semantic token in the system resolves to one of these, and both
themes are equal citizens rather than one being a filter over the other.

### Primary

- **Archive Blue** (`#2e5f8e`): The carrying colour. Every link, button, nav underline,
  focus ring, active chip, and timeline marker. It is the only colour that means
  "this does something."
- **Archive Blue Deep** (`#1e4569`): Text-weight blue. Used where blue must sit *as
  text* and still pass contrast — inline links, outlet names in list rows, card CTAs,
  the accent half of the wordmark.
- **Blue Container** (`#dbe7f2`): The quiet fill behind counts and status pills, where
  a blue needs to read as a surface rather than an action.

### Tertiary

- **Brass** (`#b58b2b`): The marker. The 24px rule before every kicker, the timeline
  and chronicle accents, the drop cap, the source badge outline. It points at things;
  it is never the thing.
- **Brass Ink** (`#6f4f12`): Brass at text weight — kickers, eyebrows, dates, outlet
  metadata, the article drop cap and end mark. In dark theme it lightens to `#e8d6a8`
  and carries the same jobs.
- **Brass Container** (`#f3e5bf`): The warm tint behind archive-category cards, keeping
  scanned-material sections distinguishable from digital ones without adding a hue.

### Neutral

- **Paper 50** (`#f7f6f2`): The page itself. Warm, slightly off-white — the base every
  surface sits on.
- **Paper 0** (`#ffffff`): Pure white, reserved. Only lifted or inset surfaces get it:
  cards over a panel, input fields, clipping frames, menus.
- **Paper 100–400** (`#efede7` → `#cdc9bf`): The tonal ladder. This is how the system
  builds depth — a card is a step up the ladder, not a shadow.
- **Ink 900** (`#1a1d21`): Headings and reading text. A warm near-black, never `#000`.
- **Ink 700** (`#383d44`): Default body and UI text — the colour `<body>` actually sets.
- **Ink 500** (`#5e646c`): Muted metadata — captions, placeholders, source notes, dates
  in secondary position.
- **Line** (`#d0cdc5`) / **Line Strong** (`#8f8a7e`): The hairline vocabulary. Section
  dividers, list-row rules, card borders, ghost-button strokes. Line Strong is bound to
  `--control-border` and draws the visible boundary of real controls, so it is held at
  3:1 against the page (3.18:1 light, 3.32:1 dark) to satisfy WCAG 1.4.11. Plain Line is
  decorative separation and is exempt.
- **Error** (`#b83230`): Form and validation only. It never appears as emphasis.

### Named Rules

**The Brass Marker Rule.** Brass marks; blue carries. Brass may label, point at, rule
off, or decorate — it may never be the affordance. A brass element the user is
expected to click is a defect, not a variant.

**The Paper Floor Rule.** The page is never pure white and text is never pure black.
`#ffffff` is reserved for surfaces that have lifted off the page; the page itself is
always `paper-50`. In dark theme the same rule inverts: the page is `#16181c`, and the
darkest value (`#101317`) belongs to inset surfaces, not the background.

**The One Accent Rule.** There is exactly one action colour. When a screen seems to
need a second, the answer is a tonal surface step or a brass marker — not a new hue.

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
  site. Its italic span takes Archive Blue Deep at weight 500.
- **Headline** (700, `clamp(2rem, 4.5vw, 3rem)`, 1.12): Section and page titles, capped
  at 26ch so they break into readable lines rather than stretching the container.
- **Title** (700, 1.3rem, 1.35): Card headings, hub cards, timeline eras. Article list
  rows sit slightly lower at 1.05rem.
- **Body** (400, 18px / 17px below 768px, 1.72): Reading text — article bodies, prose,
  biography. Literata, capped at `68ch`, with `'kern' 1, 'liga' 1, 'onum' 1`.
- **Lead** (500, `clamp(1.3rem, 2.4vw, 1.6rem)`, 1.5): Literata at Ink 900, the
  standfirst under a section title.
- **Body small** (400, 0.95rem, 1.6): Literata for secondary reading text — card
  descriptions, notes, the body-load error.
- **UI** (600, 0.85rem): Nunito Sans for anything operable — nav links, buttons, sort
  controls, footer links, pagination.
- **Label** (800, 0.78rem, 0.16em, uppercase): Kickers, eyebrows, outlet names, filter
  headings, captions.
- **Label small** (800, 0.72rem, 0.06em, uppercase): Badges, counts, list-row metadata —
  the smallest type in the system.

**Known drift.** The stylesheet currently uses thirteen distinct sizes between
0.68rem and 0.95rem where the roles above describe five. The extra steps
(0.68 / 0.7 / 0.75 / 0.76 / 0.8 / 0.82 / 0.88 / 0.92rem) are drift, not intent, and
should collapse onto the nearest documented role as those components are next
touched. New work uses the roles; it does not add a fourteenth value.

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

## Layout

A single centred column, `1200px` maximum, with `1.5rem` inline padding that opens to
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

- **Soft** (`box-shadow: 0 4px 20px rgba(24, 29, 36, 0.07)`): The hover response on
  cards and list surfaces, and the resting treatment for genuinely separate objects —
  filter panels, timeline cards, clipping frames.
- **Lift** (`box-shadow: 0 10px 32px -8px rgba(24, 29, 36, 0.18)`): True overlays only —
  the skip link, drawers, dialogs, the clipping viewer.

In dark theme both deepen (`0.35` and `0.55` alpha) because a warm-black surface needs
more shadow to separate at all.

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
timeline marker, the brass kicker rule, the nav underline. `0.5rem` is the inner
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
- **Primary:** Archive Blue fill, white text, matching border. Nunito Sans 0.85rem/700
- **Hover:** Rises 1px, gains the Soft shadow, brightens 4% — all over 0.2s ease
- **Ghost:** Transparent with a Line Strong stroke and Ink 900 text; on hover the stroke
  turns Archive Blue, the fill becomes the 11%-alpha accent wash, the text goes Blue Deep
- **Text link:** Blue Deep at weight 700 with a 40%-alpha accent underline that goes
  solid on hover — links are underlined by default, never colour-only

### Chips

- **Style:** Pill, transparent, 1px Line border, Ink 700 label in Nunito Sans 0.75rem/700
- **Hover / focus:** Border and text shift to accent
- **Active** (`data-active="true"`): Solid Archive Blue fill with white text
- **Dismissible variant:** Paper 0 fill with a trailing close affordance, used for the
  active-filter summary. All chips honour the 44px floor despite their small type

### Cards / Containers

- **Corner Style:** `1rem`
- **Background:** Paper 100 for grid cards over the page; Paper 0 for cards inside an
  already-tinted panel. Hub cards additionally take a per-category `color-mix` tint
  (brass wash for scanned-source sections, blue wash for books) — decoration only, with
  identical data underneath
- **Shadow Strategy:** None at rest; Soft on hover (see Elevation)
- **Border:** 1px at 55% Line alpha
- **Internal Padding:** `1.5rem`, with a `220px` minimum height on hub cards so a
  populated and an empty card sit at the same size
- **Hover:** `translateY(-3px)`, border to accent, Soft shadow, 0.25s ease

### Inputs / Fields

- **Style:** Paper 0 fill, 1px Line border, pill radius for search, `0.5rem` for date
  fields; `44px` minimum height; leading Material Symbol in Ink 500
- **Focus:** The global treatment — `2px solid var(--accent)` outline at `3px` offset.
  Inputs do not define their own focus ring
- **Placeholder:** Ink 500

### Navigation

- Nunito Sans 0.85rem/600 in Ink 700, hidden below 900px. Hover lifts text to Ink 900
  and grows a 2px accent underline from 0 to 100% width over 0.25s. The current page
  takes Blue Deep text with the underline already full. Below 900px the same links move
  into a slide-in drawer over a scrim, where the active item gets a filled accent wash
  instead of an underline.
- The header is sticky at `72px` with `saturate(1.3) blur(10px)` over a 90%-alpha
  surface, and grows its bottom hairline only once the page has scrolled.

### The Article Page

The system's signature surface, and the one place it lets print show through:

- A drop cap on the first paragraph — Literata 700 at `3.4em`, floated, `0.82`
  line-height, in Brass Ink. Suppressible via `.no-dropcap` for texts that open with a
  dateline or an editor's note
- An end mark: `▪` in Brass Ink, appended to the last paragraph — the printed-page
  signal that the text is complete and nothing was truncated
- A byline block with avatar, name, and date; a kicker-ruled subtitle carrying the
  issue and page citation; and a source note in Ink 500 italic below any scan
- Body paragraphs in Literata at `1.72` with old-style figures, capped at the reading
  measure

### The Chronicle Spine

A year-by-year timeline: a 2px left rail with a `4rem` year gutter (`3rem` below 560px)
at every width — the alternating centre spine belongs to `.timeline` on the About page,
not here. Each year carries a proportional bar of published output and a count.

The axis runs continuously from the first to the last year the archive can show, and
runs of years with nothing in them collapse into a labelled gap band — a dashed track
where the bar would sit, plus the range and a count of years. Omitting an empty year
would read as "he did not write", which is the one thing this page must never imply
about material that simply has not been recovered.

### The Coverage Strip

The homepage's answer to "what does this archive hold". One row per outlet on a shared
year axis: an uppercase outlet label, a track carrying a band across the years that
outlet covers, the year range, and decade ticks along the bottom. It reuses the
chronicle's bar vocabulary — accent fill on a `--surface-mid` track — so the front page
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

- **Don't** make brass clickable. It marks, rules off, and labels; blue carries every
  action.
- **Don't** introduce a second accent hue. Use a tonal surface step or a brass marker.
- **Don't** use `#ffffff` for a page background or `#000000` for text. The page is
  `paper-50`; text is `ink-900`/`ink-700`.
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
