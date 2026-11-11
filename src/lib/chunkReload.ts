/**
 * Recovers from a script that an update has replaced.
 *
 * Script files carry a hash in their name. A reader who opened the site
 * before a deploy still holds the old names; the first page they visit that
 * needs a script not yet downloaded asks for a file that no longer exists.
 * Reloading the page fetches the new names. One reload only: a script that is
 * really missing must fall through to the error screen rather than loop.
 *
 * The time of the last reload is kept in this history entry's state, which
 * survives a reload. It is deliberately not written to browser storage: the
 * cookie policy lists everything the site stores, and this is not a
 * preference.
 */

export const CHUNK_RELOAD_KEY = 'chunk-reload-at'

const RELOAD_COOLDOWN_MS = 60_000

/** True when a failed script load should trigger a full reload: never reloaded
 *  from this entry, or the last reload was more than a minute ago. */
export function shouldReloadForStaleChunk(now: number, lastReloadAt: string | null): boolean {
  const last = Number(lastReloadAt)
  if (lastReloadAt === null || !Number.isFinite(last)) return true
  return now - last > RELOAD_COOLDOWN_MS
}

function readLastReload(): string | null {
  try {
    const state: unknown = window.history.state
    if (state && typeof state === 'object' && CHUNK_RELOAD_KEY in state) {
      const value = (state as Record<string, unknown>)[CHUNK_RELOAD_KEY]
      return typeof value === 'string' ? value : null
    }
  } catch {
    /* Unreadable state counts as "never reloaded". */
  }
  return null
}

function recordReload(now: number): boolean {
  try {
    const state: unknown = window.history.state
    window.history.replaceState(
      { ...(state && typeof state === 'object' ? state : {}), [CHUNK_RELOAD_KEY]: String(now) },
      '',
    )
    return true
  } catch {
    /* If the time cannot be recorded, a reload could not be told from a
       loop — so do not reload at all. */
    return false
  }
}

/** Listens for Vite's `vite:preloadError`; when allowed, records the time,
 *  calls event.preventDefault() and reloads the page. */
export function installStaleChunkReload(): void {
  window.addEventListener('vite:preloadError', (event) => {
    const now = Date.now()
    if (!shouldReloadForStaleChunk(now, readLastReload())) return
    if (!recordReload(now)) return
    event.preventDefault()
    window.location.reload()
  })
}
