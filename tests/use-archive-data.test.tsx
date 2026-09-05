import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { act } from 'react'

/** Stand-in for the real archive chunk, so the test controls whether the
 *  dynamic import succeeds. */
const fakeArchive = {
  columns: { tr: [], en: [] },
  analyses: [],
  interviews: [],
  academicArticles: [],
}

let importAttempts = 0
let failNextImports = 0

beforeEach(() => {
  importAttempts = 0
  failNextImports = 0
  vi.resetModules()
})

afterEach(() => {
  vi.restoreAllMocks()
})

/* The hook's own module is re-imported per test so its module-level promise
   cache starts empty, and `import('./index')` is intercepted so we can make
   the chunk fetch fail the way a dropped connection would. */
async function loadHook() {
  vi.doMock('../src/archive/index', () => {
    importAttempts += 1
    if (failNextImports > 0) {
      failNextImports -= 1
      return Promise.reject(new Error('Failed to fetch dynamically imported module'))
    }
    return Promise.resolve({ archiveData: fakeArchive })
  })
  return import('../src/archive/useArchiveData')
}

function Probe({ useArchiveData }: { useArchiveData: () => { status: string; data: unknown; reload: () => void } }) {
  const { status, reload } = useArchiveData()
  return (
    <div>
      <span data-testid="status">{status}</span>
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

  it('fetches the chunk once for many simultaneous consumers', async () => {
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
