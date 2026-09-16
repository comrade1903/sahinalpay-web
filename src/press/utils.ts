import { slugify } from '../archive/utils'
import type { PressItem, PressItemSeed, PressList } from './types'

/** A piece is addressed by author + headline, falling back to whichever of
 *  the two the manuscript gives, plus the date, so every entry gets a stable
 *  and readable URL even when it is unsigned or untitled. */
export function normalizePressItems(list: PressList, seeds: PressItemSeed[]): PressItem[] {
  return seeds.map((seed) => {
    const slug =
      seed.slug ??
      slugify(
        [seed.author, seed.title, seed.author && seed.title ? '' : seed.date]
          .filter(Boolean)
          .join(' '),
      )
    return { ...seed, slug, id: `press-${slug}`, list }
  })
}
