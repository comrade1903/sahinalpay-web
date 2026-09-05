#!/usr/bin/env node
/**
 * Archive integrity gate.
 *
 * Runs against the real modules the browser imports (scripts/lib/archive-model.mjs),
 * so what this validates and what the site renders can no longer disagree.
 *
 * Checks:
 *   schema      every seed field is known and correctly typed
 *   identity    ids and slugs are present and unique
 *   dates       parse, and denote a real calendar date at a stated precision
 *   bodies      every hasBody item resolves through bodyRegistry; no orphans
 *   media       every referenced clipping / PDF exists under public/
 *   urls        external links are https
 *   routes      internal reader routes match src/routes.ts
 *   sitemap     public/sitemap.xml matches the routes the archive advertises
 *   copy        the two language dictionaries have the same shape
 *   assets      the site-wide files index.html and robots.txt point at exist
 */
import fs from 'node:fs'
import path from 'node:path'
import { readArchiveItems, resolveBody, sectionPath } from './lib/archive-model.mjs'
import { loadModule, projectRoot } from './lib/load-archive.mjs'

const errors = []
const warnings = []
const fail = (message) => errors.push(message)
const warn = (message) => warnings.push(message)

const where = (item) => `${item.lang}/${item.outletKey}/${item.slug}`

/* ---------------------------------------------------------------- schema */

/** Mirrors ArchiveItemSeed in src/archive/types.ts. `tsc` already checks the
 *  data files; this catches a field renamed in the type but left behind in a
 *  generated file, and value-level mistakes types cannot express. */
const SEED_FIELDS = {
  id: 'string',
  slug: 'string',
  title: 'string',
  date: 'string',
  url: 'string',
  archiveUrl: 'string',
  imageSrc: 'string',
  excerpt: 'string',
  subtitle: 'string',
  body: 'string[]',
  hasBody: 'boolean',
  imageCredit: 'string',
  sourceNote: 'string',
  clippings: 'clipping[]',
  tags: 'string[]',
  pdfSrc: 'string',
  pdfPageCount: 'number',
  pieceKind: 'string',
}

/** Added by normalizeArchiveItems(), plus the fields archive-model derives. */
const DERIVED_FIELDS = new Set([
  'lang',
  'outlet',
  'outletKey',
  'category',
  'medium',
  'internal',
  'assetPaths',
  'route',
])

const CLIPPING_FIELDS = {
  src: 'string',
  thumbSrc: 'string',
  alt: 'string',
  pageLabel: 'string',
  sourceNote: 'string',
  kind: 'string',
}

function typeOk(value, expected) {
  if (expected === 'string') return typeof value === 'string'
  if (expected === 'boolean') return typeof value === 'boolean'
  if (expected === 'number') return typeof value === 'number' && Number.isFinite(value)
  if (expected === 'string[]') {
    return Array.isArray(value) && value.every((entry) => typeof entry === 'string')
  }
  if (expected === 'clipping[]') return Array.isArray(value)
  return false
}

function checkSchema(item) {
  for (const [field, value] of Object.entries(item)) {
    if (DERIVED_FIELDS.has(field)) continue
    const expected = SEED_FIELDS[field]
    if (!expected) {
      fail(`${where(item)}: unknown field "${field}" — add it to ArchiveItemSeed or remove it`)
      continue
    }
    if (value === undefined) continue
    if (!typeOk(value, expected)) {
      fail(`${where(item)}: field "${field}" should be ${expected}, got ${typeof value}`)
    }
  }
  if (!item.title?.trim()) fail(`${where(item)}: empty title`)
  if (item.pieceKind && !['column', 'interview'].includes(item.pieceKind)) {
    fail(`${where(item)}: pieceKind must be "column" or "interview", got "${item.pieceKind}"`)
  }
  for (const clipping of item.clippings ?? []) {
    for (const [field, value] of Object.entries(clipping)) {
      const expected = CLIPPING_FIELDS[field]
      if (!expected) {
        fail(`${where(item)}: unknown clipping field "${field}"`)
      } else if (value !== undefined && !typeOk(value, expected)) {
        fail(`${where(item)}: clipping field "${field}" should be ${expected}`)
      }
    }
    if (!clipping.src) fail(`${where(item)}: a clipping has no src`)
    if (clipping.kind && !['photo', 'scan'].includes(clipping.kind)) {
      fail(`${where(item)}: clipping kind must be "photo" or "scan", got "${clipping.kind}"`)
    }
  }
  if (item.pdfPageCount !== undefined && !item.pdfSrc) {
    fail(`${where(item)}: pdfPageCount without pdfSrc`)
  }
}

/* -------------------------------------------------------------- identity */

function checkUniqueness(items) {
  for (const field of ['id', 'slug']) {
    const seen = new Map()
    for (const item of items) {
      const value = item[field]
      if (!value) {
        fail(`${where(item)}: missing ${field}`)
        continue
      }
      const key = `${item.lang}:${value}`
      if (seen.has(key)) {
        fail(`Duplicate ${field} "${value}" (${item.lang}): ${where(item)} and ${seen.get(key)}`)
      } else {
        seen.set(key, where(item))
      }
    }
  }
}

