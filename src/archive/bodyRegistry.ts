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
}

/** A `hasBody` item whose outlet has no registered loader, or whose slug is
 *  missing from the loaded body map. Both mean the archive data and the
 *  registry drifted apart — a build-time bug, not a network condition — so
 *  they surface as real errors instead of resolving to `undefined` and
 *  leaving the reader stuck on "loading". `npm run validate:content` fails
 *  on either condition, so this should never reach production. */
export class MissingArticleBodyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'MissingArticleBodyError'
  }
}

const bodyMapPromises = new Map<string, Promise<BodyMap>>()
const resolvedBodyCache = new Map<string, string[]>()

function bodyCacheKey(item: ArchiveItem): string {
  return `${item.lang}:${item.id}`
}

function loaderKey(category: ArchiveCategory, outletKey: string): string {
  return `${category}:${outletKey}`
}

function loadBodyMap(category: ArchiveCategory, outletKey: string): Promise<BodyMap> {
  const key = loaderKey(category, outletKey)
  const loader = bodyLoaders[key]
  if (!loader) {
    return Promise.reject(
      new MissingArticleBodyError(`No body loader registered for "${key}"`),
    )
  }
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
      const first = groupItems[0]
      if (!first) return
      const bodyMap = await loadBodyMap(first.category, first.outletKey)
      for (const item of groupItems) {
        const body = bodyMap[item.slug]
        if (body) resolvedBodyCache.set(bodyCacheKey(item), body)
      }
    }),
  )
}

/** Resolves the item's full body text, or rejects. Never resolves to
 *  `undefined` for a `hasBody` item: a silent miss is indistinguishable from
 *  a slow network to the reader, which is what used to hang the page. */
export async function loadArticleBody(item: ArchiveItem): Promise<string[]> {
  if (item.body?.length) return item.body
  await loadOutletBodies([item])
  const body = resolvedBodyCache.get(bodyCacheKey(item))
  if (!body) {
    throw new MissingArticleBodyError(
      `No body text for "${item.slug}" in ${item.category}:${item.outletKey}`,
    )
  }
  return body
}

export function getCachedBody(item: ArchiveItem): string[] | undefined {
  return resolvedBodyCache.get(bodyCacheKey(item))
}
