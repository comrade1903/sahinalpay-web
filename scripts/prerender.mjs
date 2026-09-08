#!/usr/bin/env node
/**
 * Writes one static HTML file per route into dist/.
 *
 * What this is, precisely: **prerendered head plus a no-JavaScript
 * fallback** — not server-side rendering of the visible page. `#root` is
 * empty in every file, and a browser that runs JavaScript still builds the
 * visible page on the client, exactly as before. The consequences are worth
 * stating rather than glossing:
 *
 *   - A reader with JavaScript sees the same first paint as before; nothing
 *     is faster to render.
 *   - If the app's scripts fail to load while JavaScript is enabled, the
 *     <noscript> block does NOT appear — the reader gets a blank page. The
 *     root error boundary covers render errors, not a failed chunk fetch.
 *   - Rendering the visible body server-side is a separate, larger change:
 *     it needs the archive available synchronously during render, which is
 *     what the lazy per-language chunks deliberately avoid.
 *
 * What it does fix: every URL used to return the same index.html, so the
 * title, canonical, language alternates and structured data were only right
 * after JavaScript ran. Social-card scrapers and readers without JavaScript
 * got the home page's metadata for every one of 565 articles, and an address
 * that does not exist answered 200 instead of 404.
 *
 * Each generated file carries:
 *   - the route's own <title>, description, robots, canonical and hreflang
 *   - Open Graph / Twitter values for that page
 *   - the route's JSON-LD, built by src/lib/structuredData.ts — the same
 *     module the client uses, and marked so the client adopts this block
 *     rather than adding a second one beside it
 *   - a <noscript> fallback with the page's real text and links, so a reader
 *     without JavaScript can still read a column or reach its page scans
 *
 * Run after `vite build` (npm run build does both), and checked afterwards by
 * `npm run verify:prerender`.
 */
import fs from 'node:fs'
import path from 'node:path'
import { readArchiveItems, resolveBody, sectionPath } from './lib/archive-model.mjs'
import { loadModule, projectRoot } from './lib/load-archive.mjs'

const distDir = path.join(projectRoot, 'dist')
const templatePath = path.join(distDir, 'index.html')

if (!fs.existsSync(templatePath)) {
  console.error('dist/index.html not found — run `vite build` first.')
  process.exit(1)
}

const template = fs.readFileSync(templatePath, 'utf8')

const site = await loadModule('src/siteConfig.ts', 'site-config.mjs')
const routes = await loadModule('src/routes.ts', 'routes-prerender.mjs')
const contentModule = await loadModule('src/content.ts', 'content-prerender.mjs')
/* The very builders lib/seo.ts feeds to useJsonLd. Static and client output
   cannot describe a page differently if there is one implementation. */
const schema = await loadModule('src/lib/structuredData.ts', 'structured-data.mjs')
const { content } = contentModule
const { paths } = routes

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')

/** JSON-LD is a data block, not markup, so only `</script` may not appear. */
const escapeJsonLd = (value) => JSON.stringify(value).replaceAll('</', '<\\/')

const url = (pathname) => `${site.SITE_ORIGIN}${pathname}`

/* --------------------------------------------------------------- head --- */

