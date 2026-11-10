import { readdirSync, statSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

/* Tests run from the project root. */
const kb = (path: string) => statSync(`src/assets/${path}`).size / 1024

describe('image budgets', () => {
  /* The 262 kB portrait was downloaded on every article to draw a 40px avatar. */
  it('keeps the avatar small', () => expect(kb('portrait-avatar.webp')).toBeLessThan(15))
  it('keeps the hero portrait under 140 kB', () => expect(kb('portrait.webp')).toBeLessThan(140))
  /* Covers are drawn 96px wide; they were up to 186 kB each. */
  it('keeps every cover under 30 kB', () => {
    const covers = readdirSync('src/assets/covers').filter((name) => name.endsWith('.jpg'))
    expect(covers).toHaveLength(8)
    for (const name of covers) expect(kb(`covers/${name}`), name).toBeLessThan(30)
  })
  /* The largest masthead that is already narrower than 480px (Sabah) is 46 kB. */
  it('keeps every masthead under 50 kB', () => {
    for (const name of readdirSync('src/assets/logos')) expect(kb(`logos/${name}`), name).toBeLessThan(50)
  })
  /* The full-size files stay in the repository, so a variant can always be
     made again from the original. */
  it('keeps the originals', () => {
    expect(readdirSync('src/assets/originals/covers')).toHaveLength(8)
    expect(readdirSync('src/assets/originals/logos').length).toBeGreaterThanOrEqual(10)
    expect(kb('originals/portrait.jpg')).toBeGreaterThan(200)
  })
})
