import { useEffect, useId, useRef, useState } from 'react'
import { translationLabels, type BookTranslation } from '../bookForewords'
import type { Book, Lang } from '../content'

type Block =
  | { kind: 'chapter'; text: string; id: string }
  | { kind: 'section'; text: string }
  | { kind: 'rule' }
  | { kind: 'para'; text: string }

/** The Markdown scripts/import-book-translation.mjs writes uses only `#`
 *  chapters, `##` sections and plain paragraphs, so this reads exactly that
 *  rather than pulling in a Markdown library. */
function parseBook(md: string): Block[] {
  return md
    .split(/\n{2,}/)
    .map((raw) => raw.trim())
    .filter(Boolean)
    .map((text, i): Block => {
      if (text.startsWith('## ')) return { kind: 'section', text: text.slice(3) }
      if (text.startsWith('# ')) return { kind: 'chapter', text: text.slice(2), id: `ch-${i}` }
      if (/^[*—–-]+$/.test(text)) return { kind: 'rule' }
      return { kind: 'para', text }
    })
}

/* One fetch per text per visit: reopening the dialog reuses it. */
const cache = new Map<string, Promise<Block[]>>()
function loadBook(url: string): Promise<Block[]> {
  let pending = cache.get(url)
  if (!pending) {
    pending = fetch(url).then((res) => {
      if (!res.ok) throw new Error(`${res.status} ${url}`)
      return res.text().then(parseBook)
    })
    pending.catch(() => cache.delete(url))
    cache.set(url, pending)
  }
  return pending
}

/** A book's full translation in the same native modal <dialog> and sheet as
 *  BookForewordDialog, with a chapter list and the PDF alongside. */
export function BookTranslationDialog({
  book,
  lang,
  onClose,
}: {
  book: Book | null
  lang: Lang
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const translation: BookTranslation | undefined = book?.translation
  const [state, setState] = useState<
    { url: string; blocks: Block[] } | { url: string; failed: true } | null
  >(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (book && !dialog.open) dialog.showModal()
    if (!book && dialog.open) dialog.close()
  }, [book])

  const textUrl = translation?.textUrl
  useEffect(() => {
    if (!textUrl) return
    let live = true
    loadBook(textUrl).then(
      (blocks) => live && setState({ url: textUrl, blocks }),
      () => live && setState({ url: textUrl, failed: true }),
    )
    return () => {
      live = false
    }
  }, [textUrl])

  const labels = translation && translationLabels(translation, lang)
  const current = state && state.url === textUrl ? state : null
  const blocks = current && 'blocks' in current ? current.blocks : null
  const chapters = blocks?.filter((b) => b.kind === 'chapter') ?? []

  const jumpTo = (id: string) => {
    const body = bodyRef.current
    const target = body?.querySelector<HTMLElement>(`#${id}`)
    if (!body || !target) return
    // The sheet scrolls, not the page; `instant` because the site sets
    // smooth scrolling on <html> and a long jump should not animate.
    body.scrollTo({ top: target.offsetTop - body.offsetTop, behavior: 'instant' })
    target.focus({ preventScroll: true })
  }

  return (
    <dialog
      ref={ref}
      className="foreword-dialog translation-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
    >
      {book && translation && labels && (
        <div className="foreword-sheet">
          <header className="foreword-head">
            <div className="foreword-heading">
              <p className="foreword-book">
                <em lang="tr">{book.title}</em> · {labels.kicker}
              </p>
              <h2 id={titleId} className="foreword-title" lang={translation.lang}>
                {translation.title}
              </h2>
              <p className="foreword-note">{labels.credit}</p>
              <div className="translation-tools">
                <a
                  className="book-buy"
                  href={translation.pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${labels.pdf} ${
                    lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
                  }`}
                >
                  <span className="book-buy-label">{labels.pdf}</span>
                  <span
                    className="material-symbols-outlined"
                    aria-hidden="true"
                    style={{ fontSize: 'var(--icon-sm)' }}
                  >
                    picture_as_pdf
                  </span>
                </a>
                {chapters.length > 0 && (
                  <label className="translation-contents">
                    <span>{labels.contents}</span>
                    <select
                      value=""
                      onChange={(event) => {
                        if (event.target.value) jumpTo(event.target.value)
                      }}
                    >
                      <option value="">—</option>
                      {chapters.map((c) =>
                        c.kind === 'chapter' ? (
                          <option key={c.id} value={c.id} lang={translation.lang}>
                            {c.text}
                          </option>
                        ) : null,
                      )}
                    </select>
                  </label>
                )}
              </div>
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
          <div ref={bodyRef} className="foreword-body prose" lang={translation.lang}>
            {current && 'failed' in current ? (
              <p>
                {labels.failed}{' '}
                <a href={translation.pdfUrl} target="_blank" rel="noreferrer">
                  {labels.pdf}
                </a>
              </p>
            ) : !blocks ? (
              <p className="translation-loading" role="status">
                {labels.loading}
              </p>
            ) : (
              blocks.map((block, i) =>
                block.kind === 'chapter' ? (
                  <h3 key={i} id={block.id} tabIndex={-1} className="translation-chapter">
                    {block.text}
                  </h3>
                ) : block.kind === 'section' ? (
                  <h4 key={i} className="translation-section">
                    {block.text}
                  </h4>
                ) : block.kind === 'rule' ? (
                  <hr key={i} className="translation-rule" />
                ) : (
                  <p key={i}>{block.text}</p>
                ),
              )
            )}
          </div>
        </div>
      )}
    </dialog>
  )
}
