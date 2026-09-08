import type { ReactNode } from 'react'
import type { Lang } from '../content'
import { useArchiveData, type ArchiveData } from '../archive/useArchiveData'
import { ArchiveLoadFailure, ArchiveLoading } from './ArchiveGate'

/** Renders loading / failure screens for the three pages that cannot show
 *  anything at all without the archive, and hands `data` to the caller once
 *  it is there. */
export function useArchiveGate(lang: Lang): {
  data: ArchiveData | null
  foreign: ArchiveData | null
  fallback: ReactNode
} {
  const { status, data, foreign, reload } = useArchiveData(lang)
  if (status === 'error') {
    return { data: null, foreign: null, fallback: <ArchiveLoadFailure lang={lang} onRetry={reload} /> }
  }
  if (!data || !foreign) return { data: null, foreign: null, fallback: <ArchiveLoading lang={lang} /> }
  return { data, foreign, fallback: null }
}
