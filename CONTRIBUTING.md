# Contributing

This is a personal and political archive, not a product. The record's accuracy
outranks every other consideration, including feature velocity and elegance.

## The one rule that is not negotiable

**Nothing on this site may be invented.** No article, date, title, quote,
excerpt, link, book or biographical fact may be added unless it traces to a
verifiable source. A plausible guess is worse than a gap, because a gap is
visibly a gap and a guess is not.

Entries recovered from scanned periodicals need **authorship confirmed** —
the issue's own table of contents naming Şahin Alpay. A name appearing in OCR
text is not enough: other people share the name, mastheads list contributors
who did not write the piece, and citations of his work look the same to a
text search.

Where a piece exists only as a page scan, the archive's own summary of it must
be labelled as such, never presented as his words.

## Before you push

```bash
npm ci
npm run build
npm run lint
npm test
npm run validate:content
```

If you touched archive data, also:

```bash
npm run generate:sitemap
npm run generate:summary
npm run inventory:archive > /tmp/after.json   # diff against a before-run
```

`main` deploys to production on push. Treat every push as a release; use a
branch and a pull request for anything large or risky.

## Conventions

- The owner communicates in Turkish. **Code, comments and commit messages are
  in English.**
- Commit subjects are imperative and describe the user-visible outcome.
- **Every UI string must change in both languages at once.** Shipping English
  copy without its Turkish counterpart is a defect; `validate:content` checks
  that the two dictionaries have the same shape.
- Content is data, not JSX. Archive entries live in `src/archive/`, UI copy in
  `src/content.ts`. Editing an article means editing data.
- Styling extends the hand-written system in `src/index.css`. There is no CSS
  framework and none should be introduced.
- Animation goes through `motion` and must respect `useReducedMotion`. The
  readership skews older; motion that cannot be turned off is not acceptable.
- Check visible changes in a browser in **both languages, both themes, and at
  a phone width** before calling them done.

## Permalinks

A citation must keep resolving. Slugs are derived — an explicit `slug`, else
the source URL's last segment, else the slugified title — so correcting a
title can move a URL that someone has already cited.

If you must change a slug: give the record an explicit `slug`, and record the
old one in `src/archive/aliases.ts` so the old address still resolves.

## Reporting a security problem

See [docs/SECURITY.md](docs/SECURITY.md). Please report privately.
