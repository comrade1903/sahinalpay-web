#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.dirname(SCRIPT_DIR)

const { slugFromSourceUrl, slugify } = await import(
  pathToFileURL(path.join(ROOT, 'src/archive/utils.ts')).href
)

const EXCERPT_MAX_LENGTH = 200

function truncateExcerpt(text) {
  if (text.length <= EXCERPT_MAX_LENGTH) return text
  const slice = text.slice(0, EXCERPT_MAX_LENGTH)
  const lastSpace = slice.lastIndexOf(' ')
  const trimmed = lastSpace > EXCERPT_MAX_LENGTH * 0.6 ? slice.slice(0, lastSpace) : slice
  return `${trimmed.trim()}…`
}

function serializeValue(value, indent) {
  const pad = '  '.repeat(indent)
  const padInner = '  '.repeat(indent + 1)
  if (typeof value === 'string') return JSON.stringify(value)
  if (typeof value === 'boolean' || typeof value === 'number') return String(value)
  if (Array.isArray(value)) {
    if (value.length === 0) return '[]'
    const items = value.map((entry) => `${padInner}${serializeValue(entry, indent + 1)},`)
    return `[\n${items.join('\n')}\n${pad}]`
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value)
    if (keys.length === 0) return '{}'
    const fields = keys.map((key) => `${padInner}${key}: ${serializeValue(value[key], indent + 1)},`)
    return `{\n${fields.join('\n')}\n${pad}}`
  }
  throw new Error(`Cannot serialize value: ${String(value)}`)
}

const METADATA_FIELD_ORDER = [
  'id',
  'slug',
  'title',
  'date',
  'url',
  'imageSrc',
  'excerpt',
  'subtitle',
  'hasBody',
  'imageCredit',
  'sourceNote',
  'clippings',
]

function buildMetadataSeed(seed) {
  const hasBody = Boolean(seed.body && seed.body.length > 0)
  const needsExcerpt = hasBody && !seed.excerpt && !seed.subtitle
  const ordered = {}
  for (const field of METADATA_FIELD_ORDER) {
    if (field === 'hasBody') {
      if (hasBody) ordered.hasBody = true
      continue
    }
    if (field === 'excerpt' && needsExcerpt) {
      ordered.excerpt = truncateExcerpt(seed.body[0])
      continue
    }
    if (seed[field] !== undefined) ordered[field] = seed[field]
  }
  return ordered
}

function computeSlug(seed) {
  if (seed.slug) return seed.slug
  if (seed.url) return slugFromSourceUrl(seed.url)
  return slugify(seed.title)
}

function toCamelCase(base) {
  return base.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

async function splitOutletFile(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath)
  const mod = await import(pathToFileURL(absolutePath).href)
  const [seedsExportName] = Object.keys(mod)
  const seeds = mod[seedsExportName]

  const bodies = {}
  const metadataSeeds = []
  for (const seed of seeds) {
    if (seed.body && seed.body.length > 0) {
      const slug = computeSlug(seed)
      if (bodies[slug] !== undefined) {
        throw new Error(`Duplicate slug "${slug}" while splitting ${relativePath}`)
      }
      bodies[slug] = seed.body
    }
    metadataSeeds.push(buildMetadataSeed(seed))
  }

  const base = path.basename(relativePath, '.ts')
  const camelBase = toCamelCase(base)
  const bodiesExportName = `${camelBase}Bodies`

  const dir = path.dirname(absolutePath)
  const typesPath = path.join(ROOT, 'src/archive/types')
  let typesImportPath = path.relative(dir, typesPath).split(path.sep).join('/')
  if (!typesImportPath.startsWith('.')) typesImportPath = `./${typesImportPath}`

  const metadataItems = metadataSeeds.map((seed) => `  ${serializeValue(seed, 1)},`).join('\n')
  const metadataContent = `import type { ArchiveItemSeed } from '${typesImportPath}'\n\nexport const ${seedsExportName}: ArchiveItemSeed[] = [\n${metadataItems}\n]\n`

  const bodyEntries = Object.entries(bodies)
    .map(([slug, body]) => `  ${JSON.stringify(slug)}: ${serializeValue(body, 1)},`)
    .join('\n')
  const bodyContent = `export const ${bodiesExportName}: Record<string, string[]> = {\n${bodyEntries}\n}\n`

  fs.writeFileSync(absolutePath, metadataContent)
  const bodyPath = absolutePath.replace(/\.ts$/, '.body.ts')
  fs.writeFileSync(bodyPath, bodyContent)

  console.log(
    `Split ${relativePath}: ${metadataSeeds.length} items, ${Object.keys(bodies).length} with body -> ${path.relative(ROOT, bodyPath)} (export ${bodiesExportName})`,
  )
}

const targets = process.argv.slice(2)
if (targets.length === 0) {
  console.error('Usage: node scripts/split-archive-body.mjs <path/to/outlet.ts> [...]')
  process.exit(1)
}

for (const target of targets) {
  await splitOutletFile(target)
}
