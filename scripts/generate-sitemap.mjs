import fs from 'node:fs'
import { readArchiveEntries, routeForEntry } from './archive-utils.mjs'

const SITE = 'https://sahinalpay.net'
const TODAY = new Date().toISOString().slice(0, 10)
const staticRoutes = [
  ['/', 'monthly', '1.0'],
  ['/about', 'monthly', '0.8'],
  ['/columns', 'weekly', '0.8'],
  ['/books', 'monthly', '0.8'],
  ['/tr', 'monthly', '1.0'],
  ['/tr/kimdir', 'monthly', '0.8'],
  ['/tr/kose-yazilari', 'weekly', '0.8'],
  ['/tr/analizler', 'weekly', '0.7'],
  ['/tr/soylesiler', 'weekly', '0.7'],
  ['/tr/akademik-makaleler', 'weekly', '0.7'],
  ['/tr/kitaplar', 'monthly', '0.8'],
]

const archiveRoutes = readArchiveEntries().map((entry) => [
  routeForEntry(entry, entry.lang),
  'yearly',
  '0.6',
])

const urls = [...staticRoutes, ...archiveRoutes]
  .map(
    ([route, changefreq, priority]) => `  <url>
    <loc>${SITE}${route}</loc>
    <lastmod>${TODAY}</lastmod>
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
