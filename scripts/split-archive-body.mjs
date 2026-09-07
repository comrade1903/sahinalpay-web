#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import { ensureInside, PathGuardError, writeFileAtomic } from './lib/fs-guard.mjs'

/* Splits a large outlet file into metadata (`<outlet>.ts`, imported eagerly)
   plus body text (`<outlet>.body.ts`, loaded on demand — see
   src/archive/bodyRegistry.ts).

   The archive is a legacy record, so the rule here is lossless above all:
   every field a seed carries survives the split, bodies already moved into
   the .body.ts module stay there on a re-run, both files are written through
   a temp file plus rename, and anything the script cannot resolve without
   guessing is a hard error rather than a silent drop.

   Usage: node scripts/split-archive-body.mjs [--dry-run] <path/to/outlet.ts> [...] */

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.dirname(SCRIPT_DIR)
const TYPES_PATH = path.join(ROOT, 'src/archive/types.ts')

const { slugFromSourceUrl, slugify } = await import(
  pathToFileURL(path.join(ROOT, 'src/archive/utils.ts')).href
)

const EXCERPT_MAX_LENGTH = 200

class SplitError extends Error {}

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
    const keys = Object.keys(value).filter((key) => value[key] !== undefined)
    if (keys.length === 0) return '{}'
    const fields = keys.map((key) => `${padInner}${key}: ${serializeValue(value[key], indent + 1)},`)
    return `{\n${fields.join('\n')}\n${pad}}`
  }
  // null, undefined, functions, symbols: writing any of those out would either
  // fail the typecheck or quietly change what the archive says.
  throw new SplitError(`Cannot serialize value: ${String(value)}`)
}

/** Reads the seed field names, in declaration order, straight out of
 *  ArchiveItemSeed. Enumerating them here instead is what silently dropped
 *  archiveUrl/tags/pdfSrc/pdfPageCount/pieceKind when the schema grew. */
function readSeedFieldOrder() {
  const source = fs.readFileSync(TYPES_PATH, 'utf8')
  const start = source.indexOf('export interface ArchiveItemSeed {')
  if (start < 0) {
    throw new SplitError(`Could not find ArchiveItemSeed in ${path.relative(ROOT, TYPES_PATH)}`)
  }
  const open = source.indexOf('{', start)
  const end = source.indexOf('\n}', open)
  if (end < 0) {
    throw new SplitError(`Could not find the end of ArchiveItemSeed in ${TYPES_PATH}`)
  }
  const body = source
    .slice(open + 1, end)
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/[^\n]*/g, '')
  const fields = [...body.matchAll(/^\s*(\w+)\??\s*:/gm)].map((match) => match[1])
  if (fields.length === 0) {
    throw new SplitError('ArchiveItemSeed appears to declare no fields — refusing to guess')
  }
  return fields
}

const SEED_FIELD_ORDER = readSeedFieldOrder()

/** Scans forward from `openIndex` to the bracket that closes it, ignoring
 *  brackets inside string literals. */
function matchBracket(source, openIndex, openChar, closeChar) {
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = openIndex; index < source.length; index += 1) {
    const char = source[index]
    if (quote) {
      if (escaped) {
        escaped = false
        continue
      }
      if (char === '\\') {
        escaped = true
        continue
      }
      if (char === quote) quote = null
      continue
    }
    if (char === "'" || char === '"' || char === '`') {
      quote = char
      continue
    }
    if (char === openChar) depth += 1
    else if (char === closeChar) {
      depth -= 1
      if (depth === 0) return index
    }
  }
  return -1
}

/** Splits an outlet source into the text before the seed array, the array's
 *  own declaration line, and the text after it. Everything outside the array
 *  — the file's provenance comment, its imports — is carried over verbatim
 *  instead of being regenerated from a template that does not know about it. */
