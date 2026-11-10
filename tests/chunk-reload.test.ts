import { afterEach, describe, expect, it, vi } from 'vitest'
import { CHUNK_RELOAD_KEY, installStaleChunkReload, shouldReloadForStaleChunk } from '../src/lib/chunkReload'

describe('shouldReloadForStaleChunk', () => {
  const now = 1_800_000_000_000
  it('reloads the first time', () => expect(shouldReloadForStaleChunk(now, null)).toBe(true))
  it('reloads again after a minute', () =>
    expect(shouldReloadForStaleChunk(now, String(now - 61_000))).toBe(true))
  /* A chunk that is really gone must not loop: the second failure falls
     through to the error screen. */
  it('does not reload twice in a row', () =>
    expect(shouldReloadForStaleChunk(now, String(now - 5_000))).toBe(false))
  it('treats an unreadable timestamp as never', () =>
    expect(shouldReloadForStaleChunk(now, 'x')).toBe(true))
})

describe('installStaleChunkReload', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    window.history.replaceState(null, '')
  })

  const fail = () => {
    const event = new Event('vite:preloadError', { cancelable: true })
    window.dispatchEvent(event)
    return event
  }

  it('reloads once, then lets the second failure through, and stores nothing', () => {
    const reload = vi.fn()
    vi.spyOn(window, 'location', 'get').mockReturnValue({ ...window.location, reload } as Location)
    window.history.replaceState({ idx: 3 }, '')
    installStaleChunkReload()

    expect(fail().defaultPrevented).toBe(true)
    expect(reload).toHaveBeenCalledTimes(1)
    /* The router's own state on this entry is kept. */
    expect(window.history.state.idx).toBe(3)
    expect(typeof window.history.state[CHUNK_RELOAD_KEY]).toBe('string')

    expect(fail().defaultPrevented).toBe(false)
    expect(reload).toHaveBeenCalledTimes(1)

    expect(window.sessionStorage.length).toBe(0)
    expect(window.localStorage.length).toBe(0)
  })
})
