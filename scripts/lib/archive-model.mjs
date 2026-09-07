/**
 * The archive as the app sees it, plus the derived facts the content tools
 * need (route, whether a piece has its own reader page, which files it
 * references on disk).
 *
 * Everything here comes from the real modules under src/archive and from
 * src/routes.ts, so a rule can only be stated once. The previous version of
 * this file re-implemented the seed parser with regexes and kept its own copy
 * of the route table; comparing the two showed 103 field mismatches on the
 * current archive — five titles truncated at an escaped apostrophe (one
 * reduced to a lone backslash) and 97 records with the wrong outlet name.
 */
import { loadArchive, loadModule } from './load-archive.mjs'

let routesModule = null
let registryModule = null

async function routes() {
  routesModule ??= await loadModule('src/routes.ts', 'routes.mjs')
  return routesModule
}

async function bodyRegistry() {
  registryModule ??= await loadModule('src/archive/bodyRegistry.ts', 'body-registry.mjs')
  return registryModule
}

/** Scanned newspaper pages only — a 'photo' clipping is a lead image.
 *  Mirrors itemScanClippings() in src/archive/itemUtils.ts. */
export function scanClippings(item) {
  return (item.clippings ?? []).filter((clipping) => clipping.kind !== 'photo')
}

/** Mirrors archiveLink() in src/App.tsx: only these pieces are linked to
 *  their own reader route. Anything else is linked straight out to its
 *  source, so putting its slug in the sitemap would advertise a URL the site
 *  itself never links. */
export function hasInternalPage(item) {
  return Boolean(item.hasBody || item.body?.length || scanClippings(item).length > 0)
}

/** Every public asset path a record points at, for the on-disk check. */
export function assetPaths(item) {
  const paths = [
    item.imageSrc,
    item.pdfSrc,
    ...(item.clippings ?? []).flatMap((clipping) => [clipping.src, clipping.thumbSrc]),
  ]
  return paths.filter((value) => typeof value === 'string' && value.startsWith('/archive/'))
}

/** Section route for a piece in a given language — read from src/routes.ts
 *  rather than a second copy of the path table. */
export async function sectionPath(category, lang) {
  const { paths } = await routes()
  const key = category === 'academic' ? 'academic' : category
  return paths[lang][key] ?? paths[lang].columns
}

export async function routeForItem(item) {
  return `${await sectionPath(item.category, item.lang)}/${item.slug}`
}

/** Flat list of every archive item, with the derived facts attached. */
export async function readArchiveItems() {
  const archive = await loadArchive()
  const items = archive.allArchiveItems()
  return Promise.all(
    items.map(async (item) => ({
      ...item,
      internal: hasInternalPage(item),
      assetPaths: assetPaths(item),
      route: await routeForItem(item),
    })),
  )
}

/** Resolves full body text for a `hasBody` item through the real registry,
 *  so validation exercises the same loader the reader uses. */
export async function resolveBody(item) {
  if (item.body?.length) return item.body
  if (!item.hasBody) return undefined
  const registry = await bodyRegistry()
  return registry.loadArticleBody(item)
}

export { loadModule }
