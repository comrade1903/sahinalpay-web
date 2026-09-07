import { useCallback, useEffect, useState } from 'react'
import type { ArchiveLang, LanguageArchive } from './types'

export type ArchiveData = LanguageArchive

export type ArchiveDataStatus = 'loading' | 'ready' | 'error'

export interface ArchiveDataState {
  status: ArchiveDataStatus
  /** Non-null exactly when `status === 'ready'`. */
  data: ArchiveData | null
  /** Re-runs the dynamic import after a failure. */
  reload: () => void
}

/* One chunk per language rather than one for the whole archive: a page only
   ever renders one language's records, and the English metadata is a fifth of
   the total. The home page loads neither — it reads the generated summary. */
const loaders: Record<ArchiveLang, () => Promise<LanguageArchive>> = {
  tr: () => import('./tr').then((module) => module.trArchive),
  en: () => import('./en').then((module) => module.enArchive),
}

const pending: Partial<Record<ArchiveLang, Promise<LanguageArchive>>> = {}

/** Shared across every hook instance so a language's chunk is fetched once —
 *  but a rejected promise is dropped rather than memoised, otherwise one
 *  flaky network response would pin every archive screen to "loading" for the
 *  rest of the session. */
function loadArchiveData(lang: ArchiveLang): Promise<LanguageArchive> {
  pending[lang] ??= loaders[lang]().catch((error: unknown) => {
    delete pending[lang]
    throw error
  })
  return pending[lang]
}

export function useArchiveData(lang: ArchiveLang): ArchiveDataState {
  const [state, setState] = useState<{ status: ArchiveDataStatus; data: ArchiveData | null }>(
    { status: 'loading', data: null },
  )
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null })
    loadArchiveData(lang).then(
      (data) => {
        if (active) setState({ status: 'ready', data })
      },
      (error: unknown) => {
        if (!active) return
        console.error(`Failed to load the ${lang} archive`, error)
        setState({ status: 'error', data: null })
      },
    )
    return () => {
      active = false
    }
  }, [lang, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { status: state.status, data: state.data, reload }
}
