import { describe, expect, it } from 'vitest'
import { allPressItems, foreignPress, turkishPress, findPressItem } from '../src/press'
import { allArchiveItems } from '../src/archive/index'
import { paths } from '../src/routes'

/* "Silivri'den…" holds other people's writing about Şahin Alpay. It must stay
   outside the archive — the archive is his own work, and its counts, search
   and sitemap all speak for him. */
describe('press about him', () => {
  it('never leaks into the archive', () => {
    const archiveSlugs = new Set(allArchiveItems().map((item) => item.slug))
    for (const entry of allPressItems) {
      expect(archiveSlugs.has(entry.slug), `${entry.slug} is in the archive too`).toBe(false)
    }
  })

  it('gives every piece something to call it by, and real text', () => {
    expect(allPressItems.length).toBeGreaterThan(0)
    for (const entry of allPressItems) {
      /* Unsigned pieces (open letters, a society's appeal) carry a title
         instead of an author; one or the other has to be there. */
      expect(
        Boolean(entry.title?.trim() || entry.author?.trim()),
        `${entry.slug} has neither a title nor an author`,
      ).toBe(true)
      /* `outlet` is optional: a couple of entries name no publication, and
         an invented masthead would be worse than none. */
      if (entry.outlet !== undefined) expect(entry.outlet.trim()).not.toBe('')
      expect(entry.body.length, `${entry.slug} has no body`).toBeGreaterThan(0)
      for (const paragraph of entry.body) expect(paragraph.trim()).not.toBe('')
    }
  })

  it('addresses every piece by a unique slug', () => {
    const slugs = allPressItems.map((entry) => entry.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    for (const slug of slugs) expect(findPressItem(slug)?.slug).toBe(slug)
  })

  it('records a source URL only where one is known', () => {
    for (const entry of allPressItems) {
      if (entry.url === undefined) continue
      expect(entry.url, `${entry.slug} has an empty url`).toMatch(/^https?:\/\//)
    }
  })

  it('keeps the two lists separate and both reachable', () => {
    expect(turkishPress.every((entry) => entry.list === 'turkish')).toBe(true)
    expect(foreignPress.every((entry) => entry.list === 'foreign')).toBe(true)
    expect(paths.tr.press).toBeTruthy()
    expect(paths.en.press).toBeTruthy()
  })
})
