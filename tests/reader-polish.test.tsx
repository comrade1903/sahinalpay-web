import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'

async function open(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  await waitFor(() => expect(document.querySelector('.article-byline')).not.toBeNull(), { timeout: 15000 })
}

/* "1915 tabusu" carries the subtitle "Milliyet, 3. Göz, 30 Eylül 2000", which
   the byline and the scan's caption used to repeat as "30 Eylül 2000 · Milliyet". */
describe('the article page', () => {
  it('does not show the date twice when the subtitle carries it', async () => {
    await open('/kose-yazilari/1915-tabusu')
    const time = document.querySelector('.article-byline time')!
    expect(time.className).toBe('sr-only')
    expect(time.getAttribute('dateTime')).toBe('2000-09-30')
    expect(document.querySelector('.article-byline-text')!.textContent).not.toMatch(/·/)
  })

  it('links each tag to its section searched for that tag', async () => {
    await open('/kose-yazilari/1915-tabusu')
    const tag = [...document.querySelectorAll<HTMLAnchorElement>('a.tag')].find(
      (link) => link.textContent === 'Ermeni tehciri',
    )!
    expect(tag.getAttribute('href')).toBe('/kose-yazilari?q=Ermeni%20tehciri')
  })

  it('names the cite button in visible text', async () => {
    await open('/kose-yazilari/1915-tabusu')
    const button = document.querySelector('.icon-btn-labelled')!
    expect(button.textContent).toContain('Künyeyi kopyala')
    expect(button.hasAttribute('title')).toBe(false)
  })

  it('gives tags a 44px target', () => {
    const css = readFileSync('src/index.css', 'utf8')
    expect(css).toMatch(/\.tag \{[^}]*min-height: var\(--control-hit-size\)/)
  })
})
