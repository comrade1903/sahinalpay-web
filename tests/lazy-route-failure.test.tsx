import { afterEach, describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { ErrorBoundary } from '../src/components/ErrorBoundary'

afterEach(() => {
  vi.restoreAllMocks()
  vi.doUnmock('../src/pages/BooksPage')
  window.history.pushState({}, '', '/en')
})

/* Its own file: React.lazy remembers a module once any earlier test in the
   same file has loaded it. */
describe('a page whose code cannot be loaded', () => {
  /* Offline, or a deploy replaced the file: the reader must get a way back,
     never a blank page. */
  it('shows the recovery screen', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.resetModules()
    vi.doMock('../src/pages/BooksPage', () => {
      throw new Error('chunk gone')
    })
    const { default: App } = await import('../src/App')
    // The boundary reads its language from the address bar.
    window.history.pushState({}, '', '/kitaplar')
    render(
      <ErrorBoundary>
        <MemoryRouter initialEntries={['/kitaplar']}>
          <App />
        </MemoryRouter>
      </ErrorBoundary>,
    )
    expect(await screen.findByText('Sayfayı yenile')).toBeTruthy()
  })
})
