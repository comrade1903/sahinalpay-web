import type { ArchiveCategory, ArchiveItem } from './types'

type BodyMap = Record<string, string[]>
type BodyLoader = () => Promise<BodyMap>

/** One entry per split outlet, keyed by `${category}:${outletKey}`.
    Add an entry here once an outlet has been split by
    scripts/split-archive-body.mjs (see Task 5 for the first one, P24).

    IMPORTANT: outletKey must be globally unique per category across
    BOTH languages (archiveData.columns.tr and .en) — this key, and the
    ArchiveItem.id (`${category}-${slug}`) used as the resolved-body
    cache key, do not currently include `lang`. If an English outlet is
    added under the same category with a reused outletKey (or a slug
    that collides with a Turkish item's slug in the same category), its
    body cache entries would silently collide with the Turkish outlet's.
    Give every new outlet (in either language) its own outletKey. */
const bodyLoaders: Record<string, BodyLoader> = {
  'columns:p24': () => import('./tr/columns/p24.body').then((m) => m.p24Bodies),
}

const bodyMapPromises = new Map<string, Promise<BodyMap>>()
const resolvedBodyCache = new Map<string, string[]>()

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
  const pending = items.filter((item) => item.hasBody && !resolvedBodyCache.has(item.id))
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
        if (body) resolvedBodyCache.set(item.id, body)
      }
    }),
  )
}

export async function loadArticleBody(item: ArchiveItem): Promise<string[] | undefined> {
  await loadOutletBodies([item])
  return resolvedBodyCache.get(item.id)
}

export function getCachedBody(itemId: string): string[] | undefined {
  return resolvedBodyCache.get(itemId)
}
