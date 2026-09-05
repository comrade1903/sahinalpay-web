import { useCallback, useEffect, useState } from 'react'

export type ArchiveData = (typeof import('./index'))['archiveData']

export type ArchiveDataStatus = 'loading' | 'ready' | 'error'

export interface ArchiveDataState {
  status: ArchiveDataStatus
  /** Non-null exactly when `status === 'ready'`. */
  data: ArchiveData | null
  /** Re-runs the dynamic import after a failure. */
  reload: () => void
}

let archivePromise: Promise<ArchiveData> | null = null

/** Shared across every hook instance so the chunk is fetched once — but a
 *  rejected promise is dropped rather than memoised, otherwise one flaky
 *  network response would pin every archive screen to "loading" for the rest
 *  of the session. */
function loadArchiveData(): Promise<ArchiveData> {
  archivePromise ??= import('./index')
    .then((module) => module.archiveData)
    .catch((error: unknown) => {
      archivePromise = null
      throw error
    })
  return archivePromise
}

export function useArchiveData(): ArchiveDataState {
  const [state, setState] = useState<{ status: ArchiveDataStatus; data: ArchiveData | null }>(
    { status: 'loading', data: null },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState((previous) =>
      previous.status === 'ready' ? previous : { status: 'loading', data: null },
    )
    loadArchiveData().then(
      (data) => {
        if (active) setState({ status: 'ready', data })
      },
      (error: unknown) => {
        if (!active) return
        console.error('Failed to load the archive index', error)
        setState({ status: 'error', data: null })
      },
    )
    return () => {
      active = false
    }
  }, [attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { status: state.status, data: state.data, reload }
}
