import fs from 'node:fs'
import { readArchiveEntries, routeForEntry } from './archive-utils.mjs'

const SITE = 'https://sahinalpay.net'
const isoMtime = (filePath) =>
  fs.statSync(filePath).mtime.toISOString().slice(0, 10)
const STATIC_LASTMOD = ['src/App.tsx', 'src/content.ts', 'src/routes.ts']
  .map((filePath) => fs.statSync(filePath).mtime)
  .sort((a, b) => b.getTime() - a.getTime())[0]
  .toISOString()
  .slice(0, 10)
const staticRoutes = [
  ['/', 'monthly', '1.0'],
  ['/about', 'monthly', '0.8'],
  ['/columns', 'weekly', '0.8'],
  ['/analyses', 'monthly', '0.6'],
  ['/interviews', 'monthly', '0.6'],
  ['/academic-articles', 'monthly', '0.6'],
  ['/books', 'monthly', '0.8'],
  ['/chronicle', 'monthly', '0.7'],
  ['/cookie-policy', 'yearly', '0.3'],
  ['/tr', 'monthly', '1.0'],
  ['/tr/kimdir', 'monthly', '0.8'],
  ['/tr/kose-yazilari', 'weekly', '0.8'],
  ['/tr/analizler', 'weekly', '0.7'],
  ['/tr/soylesiler', 'weekly', '0.7'],
  ['/tr/akademik-makaleler', 'weekly', '0.7'],
  ['/tr/kitaplar', 'monthly', '0.8'],
  ['/tr/kronik', 'monthly', '0.7'],
  ['/tr/cerez-politikasi', 'yearly', '0.3'],
]

/* Entries with neither body text, a scan clipping, nor an imageSrc have no
   internal reader page (src/App.tsx's LoadedArticlePage renders "not found"
   for one even though it exists in the data) — the list row instead points
   straight at the entry's own url. Sitemapping such a slug would offer
   crawlers and direct visitors a URL that 404s, so it's excluded here rather
   than left for App.tsx's routing to disagree with what this file claims. */
const archiveRoutes = readArchiveEntries()
  .filter((entry) => entry.hasInternalPage)
  .map((entry) => ({
    route: routeForEntry(entry, entry.lang),
    changefreq: 'yearly',
    priority: '0.6',
    lastmod: isoMtime(entry.filePath),
  }))

const normalizedStaticRoutes = staticRoutes.map(([route, changefreq, priority]) => ({
  route,
  changefreq,
  priority,
  lastmod: STATIC_LASTMOD,
}))

const urls = [...normalizedStaticRoutes, ...archiveRoutes]
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
  'public/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
)

console.log(`Generated public/sitemap.xml with ${staticRoutes.length + archiveRoutes.length} URLs.`)
