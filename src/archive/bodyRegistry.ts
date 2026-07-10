import type { ArchiveCategory, ArchiveItem } from './types'

type BodyMap = Record<string, string[]>
type BodyLoader = () => Promise<BodyMap>

/** One entry per split outlet, keyed by `${category}:${outletKey}`.
    Add an entry here once an outlet has been split by
    scripts/split-archive-body.mjs (see Task 5 for the first one, P24).

    Language is part of the resolved-body cache key, so equal slugs in
    Turkish and English remain isolated. */
const bodyLoaders: Record<string, BodyLoader> = {
  'columns:p24': () => import('./tr/columns/p24.body').then((m) => m.p24Bodies),
  'columns:zaman': () => import('./tr/columns/zaman.body').then((m) => m.zamanBodies),
  'columns:todays-zaman': () =>
    import('./en/columns/todays-zaman.body').then((m) => m.todaysZamanBodies),
}

const bodyMapPromises = new Map<string, Promise<BodyMap>>()
const resolvedBodyCache = new Map<string, string[]>()

function bodyCacheKey(item: ArchiveItem): string {
  return `${item.lang}:${item.id}`
}

function loaderKey(category: ArchiveCategory, outletKey: string): string {
  return `${category}:${outletKey}`
}

function loadBodyMap(category: ArchiveCategory, outletKey: string): Promise<BodyMap> | undefined {
  const key = loaderKey(category, outletKey)
  const loader = bodyLoaders[key]
  if (!loader) return undefined
  let pending = bodyMapPromises.get(key)
  if (!pending) {
    pending = loader().catch((error) => {
      bodyMapPromises.delete(key)
      throw error
    })
    bodyMapPromises.set(key, pending)
  }
  return pending
}

/** Loads (and caches) body text for every item in `items` that has
 *  `hasBody` set, grouped by outlet so each outlet's body module is
 *  fetched at most once. Safe to call repeatedly — already-cached items
 *  are skipped, and outlets with no registered loader are ignored. */
export async function loadOutletBodies(items: ArchiveItem[]): Promise<void> {
  const pending = items.filter(
    (item) => item.hasBody && !resolvedBodyCache.has(bodyCacheKey(item)),
  )
  const groups = new Map<string, ArchiveItem[]>()
  for (const item of pending) {
    const key = loaderKey(item.category, item.outletKey)
    const group = groups.get(key)
    if (group) group.push(item)
    else groups.set(key, [item])
  }
  await Promise.all(
    [...groups.values()].map(async (groupItems) => {
      const [first] = groupItems
      const bodyMap = await loadBodyMap(first.category, first.outletKey)
      if (!bodyMap) return
      for (const item of groupItems) {
        const body = bodyMap[item.slug]
        if (body) resolvedBodyCache.set(bodyCacheKey(item), body)
      }
    }),
  )
}

export async function loadArticleBody(item: ArchiveItem): Promise<string[] | undefined> {
  await loadOutletBodies([item])
  return resolvedBodyCache.get(bodyCacheKey(item))
}

export function getCachedBody(item: ArchiveItem): string[] | undefined {
  return resolvedBodyCache.get(bodyCacheKey(item))
}