/* ----------------------------------------------------------------- dates */

/** Guards the case the old validator waved through: any string containing
 *  four digits counted as a date, so "31 Şubat 2000" and "sayı 1970" passed. */
function checkDate(item, dateUtils) {
  if (!item.date) return
  const precision = dateUtils.archiveDatePrecision(item.date)
  if (!precision) {
    fail(`${where(item)}: unparseable date "${item.date}"`)
    return
  }
  const ts = dateUtils.parseTurkishDate(item.date)
  if (ts === null) {
    fail(`${where(item)}: date "${item.date}" has a precision but no timestamp`)
    return
  }
  if (!dateUtils.isRealCalendarDate(item.date)) {
    fail(`${where(item)}: "${item.date}" is not a real calendar date`)
  }
  const year = new Date(ts).getUTCFullYear()
  if (year < 1940 || year > new Date().getUTCFullYear() + 1) {
    fail(`${where(item)}: date "${item.date}" falls outside a plausible range (${year})`)
  }
}

/* ----------------------------------------------------------------- links */

function checkUrls(item) {
  for (const field of ['url', 'archiveUrl']) {
    const value = item[field]
    if (!value) continue
    let parsed
    try {
      parsed = new URL(value)
    } catch {
      fail(`${where(item)}: ${field} is not a valid URL: ${value}`)
      continue
    }
    if (parsed.protocol !== 'https:') {
      fail(`${where(item)}: ${field} must be https, got ${parsed.protocol}//${parsed.host}`)
    }
  }
  /* imageSrc and pdfSrc are usually site-absolute paths under public/, but a
     few TÜSTAV periodicals link the publisher's own hosted scan instead
     (see src/archive/tr/analyses/forum.ts). Both are legitimate; anything
     that is neither is a typo. */
  for (const field of ['imageSrc', 'pdfSrc']) {
    const value = item[field]
    if (!value) continue
    if (value.startsWith('/')) continue
    if (value.startsWith('https://')) continue
    fail(
      `${where(item)}: ${field} must be a site-absolute path or an https URL, got "${value}"`,
    )
  }
}

/* ----------------------------------------------------------------- media */

const publicDir = path.join(projectRoot, 'public')

function checkMedia(item) {
  for (const assetPath of item.assetPaths) {
    if (assetPath.includes('..')) {
      fail(`${where(item)}: asset path escapes public/: ${assetPath}`)
      continue
    }
    if (!fs.existsSync(path.join(publicDir, assetPath))) {
      fail(`${where(item)}: missing asset ${assetPath}`)
    }
  }
}

/* ----------------------------------------------------------------- main */

const items = await readArchiveItems()
const dateUtils = await loadModule('src/dateUtils.ts', 'date-utils.mjs')

for (const item of items) {
  checkSchema(item)
  checkDate(item, dateUtils)
  checkUrls(item)
  checkMedia(item)
}
checkUniqueness(items)

/* ---- bodies: metadata and split body modules must agree both ways ---- */

const bodyItems = items.filter((item) => item.hasBody)
for (const item of bodyItems) {
  try {
    const body = await resolveBody(item)
    if (!body?.length) fail(`${where(item)}: hasBody is set but the body is empty`)
  } catch (error) {
    fail(`${where(item)}: hasBody is set but no body resolves — ${error.message}`)
  }
}
for (const item of items) {
  if (!item.hasBody && item.body?.length) {
    warn(`${where(item)}: has inline body text but hasBody is not set`)
  }
}

/* Orphans: a body key nothing points at means a record was renamed or
   removed and its text was left behind, downloaded by every reader. */
const p24Bodies = await loadModule('src/archive/tr/columns/p24.body.ts', 'p24-bodies.mjs')
const p24Slugs = new Set(
  items.filter((item) => item.outletKey === 'p24' && item.lang === 'tr').map((item) => item.slug),
)
for (const slug of Object.keys(p24Bodies.p24Bodies)) {
  if (!p24Slugs.has(slug)) fail(`p24.body.ts: orphan body "${slug}" — no archive record uses it`)
}

/* ---- routes: the reader route must be one src/routes.ts really serves ---- */

const routesModule = await loadModule('src/routes.ts', 'routes-check.mjs')
for (const item of items) {
  if (!item.internal) continue
  const base = await sectionPath(item.category, item.lang)
  if (!item.route.startsWith(`${base}/`)) {
    fail(`${where(item)}: route "${item.route}" is not under "${base}"`)
  }
  if (routesModule.langForPath(item.route) !== item.lang) {
    fail(`${where(item)}: route "${item.route}" resolves to the wrong language`)
  }
}

/* ---- sitemap: committed file must match what the archive advertises ---- */

