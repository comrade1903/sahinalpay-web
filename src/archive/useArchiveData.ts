import { useCallback, useEffect, useState } from 'react'
import type { ArchiveLang, LanguageArchive } from './types'

export type ArchiveData = LanguageArchive

export type ArchiveDataStatus = 'loading' | 'ready' | 'error'

export interface ArchiveDataState {
  status: ArchiveDataStatus
  /** The page language's records. Non-null exactly when `status === 'ready'`. */
  data: ArchiveData | null
  /** The other language's records, listed on the same pages under their own
   *  heading so a reader does not have to switch language to find a piece.
   *  Non-null exactly when `status === 'ready'`. */
  foreign: ArchiveData | null
  /** Re-runs the dynamic imports after a failure. */
  reload: () => void
}

const other: Record<ArchiveLang, ArchiveLang> = { tr: 'en', en: 'tr' }

/* Still one chunk per language rather than one for the whole archive. Every
   section page now needs both, because each lists the other language's
   records too, but keeping them apart means the two arrive in parallel and
   the English chunk — a fifth of the total — is still all a reader pays for
   when only it has changed. The home page loads neither: it reads the
   generated summary. */
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
  const [state, setState] = useState<{
    status: ArchiveDataStatus
    data: ArchiveData | null
    foreign: ArchiveData | null
  }>({ status: 'loading', data: null, foreign: null })
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    let active = true
    setState({ status: 'loading', data: null, foreign: null })
    /* Both or neither. A page that rendered its own language and then popped
       the other one in underneath would move the ground under a reader who
       had already started down the list. */
    Promise.all([loadArchiveData(lang), loadArchiveData(other[lang])]).then(
      ([data, foreign]) => {
        if (active) setState({ status: 'ready', data, foreign })
      },
      (error: unknown) => {
        if (!active) return
        console.error(`Failed to load the archive for ${lang}`, error)
        setState({ status: 'error', data: null, foreign: null })
      },
    )
    return () => {
      active = false
    }
  }, [lang, attempt])

  const reload = useCallback(() => setAttempt((value) => value + 1), [])

  return { status: state.status, data: state.data, foreign: state.foreign, reload }
}
