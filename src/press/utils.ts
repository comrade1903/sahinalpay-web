import { slugify } from '../archive/utils'
import type { PressItem, PressItemSeed, PressList } from './types'

/** A piece is addressed by author + headline, falling back to author + date
 *  for the untitled ones, so every entry gets a stable, readable URL. */
export function normalizePressItems(list: PressList, seeds: PressItemSeed[]): PressItem[] {
  return seeds.map((seed) => {
    const slug = seed.slug ?? slugify(`${seed.author} ${seed.title ?? seed.date ?? ''}`)
    return { ...seed, slug, id: `press-${slug}`, list }
  })
}
