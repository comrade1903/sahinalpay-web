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
 * `npm run validate:content` checks that every alias points at a real record
 * and that no alias collides with a live slug.
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