function headBlock({
  title,
  description,
  canonicalPath,
  alternates,
  robots = 'index, follow, max-image-preview:large',
  ogType = 'website',
  lang,
}) {
  const canonical = url(canonicalPath)
  const lines = [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<meta name="robots" content="${escapeHtml(robots)}" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  ]
  for (const [alternateLang, alternatePath] of Object.entries(alternates)) {
    lines.push(
      `<link rel="alternate" hreflang="${alternateLang}" href="${escapeHtml(url(alternatePath))}" />`,
    )
  }
  if (alternates.en) {
    lines.push(
      `<link rel="alternate" hreflang="x-default" href="${escapeHtml(url(alternates.en))}" />`,
    )
  }
  lines.push(
    '<meta property="og:site_name" content="Şahin Alpay" />',
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:type" content="${ogType}" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${escapeHtml(url(site.OG_IMAGE_PATH))}" />`,
    `<meta property="og:image:type" content="${site.OG_IMAGE_TYPE}" />`,
    `<meta property="og:image:width" content="${site.OG_IMAGE_WIDTH}" />`,
    `<meta property="og:image:height" content="${site.OG_IMAGE_HEIGHT}" />`,
    '<meta property="og:image:alt" content="Şahin Alpay — political scientist, author and journalist" />',
    `<meta property="og:locale" content="${lang === 'tr' ? 'tr_TR' : 'en_US'}" />`,
    `<meta property="og:locale:alternate" content="${lang === 'tr' ? 'en_US' : 'tr_TR'}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(url(site.OG_IMAGE_PATH))}" />`,
  )
  return lines.map((line) => `    ${line}`).join('\n')
}

/* ---------------------------------------------------------- noscript --- */

const noscriptStyle = `
      <style>
        .noscript-fallback { max-width: 46rem; margin: 0 auto; padding: 2rem 1.25rem 4rem; }
        .noscript-fallback a { color: inherit; }
        .noscript-fallback ul { padding-left: 1.1rem; }
        .noscript-fallback li { margin-bottom: 0.6rem; }
        .noscript-note { border-left: 3px solid #a32b22; padding-left: 0.9rem; }
      </style>`

function noscriptBlock(lang, innerHtml) {
  const note =
    lang === 'tr'
      ? 'Bu sayfa JavaScript ile tam olarak çalışır. Aşağıdaki metin ve bağlantılar, JavaScript olmadan da arşive erişilebilsin diye sunulmaktadır.'
      : 'This page is fully interactive with JavaScript. The text and links below are here so the archive stays reachable without it.'
  const nav = navLinks(lang)
  return `<noscript>${noscriptStyle}
      <div class="noscript-fallback">
        <p class="noscript-note">${escapeHtml(note)}</p>
        ${innerHtml}
        <hr />
        <nav aria-label="${lang === 'tr' ? 'Ana menü' : 'Primary'}">${nav}</nav>
      </div>
    </noscript>`
}

function navLinks(lang) {
  return content[lang].nav
    .map(
      (entry) =>
        `<a href="${escapeHtml(paths[lang][entry.key])}">${escapeHtml(entry.label)}</a>`,
    )
    .join(' · ')
}

function itemListHtml(items, lang, limit = 200) {
  const rows = items.slice(0, limit).map((item) => {
    const href = item.internal ? item.route : (item.url ?? item.imageSrc ?? null)
    const label = escapeHtml(item.title)
    const meta = [item.outlet, item.date].filter(Boolean).map(escapeHtml).join(', ')
    const link = href ? `<a href="${escapeHtml(href)}">${label}</a>` : label
    return `<li>${link}${meta ? ` — <small>${meta}</small>` : ''}</li>`
  })
  const more =
    items.length > limit
      ? `<p>${lang === 'tr' ? `…ve ${items.length - limit} yazı daha.` : `…and ${items.length - limit} more pieces.`}</p>`
      : ''
  return `<ul>${rows.join('')}</ul>${more}`
}

/* ------------------------------------------------------------- writing --- */

let written = 0

function writePage(routePath, { head, jsonLd, noscript, lang }) {
  let html = template
    .replace(
      /<!--route-head-->[\s\S]*?<!--\/route-head-->/,
      `<!--route-head-->\n${head}\n    <!--/route-head-->`,
    )
    .replace(
      /<!--route-jsonld-->[\s\S]*?<!--\/route-jsonld-->/,
      jsonLd
        ? `<!--route-jsonld--><script type="application/ld+json" ${schema.ROUTE_JSONLD_ATTR}="true">${escapeJsonLd(jsonLd)}</script><!--/route-jsonld-->`
        : '<!--route-jsonld--><!--/route-jsonld-->',
    )
    .replace(
      /<!--route-noscript-->[\s\S]*?<!--\/route-noscript-->/,
      `<!--route-noscript-->${noscript}<!--/route-noscript-->`,
    )
  html = html.replace('<html lang="en">', `<html lang="${lang}">`)

  const target =
    routePath === '/'
      ? path.join(distDir, 'index.html')
      : path.join(distDir, routePath.replace(/^\//, ''), 'index.html')
  const targetDir = path.dirname(target)
  if (!targetDir.startsWith(distDir)) {
    throw new Error(`Refusing to write outside dist/: ${target}`)
  }
  fs.mkdirSync(targetDir, { recursive: true })
  fs.writeFileSync(target, html)
  written += 1
}

/* --------------------------------------------------------------- data --- */

const items = await readArchiveItems()
const byLang = { tr: [], en: [] }
for (const item of items) byLang[item.lang].push(item)

/* -------------------------------------------------------- static pages --- */

const HUB_SECTIONS = {
  columns: 'columns',
  analyses: 'analyses',
  interviews: 'interviews',
  academic: 'academicArticles',
}

function sectionCopy(lang, pageKey) {
  const key = HUB_SECTIONS[pageKey]
  return key ? content[lang][key] : undefined
}

/* Split the way the page itself splits: the reader's own language first,
   then the other language's under its own heading. Analyses, interviews and
   academic articles exist in Turkish only, so for English every record is
   foreign — which is what the page shows too, now that the English explainer
   pages were replaced by the records themselves. */
function itemsForSection(lang, pageKey) {
  const of = (source, category) => source.filter((item) => item.category === category)
  const foreignLang = lang === 'tr' ? 'en' : 'tr'
  if (pageKey === 'columns') {
    return { own: of(byLang[lang], 'columns'), foreign: of(byLang[foreignLang], 'columns') }
  }
  for (const category of ['analyses', 'interviews', 'academic']) {
    if (pageKey === category) {
      return lang === 'tr'
        ? { own: of(byLang.tr, category), foreign: [] }
        : { own: [], foreign: of(byLang.tr, category) }
    }
  }
  return { own: [], foreign: [] }
}

for (const lang of ['tr', 'en']) {
  const t = content[lang]
  for (const [pageKey, routePath] of Object.entries(paths[lang])) {
    const alternates = {}
    if (paths.en[pageKey]) alternates.en = paths.en[pageKey]
    if (paths.tr[pageKey]) alternates.tr = paths.tr[pageKey]

    let title = t.htmlTitle
    let description = t.htmlDescription
    let inner = ''
    let jsonLd = null
    let ogType = 'website'

    if (pageKey === 'home') {
      ogType = 'profile'
      inner = `<h1>${escapeHtml(t.htmlTitle)}</h1><p>${escapeHtml(t.hero.intro)}</p>`
      jsonLd = schema.profileJsonLd({
        name: t.htmlTitle,
        description: t.htmlDescription,
        lang,
        url: url(routePath),
      })
    } else if (pageKey === 'about') {
      title = `${t.about.title} — Şahin Alpay`
      description = t.about.lead
      inner = `<h1>${escapeHtml(t.about.title)}</h1><p>${escapeHtml(t.about.subtitle)}</p><p>${escapeHtml(t.about.lead)}</p><p>${escapeHtml(t.about.editorialNote)}</p>${t.about.sections
        .map((section) => `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.title)}</h2>${section.paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('')}</section>`)
        .join('')}`
      jsonLd = schema.aboutJsonLd({
        name: t.about.title,
        description,
        lang,
        url: url(routePath),
      })
    } else if (pageKey === 'books') {
      title = `${t.books.title} — Şahin Alpay`
      description = t.books.intro
      inner = `<h1>${escapeHtml(t.books.title)}</h1><p>${escapeHtml(t.books.intro)}</p><ul>${t.books.books
        .map(
          (book) =>
            `<li><strong>${escapeHtml(book.title)}</strong> (${escapeHtml(book.year)}) — ${escapeHtml(book.desc)}</li>`,
        )
        .join('')}</ul>`
      jsonLd = schema.booksJsonLd({
        name: t.books.title,
        description,
        lang,
        url: url(routePath),
        books: t.books.books,
      })
    } else if (pageKey === 'cookies') {
      title = `${t.cookiePolicy.title} — Şahin Alpay`
      description = t.cookiePolicy.intro
      inner = `<h1>${escapeHtml(t.cookiePolicy.title)}</h1><p>${escapeHtml(t.cookiePolicy.intro)}</p>${t.cookiePolicy.sections
        .map(
          (section) =>
            `<h2>${escapeHtml(section.heading)}</h2>${section.body.map((line) => `<p>${escapeHtml(line)}</p>`).join('')}`,
        )
        .join('')}`
    } else if (pageKey === 'chronicle') {
      const heading = lang === 'tr' ? 'Kronik' : 'Chronicle'
      title = `${heading} — Şahin Alpay`
      description = t.chronicleIntro
      const chronicleItems = byLang[lang].filter((item) => item.internal)
      inner = `<h1>${escapeHtml(heading)}</h1>${itemListHtml(chronicleItems, lang, 60)}`
    } else {
      const section = sectionCopy(lang, pageKey)
      const { own, foreign } = itemsForSection(lang, pageKey)
      const sectionItems = [...own, ...foreign]
      const heading = section?.title ?? pageKey
      title = `${heading} — Şahin Alpay`
      description = section?.intro ?? t.htmlDescription
      const foreignHtml = foreign.length
        ? `<h2>${escapeHtml(t.foreignArchiveLabel)}</h2>${itemListHtml(foreign, lang)}`
        : ''
      inner =
        `<h1>${escapeHtml(heading)}</h1><p>${escapeHtml(description)}</p>` +
        (own.length ? itemListHtml(own, lang) : '') +
        foreignHtml
      jsonLd = schema.collectionJsonLd({
        name: heading,
        description,
        lang,
        url: url(routePath),
        items: sectionItems,
        itemUrl: (item) => url(item.route),
      })
    }

    writePage(routePath, {
      lang,
      head: headBlock({
        title,
        description,
        canonicalPath: routePath,
        alternates,
        ogType,
        lang,
      }),
      jsonLd,
      noscript: noscriptBlock(lang, inner),
    })
  }
}

/* ------------------------------------------------------ article pages --- */

for (const item of items) {
  if (!item.internal) continue
  const lang = item.lang
  const t = content[lang]
  const title = `${item.title} — Şahin Alpay`
  const description = item.subtitle ?? item.excerpt ?? item.title

  let body
  try {
    body = await resolveBody(item)
  } catch (error) {
    console.error(`Failed to resolve body for ${item.lang}/${item.slug}: ${error.message}`)
    process.exit(1)
  }

  const byline = [item.outlet, item.date].filter(Boolean).map(escapeHtml).join(' · ')
  const parts = [`<h1>${escapeHtml(item.title)}</h1>`]
  if (byline) parts.push(`<p><small>Şahin Alpay — ${byline}</small></p>`)
  if (item.subtitle) parts.push(`<p><em>${escapeHtml(item.subtitle)}</em></p>`)
  if (body?.length) {
    parts.push(body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join(''))
  } else if (item.excerpt) {
    parts.push(
      `<p><strong>${escapeHtml(t.reader.summaryLabel)}</strong></p><p>${escapeHtml(item.excerpt)}</p>`,
    )
  }

  /* Scans are the only form some pieces exist in, so the fallback links the
     page images directly rather than describing a viewer it cannot run. */
  const scans = (item.clippings ?? []).filter((clipping) => clipping.kind !== 'photo')
  if (scans.length) {
    parts.push(
      `<h2>${escapeHtml(t.clippingViewer.heading)}</h2><ul>${scans
        .map(
          (clipping, index) =>
            `<li><a href="${escapeHtml(clipping.src)}">${escapeHtml(
              clipping.pageLabel ?? clipping.alt ?? `${index + 1}`,
            )}</a></li>`,
        )
        .join('')}</ul>`,
    )
  }
  if (item.pdfSrc) {
    parts.push(
      `<p><a href="${escapeHtml(item.pdfSrc)}">${escapeHtml(t.clippingViewer.openPdf)}</a></p>`,
    )
  }
  if (item.url) {
    parts.push(`<p><a href="${escapeHtml(item.url)}" rel="noreferrer">${escapeHtml(item.url)}</a></p>`)
  }
  if (item.sourceNote) parts.push(`<p><small>${escapeHtml(item.sourceNote)}</small></p>`)
  parts.push(
    `<p><a href="${escapeHtml(await sectionPath(item.category, lang))}">${escapeHtml(
      t.notFound.browseArchive,
    )}</a></p>`,
  )

  writePage(item.route, {
    lang,
    head: headBlock({
      title,
      description,
      canonicalPath: item.route,
      alternates: { [lang]: item.route },
      ogType: 'article',
      lang,
    }),
    jsonLd: schema.articleJsonLd({
      item,
      lang,
      articleUrl: url(item.route),
      sectionUrl: url(await sectionPath(item.category, lang)),
      sectionName: schema.sectionNameFor(lang, item.category),
    }),
    noscript: noscriptBlock(lang, parts.join('')),
  })
}

/* ------------------------------------------------------------ 404 page --- */

/* Vercel serves dist/404.html for any address it has no file for, which is
   how an unknown URL finally answers 404 instead of 200. Bilingual, because
   the address that missed may be under either language's tree. */
const notFoundInner = ['tr', 'en']
  .map((lang) => {
    const t = content[lang]
    return `<h${lang === 'tr' ? '1' : '2'}>${escapeHtml(t.notFound.title)}</h${lang === 'tr' ? '1' : '2'}>
        <p>${escapeHtml(t.notFound.body)}</p>
        <p><a href="${escapeHtml(paths[lang].home)}">${escapeHtml(t.notFound.backHome)}</a> ·
           <a href="${escapeHtml(paths[lang].columns)}">${escapeHtml(t.notFound.browseArchive)}</a></p>`
  })
  .join('<hr />')

/* One file answers for both language trees, so its head is bilingual rather
   than picking a side the requested path may contradict. */
writePage('/404', {
  lang: 'tr',
  head: headBlock({
    title: `${content.tr.notFound.title} · ${content.en.notFound.title} — Şahin Alpay`,
    description: `${content.tr.notFound.body} ${content.en.notFound.body}`,
    canonicalPath: '/404',
    alternates: {},
    robots: 'noindex, follow',
    lang: 'tr',
  }),
  jsonLd: null,
  noscript: noscriptBlock('tr', notFoundInner),
})
/* Vercel looks for dist/404.html, not dist/404/index.html. */
fs.renameSync(path.join(distDir, '404', 'index.html'), path.join(distDir, '404.html'))
fs.rmdirSync(path.join(distDir, '404'))

console.log(`Prerendered ${written} HTML files into dist/.`)
