import { describe, expect, it } from 'vitest'
import { allArchiveItems } from '../src/archive'
import { enAcademicArticleSeeds } from '../src/archive/en/academic'
import { academicArticleSeeds as trAcademicArticleSeeds } from '../src/archive/tr/academic'

describe('hidden archive records', () => {
  it('keeps a hidden seed in the record but out of the archive', () => {
    const seeds = [...trAcademicArticleSeeds, ...enAcademicArticleSeeds]
    const hidden = seeds.filter((seed) => seed.hidden)
    expect(hidden.length).toBeGreaterThan(0)
    const slugs = new Set(allArchiveItems().map((item) => item.slug))
    for (const seed of hidden) expect(slugs.has(seed.slug!)).toBe(false)
  })
})
