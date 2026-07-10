import type { ArchiveCategory, ArchiveItem, ArchiveItemSeed, ArchiveMedium } from './types'

const TURKISH_CHAR_MAP: Record<string, string> = {
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

export function slugify(value: string): string {
  return value
    .replace(/[çÇğĞıIİöÖşŞüÜ]/g, (char) => TURKISH_CHAR_MAP[char] ?? char)
    .toLowerCase()
    .replace(/['"’“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function slugFromSourceUrl(url: string): string {
  const trimmed = url.replace(/\/$/, '')
  return trimmed.slice(trimmed.lastIndexOf('/') + 1)
}

export function normalizeArchiveItems(
  outlet: string,
  category: ArchiveCategory,
  seeds: ArchiveItemSeed[],
  medium?: ArchiveMedium,
): ArchiveItem[] {
  return seeds.map((seed) => {
    const slug = seed.slug ?? (seed.url ? slugFromSourceUrl(seed.url) : slugify(seed.title))
    return {
      ...seed,
      id: seed.id ?? `${category}-${slug}`,
      slug,
      outlet,
      category,
      medium,
    }
  })
}
