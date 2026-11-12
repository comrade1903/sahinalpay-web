import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { NewsstandArchivePage } from '../src/components/archive'
import { content } from '../src/content'
import { makeItem } from './helpers'

const outlet = (name: string, titles: string[], year = 2010) => ({
  outlet: name,
  items: titles.map((title, i) =>
    makeItem(
      { title, date: `${i + 1} Ocak ${year}`, url: `https://example.org/${name}-${i}` },
      { outlet: name, outletKey: name.toLowerCase() },
    ),
  ),
})

function open(query: string) {
  render(
    <MemoryRouter initialEntries={[`/kose-yazilari${query}`]}>
      <NewsstandArchivePage
        lang="tr"
        data={{ ...content.tr.columns, outlets: [outlet('Zaman', ['Ermeni sorunu', 'Seçim sistemi'])] }}
        foreignOutlets={[outlet('Todays', ['Ermeni açılımı'], 2012)]}
      />
    </MemoryRouter>,
  )
}

describe('columns search', () => {
  /* "19 yazı" used to list one: the rest sat behind the other newspapers. */
  it('lists matches from every newspaper together, newest first', async () => {
    open('?q=ermeni')
    expect(await screen.findByText('Ermeni sorunu')).toBeTruthy()
    expect(screen.getByText('Ermeni açılımı')).toBeTruthy()
    expect(screen.queryByText('Seçim sistemi')).toBeNull()
    expect(document.querySelector('.newsstand-stack-paper')).toBeNull()
    const titles = [...document.querySelectorAll('.archive-row-title')].map((t) => t.textContent)
    expect(titles[0]).toContain('Ermeni açılımı')
  })
  it('names the newspaper on each row', async () => {
    open('?q=ermeni')
    await screen.findByText('Ermeni sorunu')
    const outlets = [...document.querySelectorAll('.archive-row-outlet')].map((o) => o.textContent)
    expect(outlets).toEqual(['Todays', 'Zaman'])
  })
  it('lists a year range on its own too', async () => {
    open('?from=2012')
    expect(await screen.findByText('Ermeni açılımı')).toBeTruthy()
    expect(document.querySelector('.newsstand-stack-paper')).toBeNull()
  })
  it('says so when nothing matches', async () => {
    open('?q=yokboyle')
    expect(await screen.findByText('Aramayla eşleşen yazı yok.')).toBeTruthy()
  })
  it('keeps the newsstand when nothing is being searched', async () => {
    open('?open=Zaman')
    expect(await screen.findByText('Seçim sistemi')).toBeTruthy()
    expect(document.querySelector('.newsstand-stack-paper')).not.toBeNull()
  })
})
