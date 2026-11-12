import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { FlatArchivePage, NewsstandArchivePage } from '../src/components/archive'
import { content } from '../src/content'
import { makeItem } from './helpers'

const outlet = (name: string, titles: string[], year: number, scans: boolean[] = []) => ({
  outlet: name,
  items: titles.map((title, i) =>
    makeItem(
      {
        title,
        date: `${i + 1} Ocak ${year}`,
        url: `https://example.org/${name}-${i}`,
        ...(scans[i] ? { clippings: [{ src: `/archive/x-${name}-${i}.webp` }] } : {}),
      },
      { outlet: name, outletKey: name.toLowerCase() },
    ),
  ),
})

function newsstand(outlets: ReturnType<typeof outlet>[]) {
  render(
    <MemoryRouter initialEntries={['/kose-yazilari']}>
      <NewsstandArchivePage lang="tr" data={{ ...content.tr.columns, outlets }} />
    </MemoryRouter>,
  )
}

describe('newsstand', () => {
  /* A reader arriving at 660 columns was shown a three-piece paper because
     it was the newest. */
  it('opens the paper with the most pieces, not the newest', async () => {
    newsstand([outlet('Yeni', ['Yeni yazı'], 2026), outlet('Büyük', ['Bir', 'İki', 'Üç'], 2010)])
    expect(await screen.findByText('Üç')).toBeTruthy()
    expect(screen.queryByText('Yeni yazı')).toBeNull()
  })
  it('leaves out a label every row would repeat', async () => {
    newsstand([outlet('Tek', ['Bir', 'İki'], 2010)])
    await screen.findByText('Bir')
    expect(document.querySelectorAll('.newsstand-toc-row-section')).toHaveLength(0)
    expect(document.querySelectorAll('.archive-row-badge-scan')).toHaveLength(0)
  })
  it('marks the scanned rows where a paper mixes scans and text', async () => {
    newsstand([outlet('Karışık', ['Metin', 'Tarama'], 2010, [false, true])])
    await screen.findByText('Metin')
    expect(document.querySelectorAll('.archive-row-badge-scan')).toHaveLength(1)
  })
})

describe('flat list', () => {
  it('shows the year range without a Filtreler button', async () => {
    render(
      <MemoryRouter initialEntries={['/soylesiler']}>
        <FlatArchivePage
          lang="tr"
          data={{ ...content.tr.interviews!, items: outlet('S', ['Söyleşi'], 2010).items }}
        />
      </MemoryRouter>,
    )
    await screen.findByText('Söyleşi')
    expect(document.querySelector('.archive-filter-toggle')).toBeNull()
    expect(document.querySelectorAll('.date-range input')).toHaveLength(2)
  })
})
