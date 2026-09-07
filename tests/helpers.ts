import type { ArchiveItem, ArchiveItemSeed } from '../src/archive/types'
import { normalizeArchiveItems } from '../src/archive/utils'

/** Builds a normalized ArchiveItem the same way src/archive/index.ts does,
 *  so tests exercise the real id/slug derivation rather than a stand-in. */
export function makeItem(
  seed: ArchiveItemSeed,
  overrides: Partial<Pick<ArchiveItem, 'lang' | 'outlet' | 'outletKey' | 'category'>> = {},
): ArchiveItem {
  const {
    lang = 'tr',
    outlet = 'Test',
    outletKey = 'test',
    category = 'columns',
  } = overrides
  return normalizeArchiveItems(outlet, outletKey, category, [seed], lang)[0]!
}
