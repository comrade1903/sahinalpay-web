import { describe, expect, it, vi, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '../src/components/ErrorBoundary'

function Boom(): never {
  throw new Error('render exploded')
}

afterEach(() => {
  vi.restoreAllMocks()
  window.history.pushState({}, '', '/')
})

describe('ErrorBoundary', () => {
  it('renders its children when nothing throws', () => {
    render(
      <ErrorBoundary>
        <p>ok</p>
      </ErrorBoundary>,
    )
    expect(screen.getByText('ok')).toBeTruthy()
  })

  /* Without a boundary a single render-time exception unmounted the whole
     tree and left a blank page with no way back. */
  it('shows a recovery screen instead of a blank page', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading').textContent).toBe('Something went wrong')
    expect(screen.getByRole('button', { name: 'Reload the page' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Back to the home page' })).toBeTruthy()
  })

  it('speaks Turkish and links to /tr on a Turkish route', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    window.history.pushState({}, '', '/tr/kose-yazilari')
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    )
    expect(screen.getByRole('heading').textContent).toBe('Bir şeyler ters gitti')
    expect(screen.getByRole('link', { name: 'Ana sayfaya dön' }).getAttribute('href')).toBe(
      '/tr',
    )
  })
})
