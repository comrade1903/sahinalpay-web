import { useState } from 'react'
import type { Lang } from '../../content'

/**
 * The archive's search box.
 *
 * The query itself lives in the URL (`?q=`), which is what makes a search
 * shareable and survivable across a reload. But react-router applies a
 * `setSearchParams` call on its own schedule, and an input that renders the
 * URL's value directly is rewound by React to that value on every keystroke
 * that arrives before the update is committed — the characters in between are
 * simply lost. Each keystroke here takes 11–22 ms to come back on a fast
 * machine, and far longer on a phone re-rendering a 574-row list, which is
 * when someone typing a whole word loses the middle of it.
 *
 * So the field keeps its own copy of what has been typed and renders that.
 * Every keystroke still goes straight up to the URL, so filtering and sharing
 * are unchanged. A value arriving from outside — clearing the filters, the
 * back button — is adopted, unless it is only the URL catching up with a word
 * already in progress.
 */
export function ArchiveSearchField({
  lang,
  value,
  onChange,
}: {
  lang: Lang
  value: string
  onChange: (value: string) => void
}) {
  const [typed, setTyped] = useState(value)
  const [seen, setSeen] = useState(value)
  /** The last keystroke sent up, until the URL reports it back. */
  const [awaiting, setAwaiting] = useState<string | null>(null)

  if (seen !== value) {
    setSeen(value)
    if (awaiting === value) {
      setAwaiting(null)
    } else if (awaiting === null) {
      setTyped(value)
    }
  }

  return (
    <div className="search-field">
      <span className="material-symbols-outlined" aria-hidden="true">
        search
      </span>
      <input
        type="text"
        value={typed}
        onChange={(event) => {
          const next = event.target.value
          setTyped(next)
          setAwaiting(next === value ? null : next)
          onChange(next)
        }}
        placeholder={lang === 'tr' ? 'Ara…' : 'Search…'}
        aria-label={lang === 'tr' ? 'Arşivde ara' : 'Search archive'}
      />
    </div>
  )
}
