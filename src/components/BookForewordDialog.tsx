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
  const isSummary = foreword?.kind === 'summary'
  const textLang = foreword?.lang ?? 'tr'
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
                {isSummary ? (lang === 'tr' ? 'Türkçe Özet' : 'Summary') : lang === 'tr' ? 'Önsöz' : 'Foreword'}
              </h2>
              {lang === 'en' && textLang === 'tr' && (
                <p className="foreword-note">In Turkish, as published in the book.</p>
              )}
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
          <div className="foreword-body prose" lang={textLang}>
            {foreword.heading && <p className="foreword-doc-title">{foreword.heading}</p>}
            {foreword.paragraphs.map((block, i) =>
              typeof block === 'string' ? (
                <p key={i}>{block}</p>
              ) : 'heading' in block ? (
                <h3 key={i}>{block.heading}</h3>
              ) : (
                <ul key={i}>
                  {block.list.map((item, j) => (
                    <li key={j}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
