#!/usr/bin/env node
/**
 * Dumps a stable, diffable inventory of every archive item — id, slug,
 * permalink, every seed field, and a hash of the full body text (including
 * bodies split into lazily loaded modules).
 *
 * Used to prove that a refactor preserved the archive: run it before and
 * after, then `diff` the two JSON files. Equal totals are not enough; this
 * compares every record field by field.
 *
 *   node scripts/archive-inventory.mjs > before.json
 */
import crypto from 'node:crypto'
import { loadArchive, loadModule } from './lib/load-archive.mjs'

function hash(value) {
  if (value === undefined) return undefined
  return crypto.createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16)
}

const archive = await loadArchive()
const registry = await loadModule('src/archive/bodyRegistry.ts', 'body-registry.mjs')

const items = archive.allArchiveItems()
const rows = []

for (const item of items) {
  const body = item.body?.length
    ? item.body
    : item.hasBody
      ? await registry.loadArticleBody(item)
      : undefined
  rows.push({
    id: item.id,
    slug: item.slug,
    lang: item.lang,
    category: item.category,
    outlet: item.outlet,
    outletKey: item.outletKey,
    medium: item.medium,
    pieceKind: item.pieceKind,
    title: item.title,
    date: item.date,
    subtitle: item.subtitle,
    excerpt: item.excerpt,
    sourceNote: item.sourceNote,
    imageCredit: item.imageCredit,
    url: item.url,
    archiveUrl: item.archiveUrl,
    imageSrc: item.imageSrc,
    pdfSrc: item.pdfSrc,
    pdfPageCount: item.pdfPageCount,
    tags: item.tags,
    hasBody: Boolean(item.hasBody || item.body?.length),
    bodyParagraphs: body?.length ?? 0,
    bodyHash: hash(body),
    clippings: (item.clippings ?? []).map((clipping) => ({
      src: clipping.src,
      thumbSrc: clipping.thumbSrc,
      alt: clipping.alt,
      pageLabel: clipping.pageLabel,
      sourceNote: clipping.sourceNote,
      kind: clipping.kind,
    })),
  })
}

rows.sort((a, b) => (a.lang + a.id).localeCompare(b.lang + b.id))

const byOutlet = {}
for (const row of rows) {
  const key = `${row.lang}/${row.category}/${row.outletKey}`
  byOutlet[key] = (byOutlet[key] ?? 0) + 1
}

process.stdout.write(
  `${JSON.stringify({ total: rows.length, byOutlet, items: rows }, null, 2)}\n`,
)
