import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../src/App'
import { paths } from '../src/routes'
import type { Lang } from '../src/content'

const staticRoutes = (['en', 'tr'] as Lang[]).flatMap((lang) =>
  Object.entries(paths[lang]).map(([key, path]) => ({ lang, key, path: path! })),
)

async function open(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
  await waitFor(() => expect(document.querySelectorAll('h1')).toHaveLength(1), { timeout: 15000 })
  return document.querySelector('h1')!.textContent!.trim()
}

afterEach(() => vi.restoreAllMocks())

/* React's own "not wrapped in act" notice is test plumbing, not a page error. */
const realErrors = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter((call) => !String(call[0]).includes('not wrapped in act'))

describe('every route renders', () => {
  it.each(staticRoutes)('$path shows one heading and logs no error', async ({ path }) => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect((await open(path)).length).toBeGreaterThan(0)
    expect(document.title).toContain('Şahin Alpay')
    expect(realErrors(errors)).toEqual([])
  })

  it('opens a column on its own page', async () => {
    expect(await open('/tr/kose-yazilari/demokrasinin-zaferi')).toContain('Demokrasinin zaferi')
  })

  /* The English page may add a bracketed translation after the title. */
  it('opens a Turkish column under the English columns path', async () => {
    expect(await open('/columns/demokrasinin-zaferi')).toContain('Demokrasinin zaferi')
  })

  it('opens a press piece', async () => {
    expect((await open('/tr/basinda-hakkimda/ali-bayramoglu-28-temmuz-2016')).length).toBeGreaterThan(0)
  })

  it('answers an unknown address with the not-found page', async () => {
    const { content } = await import('../src/content')
    expect(await open('/tr/yok-boyle-bir-sayfa')).toBe(content.tr.notFound.title)
  })
})