function splitAroundSeedArray(source, filePath) {
  const declaration = source.match(/export const (\w+)\s*:\s*ArchiveItemSeed\[\]\s*=\s*\[/)
  if (!declaration) {
    throw new SplitError(
      `${filePath}: no "export const <name>: ArchiveItemSeed[] = [" declaration found`,
    )
  }
  const declarationStart = declaration.index
  const openIndex = declarationStart + declaration[0].length - 1
  const closeIndex = matchBracket(source, openIndex, '[', ']')
  if (closeIndex < 0) {
    throw new SplitError(`${filePath}: the seed array is never closed`)
  }
  return {
    exportName: declaration[1],
    header: source.slice(0, declarationStart),
    declarationLine: declaration[0],
    footer: source.slice(closeIndex + 1),
  }
}

function soleArrayExport(mod, filePath) {
  const arrayExports = Object.keys(mod).filter((key) => Array.isArray(mod[key]))
  if (arrayExports.length !== 1) {
    throw new SplitError(
      `${filePath}: expected exactly one exported seed array, found ${arrayExports.length}` +
        (arrayExports.length > 0 ? ` (${arrayExports.join(', ')})` : ''),
    )
  }
  return arrayExports[0]
}

function computeSlug(seed) {
  if (seed.slug) return seed.slug
  if (seed.url) return slugFromSourceUrl(seed.url)
  return slugify(seed.title)
}

function toCamelCase(base) {
  return base.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
}

function sameBody(a, b) {
  return a.length === b.length && a.every((paragraph, index) => paragraph === b[index])
}

/** Reads an existing `<outlet>.body.ts`, so a second run keeps the bodies it
 *  moved out on the first one. Without this, re-running the script wipes the
 *  body module: the seeds no longer carry `body`, so there is nothing left to
 *  write back. */
async function readExistingBodies(bodyPath, defaultExportName) {
  if (!fs.existsSync(bodyPath)) {
    return { bodies: {}, exportName: defaultExportName, existed: false }
  }
  const mod = await import(pathToFileURL(bodyPath).href)
  const objectExports = Object.keys(mod).filter(
    (key) => mod[key] && typeof mod[key] === 'object' && !Array.isArray(mod[key]),
  )
  if (objectExports.length !== 1) {
    throw new SplitError(
      `${bodyPath}: expected exactly one exported body map, found ${objectExports.length}`,
    )
  }
  const exportName = objectExports[0]
  const bodies = {}
  for (const [slug, body] of Object.entries(mod[exportName])) {
    if (!Array.isArray(body) || body.some((part) => typeof part !== 'string')) {
      throw new SplitError(`${bodyPath}: body for "${slug}" is not a string[]`)
    }
    bodies[slug] = [...body]
  }
  // Keep whatever name the module already exports: bodyRegistry.ts imports it
  // by name, so renaming it here would break the site at runtime.
  return { bodies, exportName, existed: true }
}

function buildMetadataSeed(seed, { hasBody, bodyText }) {
  const ordered = {}
  const seedKeys = new Set(Object.keys(seed))
  const known = new Set(SEED_FIELD_ORDER)

  const needsExcerpt = hasBody && !seed.excerpt && !seed.subtitle && bodyText.length > 0

  for (const field of SEED_FIELD_ORDER) {
    if (field === 'body') continue
    if (field === 'hasBody') {
      if (hasBody) ordered.hasBody = true
      continue
    }
    if (field === 'excerpt' && needsExcerpt) {
      ordered.excerpt = truncateExcerpt(bodyText[0])
      continue
    }
    if (seed[field] !== undefined) ordered[field] = seed[field]
  }

  // Anything the seed carries that ArchiveItemSeed does not declare is kept
  // rather than dropped — the point of this pass is that nothing is lost.
  const extras = [...seedKeys].filter((key) => !known.has(key) && seed[key] !== undefined)
  for (const key of extras) ordered[key] = seed[key]

  return { seed: ordered, extras }
}

async function planSplit(relativePath) {
  const absolutePath = path.resolve(ROOT, relativePath)
  if (!fs.existsSync(absolutePath)) {
    throw new SplitError(`No such file: ${relativePath}`)
  }
  if (!absolutePath.endsWith('.ts') || absolutePath.endsWith('.body.ts')) {
    throw new SplitError(`Expected an outlet <name>.ts file, got: ${relativePath}`)
  }

  const source = fs.readFileSync(absolutePath, 'utf8')
  const { exportName: declaredName, header, declarationLine, footer } = splitAroundSeedArray(
    source,
    relativePath,
  )

  const mod = await import(pathToFileURL(absolutePath).href)
  const seedsExportName = soleArrayExport(mod, relativePath)
  if (seedsExportName !== declaredName) {
    throw new SplitError(
      `${relativePath}: declaration names "${declaredName}" but the module exports "${seedsExportName}"`,
    )
  }
  const seeds = mod[seedsExportName]

  const bodyPath = absolutePath.replace(/\.ts$/, '.body.ts')
  const defaultBodiesExportName = `${toCamelCase(path.basename(absolutePath, '.ts'))}Bodies`
  const existing = await readExistingBodies(bodyPath, defaultBodiesExportName)

  const bodies = {}
  const metadataSeeds = []
  const claimedSlugs = new Set()
  const problems = []
  const notes = []
  let moved = 0
  let reused = 0

  for (const [index, seed] of seeds.entries()) {
    const where = `${relativePath}[${index}] "${seed.title ?? seed.slug ?? '?'}"`
    let slug
    try {
      slug = computeSlug(seed)
    } catch (error) {
      problems.push(`${where}: cannot derive a slug (${error.message})`)
      continue
    }

    const inlineBody = Array.isArray(seed.body) && seed.body.length > 0 ? seed.body : null
    const storedBody = existing.bodies[slug] ?? null
    const claimsBody = seed.hasBody === true

    if (inlineBody || storedBody || claimsBody) {
      if (claimedSlugs.has(slug)) {
        problems.push(`${where}: duplicate slug "${slug}" — the body map cannot hold both`)
        continue
      }
      claimedSlugs.add(slug)
    }

    let bodyText = null
    if (inlineBody && storedBody) {
      if (!sameBody(inlineBody, storedBody)) {
        problems.push(
          `${where}: "${slug}" has body text on the seed AND a different body in ` +
            `${path.basename(bodyPath)} (${inlineBody.length} vs ${storedBody.length} paragraphs). ` +
            'Resolve by hand — refusing to pick one.',
        )
        continue
      }
      bodyText = storedBody
      reused += 1
    } else if (inlineBody) {
      bodyText = inlineBody
      moved += 1
    } else if (storedBody) {
      bodyText = storedBody
      reused += 1
      if (!claimsBody) {
        notes.push(`${where}: kept the existing body for "${slug}" and set hasBody`)
      }
    } else if (claimsBody) {
      problems.push(
        `${where}: hasBody is true but there is no body on the seed and no "${slug}" entry ` +
          `in ${path.basename(bodyPath)} — the reader would fail on this item`,
      )
      continue
    }

    if (bodyText) bodies[slug] = bodyText

    const { seed: metadataSeed, extras } = buildMetadataSeed(seed, {
      hasBody: Boolean(bodyText),
      bodyText: bodyText ?? [],
    })
    if (extras.length > 0) {
      notes.push(`${where}: kept field(s) not declared on ArchiveItemSeed: ${extras.join(', ')}`)
    }
    metadataSeeds.push(metadataSeed)
  }

  const seedBodyCount = Object.keys(bodies).length

  // A body with no seed pointing at it is dead weight, but deleting it is the
  // one thing this script must never do on its own — keep it and say so.
  const orphans = Object.keys(existing.bodies).filter((slug) => !(slug in bodies))
  for (const slug of orphans) {
    bodies[slug] = existing.bodies[slug]
    notes.push(
      `${path.basename(bodyPath)}: kept body "${slug}" — no seed claims it. ` +
        'Remove it by hand if the item is really gone.',
    )
  }

  if (problems.length > 0) {
    throw new SplitError(`${relativePath}:\n  - ${problems.join('\n  - ')}`)
  }

  const metadataItems = metadataSeeds.map((seed) => `  ${serializeValue(seed, 1)},`).join('\n')
  const metadataContent = `${header}${declarationLine}\n${metadataItems}\n]${footer}`

  const bodyEntries = Object.entries(bodies)
    .map(([slug, body]) => `  ${JSON.stringify(slug)}: ${serializeValue(body, 1)},`)
    .join('\n')
  const bodyContent = `export const ${existing.exportName}: Record<string, string[]> = {\n${bodyEntries}\n}\n`

  return {
    relativePath,
    absolutePath,
    bodyPath,
    bodiesExportName: existing.exportName,
    bodyModuleExisted: existing.existed,
    metadataContent,
    bodyContent,
    itemCount: metadataSeeds.length,
    bodyCount: seedBodyCount,
    moved,
    reused,
    orphans,
    notes,
  }
}

function currentContent(filePath) {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null
}

function describeChange(filePath, nextContent) {
  const previous = currentContent(filePath)
  const label = path.relative(ROOT, filePath)
  if (previous === null) return { changed: true, line: `create ${label} (${nextContent.length} bytes)` }
  if (previous === nextContent) return { changed: false, line: `unchanged ${label}` }
  return {
    changed: true,
    line: `rewrite ${label} (${previous.length} -> ${nextContent.length} bytes)`,
  }
}

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run')
const targets = argv.filter((arg) => !arg.startsWith('--'))
const unknownFlags = argv.filter((arg) => arg.startsWith('--') && arg !== '--dry-run')

if (unknownFlags.length > 0) {
  console.error(`Unknown flag(s): ${unknownFlags.join(', ')}`)
  process.exit(1)
}

if (targets.length === 0) {
  console.error(
    'Usage: node scripts/split-archive-body.mjs [--dry-run] <path/to/outlet.ts> [...]\n' +
      '  --dry-run  report what would change and write nothing',
  )
  process.exit(1)
}

try {
  const plans = []
  for (const target of targets) {
    // Outlet files live in the repo; a path outside it is a typo, not a target.
    ensureInside(ROOT, path.resolve(ROOT, target), `target ${target}`)
    plans.push(await planSplit(target))
  }

  let changedFiles = 0

  for (const plan of plans) {
    const metadataChange = describeChange(plan.absolutePath, plan.metadataContent)
    const bodyChange = describeChange(plan.bodyPath, plan.bodyContent)
    if (metadataChange.changed) changedFiles += 1
    if (bodyChange.changed) changedFiles += 1

    console.log(
      `${dryRun ? '[dry-run] ' : ''}${plan.relativePath}: ${plan.itemCount} items, ` +
        `${plan.bodyCount} with body (${plan.moved} moved out, ${plan.reused} already split)` +
        ` -> export ${plan.bodiesExportName}`,
    )
    console.log(`  ${metadataChange.line}`)
    console.log(`  ${bodyChange.line}`)
    for (const note of plan.notes) console.log(`  note: ${note}`)

    if (dryRun) continue

    // Body module first: if the process dies between the two writes, the
    // seeds still carry their inline bodies and the next run reconciles them.
    if (bodyChange.changed) writeFileAtomic(plan.bodyPath, plan.bodyContent)
    if (metadataChange.changed) writeFileAtomic(plan.absolutePath, plan.metadataContent)

    if (!plan.bodyModuleExisted) {
      console.log(
        `  reminder: register "${plan.bodiesExportName}" in src/archive/bodyRegistry.ts and add a ` +
          "manualChunks entry in vite.config.ts for this outlet's .body.ts",
      )
    }
  }

  if (dryRun) {
    console.log(
      changedFiles === 0
        ? '\nNothing to do — every target is already split.'
        : `\n${changedFiles} file(s) would change. Re-run without --dry-run to apply.`,
    )
  }
} catch (error) {
  const expected = error instanceof SplitError || error instanceof PathGuardError
  console.error(expected ? `Split failed: ${error.message}` : error)
  process.exit(1)
}
