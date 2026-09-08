import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'

/** Stand-in for the real archive chunk, so the test controls whether the
 *  dynamic import succeeds. */
const fakeArchive = {
  columns: [],
  analyses: [],
  interviews: [],
  academicArticles: [],
}

let importAttempts = 0
let failNextImports = 0
let failForeignImport = false

beforeEach(() => {
  importAttempts = 0
  failNextImports = 0
  failForeignImport = false
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

/* The hook's own module is re-imported per test so its module-level promise
   cache starts empty, and the Turkish archive chunk's import is intercepted so
   we can make it fail the way a dropped connection would. */
async function loadHook() {
  vi.doMock('../src/archive/tr', () => {
    importAttempts += 1
    if (failNextImports > 0) {
      failNextImports -= 1
      return Promise.reject(new Error('Failed to fetch dynamically imported module'))
    }
    return Promise.resolve({ trArchive: fakeArchive })
  })
  /* Every page now loads the other language's chunk as well, to list it under
     its own heading, so the foreign import is a failure mode of its own. */
  vi.doMock('../src/archive/en', () => {
    if (failForeignImport) {
      return Promise.reject(new Error('Failed to fetch dynamically imported module'))
    }
    return Promise.resolve({ enArchive: fakeArchive })
  })
  return import('../src/archive/useArchiveData')
}

function Probe({
  useArchiveData,
}: {
  useArchiveData: (lang: 'tr' | 'en') => {
    status: string
    data: unknown
    foreign: unknown
    reload: () => void
  }
}) {
  const { status, foreign, reload } = useArchiveData('tr')
  return (
    <div>
      <span data-testid="status">{status}</span>
      <span data-testid="foreign">{foreign ? 'present' : 'absent'}</span>
      <button type="button" onClick={reload}>
        retry
      </button>
    </div>
  )
}

describe('useArchiveData', () => {
  it('reaches "ready" when the chunk loads', async () => {
    const { useArchiveData } = await loadHook()
    render(<Probe useArchiveData={useArchiveData} />)
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('ready'))
  })

  /* The regression: the module-level promise used to memoise the rejection,
     so one failed fetch left every archive screen loading forever. */
  it('reports "error" instead of loading forever when the chunk fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    failNextImports = 1
    const { useArchiveData } = await loadHook()
    render(<Probe useArchiveData={useArchiveData} />)
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('error'))
  })

  it('recovers on retry after a transient failure', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    failNextImports = 1
    const { useArchiveData } = await loadHook()
    render(<Probe useArchiveData={useArchiveData} />)
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('error'))

    await act(async () => {
      screen.getByRole('button', { name: 'retry' }).click()
    })
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('ready'))
    expect(importAttempts).toBeGreaterThan(1)
  })

  it('hands over the other language too, not just the page\'s own', async () => {
    const { useArchiveData } = await loadHook()
    render(<Probe useArchiveData={useArchiveData} />)
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('ready'))
    expect(screen.getByTestId('foreign').textContent).toBe('present')
  })

  /* Both or neither: a page that reported "ready" with the foreign chunk
     missing would quietly drop a whole section of the archive rather than
     say anything went wrong. */
  it('reports "error" when only the other language\'s chunk fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    failForeignImport = true
    const { useArchiveData } = await loadHook()
    render(<Probe useArchiveData={useArchiveData} />)
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('error'))
    expect(screen.getByTestId('foreign').textContent).toBe('absent')
  })

  it('fetches a language chunk once for many simultaneous consumers', async () => {
    const { useArchiveData } = await loadHook()
    render(
      <>
        <Probe useArchiveData={useArchiveData} />
        <Probe useArchiveData={useArchiveData} />
        <Probe useArchiveData={useArchiveData} />
      </>,
    )
    await waitFor(() =>
      expect(screen.getAllByTestId('status').every((n) => n.textContent === 'ready')).toBe(
        true,
      ),
    )
    expect(importAttempts).toBe(1)
  })
})
