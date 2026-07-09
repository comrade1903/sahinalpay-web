import fs from 'node:fs'
import path from 'node:path'

const ROOT = process.cwd()

const TURKISH_CHAR_MAP = {
  ç: 'c',
  Ç: 'c',
  ğ: 'g',
  Ğ: 'g',
  ı: 'i',
  I: 'i',
  İ: 'i',
  ö: 'o',
  Ö: 'o',
  ş: 's',
  Ş: 's',
  ü: 'u',
  Ü: 'u',
}

export function slugify(value) {
  return value
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => TURKISH_CHAR_MAP[char] ?? char)
    .toLowerCase()
    .replace(/['"’“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function readFiles(dir) {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) return readFiles(fullPath)
    return entry.isFile() && entry.name.endsWith('.ts') ? [fullPath] : []
  })
}

function extractArray(source) {
  const marker = 'ArchiveItemSeed[] ='
  const markerIndex = source.indexOf(marker)
  if (markerIndex < 0) return ''
  const equalsIndex = source.indexOf('=', markerIndex)
  const start = source.indexOf('[', equalsIndex)
  if (start < 0) return ''

  let depth = 0
  let quote = null
  let escaped = false

  for (let index = start; index < source.length; index += 1) {
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
    if (char === '[') depth += 1
    if (char === ']') {
      depth -= 1
      if (depth === 0) return source.slice(start + 1, index)
    }
  }
  return ''
}

function extractObjects(arraySource) {
  const objects = []
  let start = -1
  let depth = 0
  let quote = null
  let escaped = false

  for (let index = 0; index < arraySource.length; index += 1) {
    const char = arraySource[index]
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
    if (char === '{') {
      if (depth === 0) start = index
      depth += 1
    }
    if (char === '}') {
      depth -= 1
      if (depth === 0 && start >= 0) objects.push(arraySource.slice(start, index + 1))
    }
  }

  return objects
}

function stringField(objectSource, field) {
  const match = objectSource.match(new RegExp(`${field}:\\s*(['"])([\\s\\S]*?)\\1`))
  return match?.[2]
}

function stringFields(objectSource, field) {
  return [...objectSource.matchAll(new RegExp(`${field}:\\s*(['"])([\\s\\S]*?)\\1`, 'g'))].map(
    (match) => match[2],
  )
}

function categoryForFile(filePath) {
  if (filePath.includes(`${path.sep}analyses${path.sep}`)) return 'analyses'
  if (filePath.endsWith(`${path.sep}interviews.ts`)) return 'interviews'
  if (filePath.endsWith(`${path.sep}academic.ts`)) return 'academic'
  return 'columns'
}

function langForFile(filePath) {
  return filePath.includes(`${path.sep}archive${path.sep}en${path.sep}`) ? 'en' : 'tr'
}

function outletForFile(filePath) {
  const base = path.basename(filePath, '.ts')
  const names = {
    cumhuriyet: 'Cumhuriyet',
    sabah: 'Sabah',
    milliyet: 'Milliyet',
    zaman: 'Zaman',
    p24: 'P24',
    forum: 'Forum',
    aydinlik: 'Aydınlık (Sosyalist Dergi/Proleter Devrimci)',
    'isci-koylu': 'İşçi Köylü',
    interviews: 'Söyleşiler',
    academic: 'Akademik Makaleler',
  }
  return names[base] ?? base
}

export function readArchiveEntries() {
  const files = [
    ...readFiles(path.join(ROOT, 'src/archive/tr')),
    ...readFiles(path.join(ROOT, 'src/archive/en')),
  ]
  return files.flatMap((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8')
    return extractObjects(extractArray(source)).map((objectSource) => {
      const title = stringField(objectSource, 'title') ?? ''
      const url = stringField(objectSource, 'url')
      const explicitSlug = stringField(objectSource, 'slug')
      const slug = explicitSlug ?? (url ? url.replace(/\/$/, '').split('/').at(-1) : slugify(title))
      const category = categoryForFile(filePath)
      return {
        id: stringField(objectSource, 'id') ?? `${category}-${slug}`,
        lang: langForFile(filePath),
        slug,
        title,
        date: stringField(objectSource, 'date'),
        url,
        category,
        outlet: outletForFile(filePath),
        filePath,
        assetPaths: [
          ...stringFields(objectSource, 'src'),
          ...stringFields(objectSource, 'thumbSrc'),
          ...stringFields(objectSource, 'imageSrc'),
        ].filter((assetPath) => assetPath.startsWith('/archive/')),
      }
    })
  })
}

export function routeForEntry(entry, lang = 'tr') {
  const paths = {
    tr: {
      columns: '/tr/kose-yazilari',
      analyses: '/tr/analizler',
      interviews: '/tr/soylesiler',
      academic: '/tr/akademik-makaleler',
    },
    en: {
      columns: '/columns',
      analyses: '/analyses',
      interviews: '/interviews',
      academic: '/academic-articles',
    },
  }
  return `${paths[lang][entry.category]}/${entry.slug}`
}
