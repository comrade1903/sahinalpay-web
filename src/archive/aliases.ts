import type { ArchiveLang } from './types'

/**
 * Retired slugs that must keep resolving.
 *
 * The archive is cited: a URL that once pointed at a piece has to keep
 * pointing at it, even after the piece's title is corrected or its source
 * link changes. Slugs are derived (explicit `slug`, else the source URL's
 * last segment, else the slugified title — see archive/utils.ts), so a
 * correction to either can silently move a permalink.
 *
 * The rule for a future change: give the record an explicit `slug` fixed at
 * its current value so it stops being derived, then add the old slug here if
 * it ever does have to change. Nothing has been retired yet, which is why the
 * table is empty — it exists so the next rename has somewhere to go instead
 * of breaking a citation.
 *
 * An alias is served two ways, and both matter. `scripts/prerender.mjs` reads
 * this table and emits a `redirects` entry into dist/vercel-redirects.json, so
 * a direct hit on the old address gets a real 308 from the CDN rather than the
 * 404 an unprerendered path would otherwise produce. `resolveArchiveSlug`
 * below then covers navigation inside the running app.
 *
 * `npm run validate:content` checks that every alias points at a real record
 * and that no alias collides with a live slug, and `npm run verify:prerender`
 * checks that each one really produced a redirect.
 */
export const archiveSlugAliases: Record<ArchiveLang, Record<string, string>> = {
  tr: {},
  en: {},
}

/** Resolves a requested slug to the current one, or returns it unchanged. */
export function resolveArchiveSlug(lang: ArchiveLang, slug: string): string {
  return archiveSlugAliases[lang][slug] ?? slug
}

/** True when the slug is a retired alias rather than a current permalink —
 *  the reader redirects instead of rendering, so the canonical URL stays
 *  single. */
export function isRetiredSlug(lang: ArchiveLang, slug: string): boolean {
  return slug in archiveSlugAliases[lang]
}
