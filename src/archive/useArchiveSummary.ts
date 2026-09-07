import { useCallback, useEffect, useState } from 'react'
import type { ArchiveSummary } from './summary.generated'

export type { ArchiveSummary, CoverageBand, PickSeed } from './summary.generated'

export interface ArchiveSummaryState {
  status: 'loading' | 'ready' | 'error'
  data: ArchiveSummary | null
  reload: () => void
}

let summaryPromise: Promise<ArchiveSummary> | null = null

function loadSummary(): Promise<ArchiveSummary> {
  summaryPromise ??= import('./summary.generated')
    .then((module) => module.archiveSummary)
    .catch((error: unknown) => {
      summaryPromise = null
      throw error
    })
  return summaryPromise
}

/** The home page's view of the archive: section counts, coverage bands and
 *  the weekly-pick pool. A few kilobytes, against the ~468 kB of full record
 *  metadata the page used to pull in to show four numbers. */
export function useArchiveSummary(): ArchiveSummaryState {
  const [state, setState] = useState<{
    status: ArchiveSummaryState['status']
    data: ArchiveSummary | null
  }>({ status: 'loading', data: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState((previous) =>
      previous.status === 'ready' ? previous : { status: 'loading', data: null },
    )
    loadSummary().then(
      (data) => {
        if (active) setState({ status: 'ready', data })
      },
      (error: unknown) => {
        if (!active) return
        console.error('Failed to load the archive summary', error)
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
