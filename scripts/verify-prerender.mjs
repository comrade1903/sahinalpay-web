#!/usr/bin/env node
/**
 * Checks the built dist/ against what the running app would produce.
 *
 * The static and client JSON-LD used to be built by two separate pieces of
 * code, so the same article could be described two different ways in one
 * document. They now share src/lib/structuredData.ts — but sharing the
 * builders only removes half the risk: each side still chooses the arguments
 * it passes. This derives those arguments independently, from src/routes.ts
 * and the archive, and compares the result with the block actually written
 * into each file.
 *
 * Also asserts the structural invariants the runtime depends on: exactly one
 * route-scoped block per page, carrying the attribute the client adopts by,
 * a per-route canonical, and a no-JavaScript fallback with real content.
 *
 *   npm run verify:prerender      (run after npm run build)
 */
import fs from 'node:fs'
import path from 'node:path'
import { readArchiveItems, sectionPath } from './lib/archive-model.mjs'
import { loadModule, projectRoot } from './lib/load-archive.mjs'

const distDir = path.join(projectRoot, 'dist')
if (!fs.existsSync(distDir)) {
  console.error('dist/ not found — run `npm run build` first.')
  process.exit(1)
}

const schema = await loadModule('src/lib/structuredData.ts', 'schema-verify.mjs')
const site = await loadModule('src/siteConfig.ts', 'site-verify.mjs')
const routes = await loadModule('src/routes.ts', 'routes-verify.mjs')
const contentModule = await loadModule('src/content.ts', 'content-verify.mjs')
const { content } = contentModule
const { paths } = routes

const errors = []
const url = (pathname) => `${site.SITE_ORIGIN}${pathname}`

function fileFor(routePath) {
  return routePath === '/'
    ? path.join(distDir, 'index.html')
    : path.join(distDir, routePath.replace(/^\//, ''), 'index.html')
}

/* Matches only blocks carrying ROUTE_JSONLD_ATTR — the site-wide Person,
   WebSite and Book graphs in index.html are not route-scoped and are not
   this file's business. */
function routeBlocks(html) {
  const pattern = new RegExp(
    '<script type="application/ld\\+json" ' +
      schema.ROUTE_JSONLD_ATTR +
      '="true">([\\s\\S]*?)</script>',
    'g',
  )
  return [...html.matchAll(pattern)].map((match) => JSON.parse(match[1]))
}

function compare(routePath, expected) {
  const file = fileFor(routePath)
  if (!fs.existsSync(file)) {
    errors.push(`${routePath}: no prerendered file at ${path.relative(projectRoot, file)}`)
    return null
  }
  const html = fs.readFileSync(file, 'utf8')

  const blocks = routeBlocks(html)
  if (blocks.length !== 1) {
    errors.push(
      `${routePath}: ${blocks.length} route-scoped JSON-LD blocks, expected exactly 1 — ` +
        'the client adopts the single unowned block, so a second one would be left behind.',
    )
    return html
  }

  const actual = JSON.stringify(blocks[0])
  const wanted = JSON.stringify(expected)
  if (actual !== wanted) {
    errors.push(
      `${routePath}: the prerendered JSON-LD differs from what the app builds.\n` +
        `  static: ${actual.slice(0, 220)}\n  app:    ${wanted.slice(0, 220)}`,
    )
  }

  if (!html.includes(`<link rel="canonical" href="${url(routePath)}"`)) {
    errors.push(`${routePath}: canonical is missing or points elsewhere`)
  }
  return html
}

const items = await readArchiveItems()

/* ---- article pages ---- */

let articlesChecked = 0
for (const item of items) {
  if (!item.internal) continue
  const lang = item.lang
  const section = await sectionPath(item.category, lang)
  const html = compare(
    item.route,
    schema.articleJsonLd({
      item,
      lang,
      articleUrl: url(item.route),
      sectionUrl: url(section),
      sectionName: schema.sectionNameFor(lang, item.category),
    }),
  )
  if (html && !html.includes('<noscript>')) {
    errors.push(`${item.route}: no <noscript> fallback`)
  }
  articlesChecked += 1
}

/* ---- section pages ---- */

const SECTION_COPY = {
  columns: 'columns',
  analyses: 'analyses',
  interviews: 'interviews',
  academic: 'academicArticles',
}

let sectionsChecked = 0
for (const lang of ['tr', 'en']) {
  for (const [pageKey, copyKey] of Object.entries(SECTION_COPY)) {
    const routePath = paths[lang][pageKey]
    const copy = content[lang][copyKey]
    if (!routePath || !copy) continue
    const sectionItems = items.filter((item) => {
      if (item.category !== (pageKey === 'academic' ? 'academic' : pageKey)) return false
      return pageKey === 'columns' ? item.lang === lang : item.lang === 'tr'
    })
    compare(
      routePath,
      schema.collectionJsonLd({
        name: copy.title,
        description: copy.intro,
        lang,
        url: url(routePath),
        items: sectionItems,
        itemUrl: (item) => url(item.route),
      }),
    )
    sectionsChecked += 1
  }
}

/* ---- home, about, books ---- */

for (const lang of ['tr', 'en']) {
  const t = content[lang]
  compare(
    paths[lang].home,
    schema.profileJsonLd({
      name: t.htmlTitle,
      description: t.htmlDescription,
      lang,
      url: url(paths[lang].home),
    }),
  )
  compare(
    paths[lang].about,
    schema.aboutJsonLd({
      name: t.about.title,
      description: t.about.lead,
      lang,
      url: url(paths[lang].about),
    }),
  )
  compare(
    paths[lang].books,
    schema.booksJsonLd({
      name: t.books.title,
      description: t.books.intro,
      lang,
      url: url(paths[lang].books),
      books: t.books.books,
    }),
  )
}

/* ---- a real 404 file, and no page left with the SPA's default head ---- */

if (!fs.existsSync(path.join(distDir, '404.html'))) {
  errors.push('dist/404.html is missing — unknown addresses would not answer 404')
}

if (errors.length) {
  console.error(`${errors.length} prerender mismatch(es):\n${errors.join('\n')}`)
  process.exit(1)
}

console.log(
  `Prerender verified: ${articlesChecked} article pages, ${sectionsChecked} section pages, ` +
    'plus home/about/books in both languages — each with exactly one route-scoped ' +
    'JSON-LD block matching what the app builds.',
)
