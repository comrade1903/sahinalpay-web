#!/usr/bin/env node
/**
 * Regenerates public/sitemap.xml from the real archive modules and
 * src/routes.ts, so the sitemap cannot drift from what the site serves.
 *
 * `lastmod` is derived from the record's own content, not the data file's
 * mtime: a fresh `git clone` gives every file the checkout's timestamp, so
 * the old mtime-based dates changed on every clone even though nothing had
 * been edited, and one edit anywhere in an outlet file re-dated all 244 of
 * its records. Each entry now hashes its own fields and keeps the date it
 * last really changed, recorded in scripts/sitemap-lastmod.json.
 */
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { readArchiveItems } from './lib/archive-model.mjs'
import { loadModule, projectRoot } from './lib/load-archive.mjs'

const site = await loadModule('src/siteConfig.ts', 'site-config-sitemap.mjs')
const SITE = site.SITE_ORIGIN

const LASTMOD_PATH = path.join(projectRoot, 'scripts', 'sitemap-lastmod.json')
const today = new Date().toISOString().slice(0, 10)

const previous = fs.existsSync(LASTMOD_PATH)
  ? JSON.parse(fs.readFileSync(LASTMOD_PATH, 'utf8'))
  : {}
const next = {}

/** Stable date for a route: unchanged content keeps its recorded date. */
function lastmodFor(route, fingerprintSource) {
  const fingerprint = crypto
    .createHash('sha256')
    .update(JSON.stringify(fingerprintSource))
    .digest('hex')
    .slice(0, 16)
  const recorded = previous[route]
  const date = recorded?.fingerprint === fingerprint ? recorded.date : today
  next[route] = { fingerprint, date }
  return date
}

/* What a page's lastmod is fingerprinted against. Most page keys name their
   own copy object; the home page has none — its text is the hero and the hub
   around it — so it has to be named, or a rewritten hero would leave the
   sitemap claiming the page had not changed since. */
function copyForPage(lang, pageKey) {
  const t = content[lang]
  if (pageKey === 'home') {
    return { hero: t.hero, hubKicker: t.hubKicker, hubTitle: t.hubTitle, hub: t.hub }
  }
  const key =
    pageKey === 'academic' ? 'academicArticles' : pageKey === 'trial' ? 'trialProcess' : pageKey
  return t[key] ?? null
}

/* Static pages: crawl hints only, so their shape lives here rather than in
   the app. Every key must exist in src/routes.ts — checked below. */
const STATIC_HINTS = {
  home: ['monthly', '1.0'],
  about: ['monthly', '0.8'],
  columns: ['weekly', '0.8'],
  analyses: ['monthly', '0.6'],
  interviews: ['monthly', '0.6'],
  academic: ['monthly', '0.6'],
  books: ['monthly', '0.8'],
  trial: ['monthly', '0.5'],
  press: ['monthly', '0.5'],
  cookies: ['yearly', '0.3'],
}

const routesModule = await loadModule('src/routes.ts', 'routes-sitemap.mjs')
const contentModule = await loadModule('src/content.ts', 'content-sitemap.mjs')
const { paths } = routesModule
const { content } = contentModule

const items = await readArchiveItems()
const press = await loadModule('src/press/index.ts', 'press-sitemap.mjs')

const entries = []

for (const lang of ['en', 'tr']) {
  for (const [pageKey, route] of Object.entries(paths[lang])) {
    const hint = STATIC_HINTS[pageKey]
    if (!hint) {
      console.error(`No sitemap hint for page "${pageKey}" — add one to STATIC_HINTS.`)
      process.exit(1)
    }
    const [changefreq, priority] = hint
    entries.push({
      route,
      changefreq,
      priority,
      lastmod: lastmodFor(route, {
        copy: copyForPage(lang, pageKey),
        title: content[lang].htmlTitle,
        counts: items.filter((item) => item.lang === lang).length,
      }),
    })
  }
}

/* The press pieces about him exist in Turkish only, so each has one route. */
for (const entry of press.allPressItems) {
  const route = `${paths.tr.press}/${entry.slug}`
  entries.push({
    route,
    changefreq: 'yearly',
    priority: '0.5',
    lastmod: lastmodFor(route, {
      title: entry.title ?? null,
      author: entry.author,
      outlet: entry.outlet,
      date: entry.date ?? null,
      url: entry.url ?? null,
      body: entry.body,
    }),
  })
}

for (const item of items) {
  if (!item.internal) continue
  entries.push({
    route: item.route,
    changefreq: 'yearly',
    priority: '0.6',
    lastmod: lastmodFor(item.route, {
      title: item.title,
      date: item.date,
      subtitle: item.subtitle,
      excerpt: item.excerpt,
      sourceNote: item.sourceNote,
      tags: item.tags,
      url: item.url,
      archiveUrl: item.archiveUrl,
      clippings: item.clippings,
      pdfSrc: item.pdfSrc,
      hasBody: Boolean(item.hasBody),
    }),
  })
}

const urls = entries
  .map(
    ({ route, changefreq, priority, lastmod }) => `  <url>
    <loc>${SITE}${route}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  )
  .join('\n')

fs.writeFileSync(
  path.join(projectRoot, 'public', 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
)

fs.writeFileSync(LASTMOD_PATH, `${JSON.stringify(next, null, 2)}\n`)

/* robots.txt carries the origin too — regenerated here so the domain lives
   in src/siteConfig.ts only. */
fs.writeFileSync(
  path.join(projectRoot, 'public', 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
)

console.log(`Generated public/sitemap.xml with ${entries.length} URLs and public/robots.txt.`)
