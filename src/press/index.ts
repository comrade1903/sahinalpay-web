import { turkishPressSeeds } from './turkish'
import { foreignPressSeeds } from './foreign'
import { normalizePressItems } from './utils'
import type { PressItem } from './types'

export const turkishPress: PressItem[] = normalizePressItems('turkish', turkishPressSeeds)
export const foreignPress: PressItem[] = normalizePressItems('foreign', foreignPressSeeds)

export const allPressItems: PressItem[] = [...turkishPress, ...foreignPress]

export function findPressItem(slug: string): PressItem | undefined {
  return allPressItems.find((item) => item.slug === slug)
}

export type { PressItem, PressItemSeed, PressList } from './types'
