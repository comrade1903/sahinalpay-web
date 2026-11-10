import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { type Book, type Lang, type BooksSection } from '../content'
import { forewordLabels, translationLabels, type BookForeword } from '../bookForewords'
import { Reveal } from '../components/Reveal'
import { BookForewordDialog } from '../components/BookForewordDialog'
import { BookPressDialog } from '../components/BookPressDialog'
import { BookTranslationDialog } from '../components/BookTranslationDialog'
import { bookPressLabels } from '../bookPress'
import { paths } from '../routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../lib/seo'
import { booksJsonLd } from '../lib/structuredData'

/** Buy-button copy per retailer, keyed by hostname — pre-formatted so the
 *  Turkish ablative suffix (’dan/’tan) gets the right consonant for each
 *  name rather than being concatenated blindly. */
const RETAILER_LABELS: Record<string, { tr: string; en: string }> = {
  'kitapyurdu.com': { tr: 'Kitapyurdu’dan satın al', en: 'Buy on Kitapyurdu' },
  'nadirkitap.com': { tr: 'Nadir Kitap’tan satın al', en: 'Buy on Nadir Kitap' },
}

function buyButtonLabel(url: string, lang: Lang): string {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    const known = RETAILER_LABELS[host]
    if (known) return known[lang]
  } catch {
    /* fall through to the default below */
  }
  return lang === 'tr' ? 'Kitapyurdu’dan satın al' : 'Buy on Kitapyurdu'
}

/** Where a row should link: internally to the full-article page when we
 *  have real body text or scanned clippings to show, externally to the
 *  source otherwise. Body/clippings win over a bare `url` so a scanned
 *  piece opens its own reader page instead of jumping straight to the
 *  (often third-party, sometimes defunct) source link. */
export default function BooksPage({ data, lang }: { data: BooksSection; lang: Lang }) {
  const location = useLocation()
  const [openForeword, setOpenForeword] = useState<{ book: Book; foreword: BookForeword } | null>(null)
  const [openPress, setOpenPress] = useState<Book | null>(null)
  const [openTranslation, setOpenTranslation] = useState<Book | null>(null)
  usePageMeta({
    title: `${data.title} — Şahin Alpay`,
    description: data.intro,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'books',
    booksJsonLd({
      name: data.title,
      description: data.intro,
      lang,
      url: pageUrl(paths[lang].books!),
      books: data.books,
    }),
  )
  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{data.kicker}</p>
          <h1 className="section-title">{data.title}</h1>
        </Reveal>

        {data.externalUrl && (
          <Reveal delay={0.05} className="books-cta">
            <a
              className="btn btn-primary"
              href={data.externalUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${data.externalLabel} ${lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
                }`}
            >
              {data.externalLabel}
            </a>
          </Reveal>
        )}

        <Reveal delay={0.05}>
          <ul className="books-list">
            {data.books.map((b) => (
              <li key={`${b.year}-${b.title}`} className="book-card">
                <div className="book-cover">
                  {b.cover ? (
                    <img
                      src={b.cover}
                      alt={lang === 'tr' ? `${b.title} kapağı` : `${b.title} cover`}
                      loading="lazy"
                    />
                  ) : (
                    <span className="book-cover-placeholder" aria-hidden="true">
                      <span translate="no" className="material-symbols-outlined">menu_book</span>
                    </span>
                  )}
                </div>
                <div className="book-card-body">
                  <span className="book-year">{b.year}</span>
                  <h2 className="book-title">
                    <em lang="tr">{b.title}</em>
                  </h2>
                  <p className="book-desc">{b.desc}</p>
                  {b.translation && (
                    <p className="book-translation">
                      {translationLabels(b.translation, lang).kicker}:{' '}
                      <em lang={b.translation.lang}>{b.translation.title}</em> ·{' '}
                      {translationLabels(b.translation, lang).credit}
                    </p>
                  )}
                  <div className="book-actions">
                    {(b.forewords?.length || b.press?.length) ? (
                      <div className="book-actions-row">
                        {b.forewords?.map((foreword) => (
                          <button
                            key={foreword.lang ?? 'tr'}
                            type="button"
                            className="book-buy book-foreword-open"
                            aria-haspopup="dialog"
                            onClick={() => setOpenForeword({ book: b, foreword })}
                          >
                            <span className="book-buy-label">{forewordLabels(foreword, lang).open}</span>
                            <span translate="no"
                              className="material-symbols-outlined"
                              aria-hidden="true"
                              style={{ fontSize: 'var(--icon-sm)' }}
                            >
                              menu_book
                            </span>
                          </button>
                        ))}
                        {b.press && b.press.length > 0 && (
                          <button
                            type="button"
                            className="book-buy book-foreword-open"
                            aria-haspopup="dialog"
                            onClick={() => setOpenPress(b)}
                          >
                            <span className="book-buy-label">{bookPressLabels[lang].open}</span>
                            <span translate="no"
                              className="material-symbols-outlined"
                              aria-hidden="true"
                              style={{ fontSize: 'var(--icon-sm)' }}
                            >
                              menu_book
                            </span>
                          </button>
                        )}
                      </div>
                    ) : null}
                    {b.translation && (
                      <div className="book-actions-row">
                        <button
                          type="button"
                          className="book-buy book-foreword-open"
                          aria-haspopup="dialog"
                          onClick={() => setOpenTranslation(b)}
                        >
                          <span className="book-buy-label">{translationLabels(b.translation, lang).open}</span>
                          <span translate="no"
                            className="material-symbols-outlined"
                            aria-hidden="true"
                            style={{ fontSize: 'var(--icon-sm)' }}
                          >
                            menu_book
                          </span>
                        </button>
                        <a
                          className="book-buy"
                          href={b.translation.pdfUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${b.title}: ${translationLabels(b.translation, lang).pdf} ${lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
                            }`}
                        >
                          <span className="book-buy-label">{translationLabels(b.translation, lang).pdf}</span>
                          <span translate="no"
                            className="material-symbols-outlined"
                            aria-hidden="true"
                            style={{ fontSize: 'var(--icon-sm)' }}
                          >
                            picture_as_pdf
                          </span>
                        </a>
                      </div>
                    )}
                    {b.purchaseUrl && (
                      <div className="book-actions-row">
                        <a
                          className="book-buy"
                          href={b.purchaseUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${b.title}: ${buyButtonLabel(b.purchaseUrl, lang)} ${lang === 'tr' ? '(yeni sekmede açılır)' : '(opens in a new tab)'
                            }`}
                        >
                          <span className="book-buy-label">{buyButtonLabel(b.purchaseUrl, lang)}</span>
                          <span translate="no"
                            className="material-symbols-outlined"
                            aria-hidden="true"
                            style={{ fontSize: 'var(--icon-sm)' }}
                          >
                            arrow_forward
                          </span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
      <BookForewordDialog open={openForeword} lang={lang} onClose={() => setOpenForeword(null)} />
      <BookPressDialog book={openPress} lang={lang} onClose={() => setOpenPress(null)} />
      <BookTranslationDialog
        book={openTranslation}
        lang={lang}
        onClose={() => setOpenTranslation(null)}
      />
    </section>
  )
}
