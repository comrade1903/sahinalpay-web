import { describe, expect, it } from 'vitest'
import { photoStoryEntries, visiblePhotoStoryEntries } from '../src/photoStory'

describe('photo story', () => {
  it('keeps a hidden entry in the record but off the page', () => {
    const hidden = photoStoryEntries.filter((entry) => entry.hidden)
    expect(hidden.map((entry) => entry.photos[0]!.id)).toEqual(['029'])
    for (const entry of hidden) expect(visiblePhotoStoryEntries).not.toContain(entry)
    expect(visiblePhotoStoryEntries).toHaveLength(photoStoryEntries.length - hidden.length)
  })
})
