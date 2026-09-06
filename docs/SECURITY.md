# Security

## Reporting a problem

Please report anything you believe is a security problem privately, not as a
public GitHub issue: **contact@sahinalpay.net** (the address in the site
footer). Include the URL, what you did, and what happened. You will get an
acknowledgement; this is a small personal archive maintained by one person, so
please allow time for a considered reply rather than an immediate one.

Please do not run automated scanners against the production site. There is no
bug bounty.

## What this site is, in security terms

A static bilingual archive on a CDN. No application server, no database, no
user accounts, sessions or logins, no file upload, no endpoint that changes
data. Nothing a visitor does can alter what the site serves.

This removes whole classes of risk rather than mitigating them: no injection
into a query language, no session to steal, no privilege check to get wrong,
no server-side deserialisation. It does not make the site "secure" in any
absolute sense, and no such claim is made here.

What is left, and what is actually managed:

## Browser code

- Content is rendered as React text nodes. There is no `dangerouslySet-
  InnerHTML`, no `eval`, and no HTML injected from data anywhere in the app.
  JSON-LD is written through `textContent`, never as markup.
- External links open with `rel="noreferrer"` or `rel="noopener noreferrer"`.
- `npm run validate:content` rejects any archive record whose `url` or
  `archiveUrl` is not `https:`.
- Preferences live in `localStorage` and never leave the browser. All access
  goes through `src/lib/storage.ts`, which tolerates browsers that block
  storage entirely.

## Response headers

Declared in `vercel.json` and applied to every response:

| Header | Value |
| --- | --- |
| `Content-Security-Policy` | `default-src 'self'`, `script-src 'self'`, `font-src 'self'`, `object-src 'none'`, `frame-ancestors 'none'`, `base-uri 'self'`, `form-action 'self'`, `upgrade-insecure-requests` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | every powerful feature denied; `fullscreen=(self)` |
| `Cross-Origin-Opener-Policy` | `same-origin` |
| `Cross-Origin-Resource-Policy` | `same-origin` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |

`style-src` still allows `'unsafe-inline'`: the app sets inline styles for
animation and layout, and removing that would mean a hashing or nonce scheme
the static build has no way to apply. It is the one remaining loosening.

These are a defence-in-depth layer, not a response to a known XSS — none was
found. **They are declared in the repository and have not been confirmed on a
live deployment**; see docs/OPERATIONS.md for how to check them with `curl`
after a deploy.

Note that a strict `script-src 'self'` will block the Vercel Toolbar on
preview deployments. That is a deliberate trade-off, recorded in
docs/OPERATIONS.md.

## Dependencies

Four runtime dependencies: react, react-dom, react-router-dom, motion.

- `npm audit` runs in CI. Production dependencies are a hard gate at `high`;
  findings in build-time-only packages are a warning, so a Vite-chain
  advisory cannot block a content correction.
- Dependabot proposes weekly updates for npm and GitHub Actions.
- Every GitHub Action is pinned to a commit SHA, with the tag in a comment.
- `npm run check:secrets` scans tracked **text** files for credential-shaped
  strings — 150 of the 784 files Git tracks; the rest are images, fonts and
  PDFs, skipped by extension, size or a NUL byte, and the script reports both
  numbers. It matches a fixed pattern list and is explicitly not a
  replacement for GitHub's Secret Scanning and Push Protection, which are
  repository settings.

  The matching half lives in `scripts/lib/secret-patterns.mjs` and is covered
  by `tests/check-secrets.test.ts`. Two defects it shipped with, both fixed
  and pinned by tests: the placeholder exemption was applied to the whole
  line, so a comment saying "example" excused a real key beside it; and only
  the first match per pattern per line was examined, so a placeholder at the
  start of a line hid a real key further along it.

**Audit status as of 2026-09-05:** `npm audit` reports no advisories, after
upgrading react-router-dom to 7.18.3 (GHSA-qwww-vcr4-c8h2) and Vite to 8.2.2,
which pulls patched postcss 8.5.28 and nanoid 3.3.18. An audit is a snapshot
against one database on one day; it is not a statement that no vulnerability
exists.

## Automation

`.github/workflows/claude.yml` runs an AI agent when a comment mentions
`@claude`. It is gated on `author_association` so only accounts that can
already push can trigger it. `claude-code-review.yml` loads a plugin from an
external repository at run time — Anthropic's own, but still a moving
dependency inside a job with read access here.

## Content-production tooling

The scripts under `scripts/` run on a maintainer's machine. Those that fetch
from the internet go through `scripts/lib/net-guard.mjs`: HTTPS only, a host
allowlist re-checked on every redirect hop, a redirect cap, a byte cap and a
timeout. Those that write files go through `scripts/lib/fs-guard.mjs`, which
keeps every output path inside its intended directory and sanitises filenames
taken from remote sources.

Both are covered by `tests/net-guard.test.ts` and `tests/fs-guard.test.ts`,
which exercise the refusals against a real loopback server rather than a
mock. Two defects the first version of these guards shipped with, both now
fixed and pinned by tests that fail if reintroduced:

- any loopback hostname skipped the allowlist whether or not the caller had
  opted in, so a redirect could aim a download at a local service;
- redirect and error bodies were read whole with `arrayBuffer()`, under no
  cap, on a response the remote end sizes.

The lesson worth keeping: a guard that has never been tested against a real
response is a claim, not a control. The first redirect test written for the
second bug passed either way — the read is caught and retried, so the only
observable difference is elapsed time.

## Privacy

No analytics, no advertising, no tracking pixels, no third-party embeds. Since
the fonts were brought in-house, the site makes **no third-party requests at
all**; every file comes from its own origin.

The browser stores three values locally — language, theme, and whether the
cookie notice was dismissed. They never leave the device.

The site is hosted by Vercel, which necessarily receives the requests it
answers. What Vercel logs, and for how long, is Vercel's to state, not this
project's; no retention period or compliance guarantee is asserted here.

## What has not been verified

Stated plainly, because the absence of a check is not the absence of a
problem:

- Production response headers and status codes on a live deployment. They are
  declared in `vercel.json` and reproduced locally by `npm run serve:dist`,
  which is not Vercel.
- The CI workflow has never run: it is committed but nothing has been pushed.
  Its YAML parses; its behaviour is unverified.
- GitHub branch protection, Secret Scanning, and Vercel deployment protection
  — all repository/project settings outside this codebase.
- Any dynamic security testing against a running deployment.
- The security of the hosting account itself.
- The content-production scripts other than the guard modules and the secret
  patterns: the importers and the archive splitter are covered by manual runs
  and by the refusals they now raise, not by automated tests. `npm run
  split:archive -- --dry-run` on the real data and `npm run recover:tustav --
  --verify` are the closest things to a regression check for them.
