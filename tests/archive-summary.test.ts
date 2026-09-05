import { describe, expect, it } from 'vitest'
import { archiveSummary } from '../src/archive/summary.generated'
import { archiveData, allArchiveItems } from '../src/archive/index'

/* The home page reads these numbers instead of importing the whole archive
   index, so the generated file has to keep agreeing with the archive it was
   generated from. `npm run validate:content` enforces the same thing in CI;
   this catches it in a second, locally. */
describe('generated archive summary', () => {
  it('matches the archive’s section counts', () => {
    expect(archiveSummary.counts).toEqual({
      columns: {
        tr: archiveData.columns.tr.reduce((sum, group) => sum + group.items.length, 0),
        en: archiveData.columns.en.reduce((sum, group) => sum + group.items.length, 0),
      },
      analyses: archiveData.analyses.reduce((sum, group) => sum + group.items.length, 0),
      interviews: archiveData.interviews.length,
      academic: archiveData.academicArticles.length,
    })
  })

  it('covers every outlet that has dated material, plus the academic row', () => {
    const outletNames = archiveSummary.coverage
      .map((band) => band.outlet)
      .filter((name): name is string => Boolean(name))
    for (const group of [...archiveData.columns.tr, ...archiveData.columns.en]) {
      if (!group.items.some((item) => item.date)) continue
      expect(outletNames).toContain(group.outlet)
    }
    expect(archiveSummary.coverage.some((band) => band.academic)).toBe(true)
  })

  it('gives every band a year range in order', () => {
    for (const band of archiveSummary.coverage) {
      expect(band.from).toBeLessThanOrEqual(band.to)
      expect(band.count).toBeGreaterThan(0)
      expect(band.from).toBeGreaterThan(1940)
    }
  })

  it('draws the weekly-pick pool only from items that really have full text', () => {
    const items = allArchiveItems()
    const pool = [...archiveSummary.pickPool.tr, ...archiveSummary.pickPool.en]
    expect(pool.length).toBeGreaterThan(0)
    for (const seed of pool) {
      const item = items.find((entry) => entry.id === seed.id)
      expect(item, `pick ${seed.slug} is not in the archive`).toBeDefined()
      expect(item?.hasBody || item?.body?.length).toBeTruthy()
      expect(seed.title).toBe(item?.title)
      expect(seed.slug).toBe(item?.slug)
    }
  })

  it('holds every full-text piece the home page could pick', () => {
    const eligible = allArchiveItems().filter(
      (item) =>
        item.hasBody &&
        (item.category === 'columns' ||
          (item.category === 'analyses' && item.lang === 'tr')),
    )
    expect(archiveSummary.pickPool.tr.length + archiveSummary.pickPool.en.length).toBe(
      eligible.length,
    )
  })
})