const sitemapPath = path.join(publicDir, 'sitemap.xml')
if (!fs.existsSync(sitemapPath)) {
  fail('public/sitemap.xml is missing — run `npm run generate:sitemap`')
} else {
  const sitemap = fs.readFileSync(sitemapPath, 'utf8')
  const listed = new Set(
    [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
      const { pathname } = new URL(match[1])
      return pathname === '/' ? '/' : pathname.replace(/\/$/, '')
    }),
  )
  const expected = items.filter((item) => item.internal).map((item) => item.route)
  const expectedSet = new Set(expected)
  const sectionPaths = new Set(
    await Promise.all(
      [...new Set(items.map((item) => `${item.category}|${item.lang}`))].map(async (key) => {
        const [category, lang] = key.split('|')
        return sectionPath(category, lang)
      }),
    ),
  )

  const missing = expected.filter((route) => !listed.has(route))
  /* Only archive routes are compared: static pages are the sitemap script's
     own list, not something the archive knows about. An archive route is one
     that lives under a section path and is not the section page itself. */
  const listedArchiveRoutes = [...listed].filter((route) =>
    [...sectionPaths].some((base) => route.startsWith(`${base}/`)),
  )
  const extra = listedArchiveRoutes.filter((route) => !expectedSet.has(route))

  if (missing.length) {
    fail(
      `public/sitemap.xml is stale — ${missing.length} archive route(s) missing, e.g. ${missing
        .slice(0, 3)
        .join(', ')}. Run \`npm run generate:sitemap\`.`,
    )
  }
  if (extra.length) {
    fail(
      `public/sitemap.xml lists ${extra.length} route(s) the archive no longer has, e.g. ${extra
        .slice(0, 3)
        .join(', ')}. Run \`npm run generate:sitemap\`.`,
    )
  }
}

/* ---- the home page's generated summary must match the archive ---- */

const summaryModule = await loadModule('src/archive/summary.generated.ts', 'summary.mjs')
const summary = summaryModule.archiveSummary
const expectedCounts = {
  columns: {
    tr: items.filter((item) => item.lang === 'tr' && item.category === 'columns').length,
    en: items.filter((item) => item.lang === 'en' && item.category === 'columns').length,
  },
  analyses: items.filter((item) => item.category === 'analyses').length,
  interviews: items.filter((item) => item.category === 'interviews').length,
  academic: items.filter((item) => item.category === 'academic').length,
}
if (JSON.stringify(summary.counts) !== JSON.stringify(expectedCounts)) {
  fail(
    'src/archive/summary.generated.ts is stale — its counts no longer match the archive. ' +
      `Run \`npm run generate:summary\`. Expected ${JSON.stringify(expectedCounts)}, ` +
      `got ${JSON.stringify(summary.counts)}.`,
  )
}
const expectedPoolSize = items.filter(
  (item) =>
    item.hasBody &&
    (item.category === 'columns' || (item.category === 'analyses' && item.lang === 'tr')),
).length
const poolSize = summary.pickPool.tr.length + summary.pickPool.en.length
if (poolSize !== expectedPoolSize) {
  fail(
    `src/archive/summary.generated.ts is stale — the weekly-pick pool holds ${poolSize} ` +
      `items, the archive has ${expectedPoolSize}. Run \`npm run generate:summary\`.`,
  )
}
for (const seed of [...summary.pickPool.tr, ...summary.pickPool.en]) {
  if (!items.some((item) => item.id === seed.id && item.slug === seed.slug)) {
    fail(`src/archive/summary.generated.ts: pick "${seed.slug}" is not in the archive`)
  }
}

/* ---- copy: both languages must carry the same UI keys ---- */

function shapeOf(value, prefix = '') {
  if (Array.isArray(value)) return [`${prefix}[]`]
  if (value && typeof value === 'object') {
    return Object.entries(value).flatMap(([key, child]) =>
      shapeOf(child, prefix ? `${prefix}.${key}` : key),
    )
  }
  return [prefix]
}

const contentModule = await loadModule('src/content.ts', 'content.mjs')
const enShape = new Set(shapeOf(contentModule.content.en))
const trShape = new Set(shapeOf(contentModule.content.tr))
for (const key of enShape) {
  if (!trShape.has(key)) fail(`content.ts: "${key}" exists in English but not in Turkish`)
}
for (const key of trShape) {
  if (!enShape.has(key)) fail(`content.ts: "${key}" exists in Turkish but not in English`)
}

/* ---- site-wide assets referenced by index.html and robots.txt ---- */

const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8')
const referenced = new Set(
  [...indexHtml.matchAll(/(?:href|content)="(\/[^"]+)"/g)]
    .map((match) => match[1])
    .filter((value) => !value.includes('{{')),
)
for (const assetPath of referenced) {
  if (assetPath.endsWith('/') || assetPath.startsWith('/src/') || assetPath === '/') continue
  if (!fs.existsSync(path.join(publicDir, assetPath))) {
    fail(`index.html references ${assetPath}, which does not exist under public/`)
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  if (warnings.length) console.error(`\n${warnings.length} warning(s):\n${warnings.join('\n')}`)
  process.exit(1)
}

if (warnings.length) console.warn(`${warnings.length} warning(s):\n${warnings.join('\n')}`)
console.log(
  `Content validation passed: ${items.length} archive entries, ` +
    `${items.filter((item) => item.internal).length} reader routes, ` +
    `${bodyItems.length} full-text bodies.`,
)
