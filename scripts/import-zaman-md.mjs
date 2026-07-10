import fs from 'node:fs'
import path from 'node:path'
import { slugify } from './archive-utils.mjs'

/* Imports the Zaman (Turkish) and Today's Zaman (English) column archives
   from the markdown exports kept next to this repo. Each .md file follows:

       # Title
       *Şahin Alpay YYYY.MM.DD*
       ...body (Zaman files carry raw HTML soup; TZ files are clean md)...
       Kaynak: [domain](original-url), [web.archive.org (arşiv bağlantısı)](archive-url)

   Regenerates src/archive/tr/columns/zaman.ts and
   src/archive/en/columns/todays-zaman.ts wholesale — do not hand-edit those. */

const zamanDir =
  process.argv[2] ?? '/Users/inancozgirgin/Projects/sahinalpay-web/ZAMAN/Şahin Alpay'
const tzDir =
  process.argv[3] ??
  "/Users/inancozgirgin/Projects/sahinalpay-web/Today's Zaman/Şahin Alpay"

const TR_MONTHS = [
  'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
  'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık',
]
const EN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const NAMED_ENTITIES = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&([a-zA-Z]+);/g, (match, name) => NAMED_ENTITIES[name] ?? match)
}

function stripHtml(text) {
  return decodeEntities(
    text
      .replace(/<br\s*\/?>|<\/br>/gi, '\n')
      .replace(/<\/?p[^>]*>/gi, '\n\n')
      .replace(/<\/?div[^>]*>/gi, '\n\n')
      .replace(/<[^>]+>/g, ' '),
  )
}

/* Inline markdown links in the TZ export are site-navigation topic tags
   (dead URLs with SEO title attributes), not references — keep only the
   link text. Emphasis markers go too: bodies render as plain text
   paragraphs, not markdown. */
function flattenMd(text) {
  return text.replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/\*\*/g, '')
}

function toParagraphs(text) {
  return text
    .split(/\n\s*\n/)
    .map((part) => part.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

function parseFile(filePath, { html }) {
  const text = fs.readFileSync(filePath, 'utf8').normalize('NFC')
  const title = text.match(/^# (.+)$/m)?.[1]?.trim()
  const dateMatch = text.match(/^\*Şahin Alpay (\d{4})\.(\d{2})\.(\d{2})\*$/m)
  const bodyMatch = text.match(/^\*Şahin Alpay [\d.]+\*$([\s\S]*?)^Kaynak: (.+)$/m)
  if (!title || !dateMatch || !bodyMatch) {
    throw new Error(`unparseable file: ${filePath}`)
  }

  const [, year, month, day] = dateMatch.map(Number)
  const rawBody = bodyMatch[1]
  const sourceUrls = [...bodyMatch[2].matchAll(/\((https?:\/\/[^)]+)\)/g)].map((m) =>
    decodeEntities(m[1]),
  )
  const body = toParagraphs(html ? stripHtml(rawBody) : flattenMd(rawBody))

  return {
    title,
    year,
    month,
    day,
    url: sourceUrls.find((url) => !url.includes('web.archive.org')),
    archiveUrl: sourceUrls.find((url) => url.includes('web.archive.org')),
    body,
  }
}

function readCollection(dir, { html }) {
  const files = fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .sort()

  /* Some articles were exported twice under different source ids; keep the
     copy with the longest body per (date, title). */
  const byKey = new Map()
  for (const file of files) {
    const entry = parseFile(path.join(dir, file), { html })
    const key = `${entry.year}-${entry.month}-${entry.day}|${entry.title}`
    const existing = byKey.get(key)
    if (!existing || entry.body.join('').length > existing.body.join('').length) {
      byKey.set(key, entry)
    }
  }

  return [...byKey.values()].sort(
    (a, b) =>
      Date.UTC(b.year, b.month - 1, b.day) - Date.UTC(a.year, a.month - 1, a.day),
  )
}

function assignSlugs(entries, takenSlugs) {
  for (const entry of entries) {
    const base = slugify(entry.title) || 'yazi'
    let slug = base
    let suffix = 2
    while (takenSlugs.has(slug)) {
      slug = `${base}-${suffix}`
      suffix += 1
    }
    takenSlugs.add(slug)
    entry.slug = slug
  }
}

function formatDate(entry, months) {
  return `${entry.day} ${months[entry.month - 1]} ${entry.year}`
}

function emitSeeds(entries, months) {
  const items = entries.map((entry) => {
    const lines = [
      '  {',
      `    slug: ${JSON.stringify(entry.slug)},`,
      `    title: ${JSON.stringify(entry.title)},`,
      `    date: ${JSON.stringify(formatDate(entry, months))},`,
    ]
    if (entry.url) lines.push(`    url: ${JSON.stringify(entry.url)},`)
    if (entry.archiveUrl) lines.push(`    archiveUrl: ${JSON.stringify(entry.archiveUrl)},`)
    lines.push('    body: [')
    for (const paragraph of entry.body) {
      lines.push(`      ${JSON.stringify(paragraph)},`)
    }
    lines.push('    ],', '  },')
    return lines.join('\n')
  })
  return items.join('\n')
}

function writeSeedFile(filePath, exportName, entries, months, sourceLabel) {
  const content = [
    `/* Generated by scripts/import-zaman-md.mjs from the ${sourceLabel}`,
    '   markdown export — regenerate with that script instead of hand-editing. */',
    "import type { ArchiveItemSeed } from '../../types'",
    '',
    `export const ${exportName}: ArchiveItemSeed[] = [`,
    emitSeeds(entries, months),
    ']',
    '',
  ].join('\n')
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, content)
}

/* Existing slugs across the site (both languages share one reader lookup),
   so a Zaman column can never shadow a P24/Cumhuriyet/… article. The two
   files this script regenerates are excluded, keeping re-runs idempotent. */
const { readArchiveEntries } = await import('./archive-utils.mjs')
const takenSlugs = new Set(
  readArchiveEntries()
    .filter((entry) => !entry.filePath.endsWith(path.join('columns', 'zaman.ts')))
    .map((entry) => entry.slug),
)

const zaman = readCollection(zamanDir, { html: true })
const todaysZaman = readCollection(tzDir, { html: false })
assignSlugs(zaman, takenSlugs)
assignSlugs(todaysZaman, takenSlugs)

writeSeedFile(
  'src/archive/tr/columns/zaman.ts',
  'zamanColumnSeeds',
  zaman,
  TR_MONTHS,
  'ZAMAN',
)
writeSeedFile(
  'src/archive/en/columns/todays-zaman.ts',
  'todaysZamanColumnSeeds',
  todaysZaman,
  EN_MONTHS,
  "Today's Zaman",
)

console.log(
  JSON.stringify(
    {
      zaman: { files: fs.readdirSync(zamanDir).filter((f) => f.endsWith('.md')).length, imported: zaman.length },
      todaysZaman: { files: fs.readdirSync(tzDir).filter((f) => f.endsWith('.md')).length, imported: todaysZaman.length },
    },
    null,
    2,
  ),
)
