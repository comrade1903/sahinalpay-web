import { slugify } from '../archive/utils'
import type { PressItem, PressItemSeed, PressList } from './types'

/** Several of these pieces are filed under a full deck rather than a short
 *  headline, which slugifies into a 150-character URL. Cut at the last word
 *  boundary that fits instead, and give the piece an explicit `slug` when
 *  the cut lands somewhere unreadable. */
const SLUG_MAX = 72

function shorten(slug: string): string {
  if (slug.length <= SLUG_MAX) return slug
  const cut = slug.slice(0, SLUG_MAX)
  const lastBoundary = cut.lastIndexOf('-')
  return (lastBoundary > 0 ? cut.slice(0, lastBoundary) : cut).replace(/-+$/, '')
}

/** A piece is addressed by author + headline, falling back to whichever of
 *  the two the manuscript gives, plus the date, so every entry gets a stable
 *  and readable URL even when it is unsigned or untitled. */
export function normalizePressItems(list: PressList, seeds: PressItemSeed[]): PressItem[] {
  return seeds.map((seed) => {
    const slug =
      seed.slug ??
      shorten(
        slugify(
          [seed.author, seed.title, seed.author && seed.title ? '' : seed.date]
            .filter(Boolean)
            .join(' '),
        ),
      )
    return { ...seed, slug, id: `press-${slug}`, list }
  })
}
