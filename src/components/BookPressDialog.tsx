import { useEffect, useId, useRef } from 'react'
import type { Book, Lang } from '../content'
import { bookPressLabels } from '../bookPress'

function formatDate(iso: string, lang: Lang): string {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(Date.UTC(year!, month! - 1, day!)).toLocaleDateString(
    lang === 'tr' ? 'tr-TR' : 'en-GB',
    { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' },
  )
}

/** What others wrote about a book, as a list of links in a modal <dialog> —
 *  the same native element and sheet as BookForewordDialog. */
export function BookPressDialog({
  book,
  lang,
  onClose,
}: {
  book: Book | null
  lang: Lang
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (book && !dialog.open) dialog.showModal()
    if (!book && dialog.open) dialog.close()
  }, [book])

  const newTab = lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
  return (
    <dialog
      ref={ref}
      className="foreword-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      {book?.press && (
        <div className="foreword-sheet">
          <header className="foreword-head">
            <div className="foreword-heading">
              <p className="foreword-book">
                <em lang="tr">{book.title}</em> · {book.year}
              </p>
              <h2 id={titleId} className="foreword-title">
                {bookPressLabels[lang].title}
              </h2>
            </div>
            <button
              type="button"
              className="foreword-close"
              onClick={() => ref.current?.close()}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
              {lang === 'tr' ? 'Kapat' : 'Close'}
            </button>
          </header>
          <div className="foreword-body">
            <ul className="book-press-list">
              {book.press.map((entry) => (
                <li key={entry.url} className="book-press-item">
                  <a
                    href={entry.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${entry.title ?? `${entry.author}, ${entry.outlet}`} ${newTab}`}
                  >
                    <span className="book-press-title" lang="tr">
                      {entry.title ?? entry.author}
                    </span>
                    <span className="book-press-meta">
                      {[entry.title ? entry.author : null, entry.outlet, entry.date && formatDate(entry.date, lang)]
                        .filter(Boolean)
                        .join(' · ')}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </dialog>
  )
}
