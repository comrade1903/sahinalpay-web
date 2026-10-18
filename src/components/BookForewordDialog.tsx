import { useEffect, useId, useRef } from 'react'
import { forewordLabels, type BookForeword } from '../bookForewords'
import type { Book, Lang } from '../content'

/** A book's foreword in a modal <dialog>. The native element supplies the top
 *  layer, focus containment, Escape to close and focus return to the opener;
 *  this component only opens it, closes it on the button or a backdrop click,
 *  and reports the close back so the page can clear its state. */
export function BookForewordDialog({
  open,
  lang,
  onClose,
}: {
  open: { book: Book; foreword: BookForeword } | null
  lang: Lang
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const book = open?.book
  const foreword = open?.foreword
  const labels = foreword && forewordLabels(foreword, lang)
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
      {book && foreword && labels && (
        <div className="foreword-sheet">
          <header className="foreword-head">
            <div className="foreword-heading">
              <p className="foreword-book">
                <em lang="tr">{book.title}</em> · {book.year}
              </p>
              <h2 id={titleId} className="foreword-title">
                {labels.title}
              </h2>
              {labels.note && <p className="foreword-note">{labels.note}</p>}
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
