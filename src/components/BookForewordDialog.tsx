import { useEffect, useId, useRef } from 'react'
import type { Book, Lang } from '../content'

/** A book's foreword in a modal <dialog>. The native element supplies the top
 *  layer, focus containment, Escape to close and focus return to the opener;
 *  this component only opens it, closes it on the button or a backdrop click,
 *  and reports the close back so the page can clear its state. */
export function BookForewordDialog({
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

  const foreword = book?.foreword
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
      {book && foreword && (
        <div className="foreword-sheet">
          <header className="foreword-head">
            <div className="foreword-heading">
              <p className="foreword-book">
                <em lang="tr">{book.title}</em> · {book.year}
              </p>
              <h2 id={titleId} className="foreword-title">
                {lang === 'tr' ? 'Önsöz' : 'Foreword'}
              </h2>
              {lang === 'en' && <p className="foreword-note">In Turkish, as published in the book.</p>}
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
          <div className="foreword-body prose" lang="tr">
            {foreword.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </dialog>
  )
}
