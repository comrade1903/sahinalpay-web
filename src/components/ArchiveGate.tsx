import { Link } from 'react-router-dom'
import { paths } from '../routes'
import type { Lang } from '../content'

/**
 * Loading and failure states for the pages that cannot show anything at all
 * without the archive index.
 *
 * The index is a lazily fetched chunk, so a dropped connection or a stale
 * cache after a deploy can fail it. Without these the page sat on
 * "Arşiv yükleniyor…" indefinitely, with nothing to retry.
 */
export function ArchiveLoading({ lang }: { lang: Lang }) {
  return (
    <section className="section section-solo archive-loading" aria-busy="true">
      <div className="container" role="status" aria-live="polite">
        {lang === 'tr' ? 'Arşiv yükleniyor…' : 'Loading archive…'}
      </div>
    </section>
  )
}

/* The archive index is a lazily fetched chunk, so a dropped connection or a
   stale cache after a deploy can fail it. Without this the page sat on
   "Arşiv yükleniyor…" indefinitely, with nothing to retry. */
export function ArchiveLoadFailure({ lang, onRetry }: { lang: Lang; onRetry: () => void }) {
  return (
    <section className="section section-solo">
      <div className="container error-screen" role="alert">
        <p className="kicker">{lang === 'tr' ? 'Bağlantı hatası' : 'Loading failed'}</p>
        <h1 className="section-title">
          {lang === 'tr' ? 'Arşiv yüklenemedi' : 'The archive could not load'}
        </h1>
        <p className="lead">
          {lang === 'tr'
            ? 'Arşiv verisi alınamadı. Bağlantınızı kontrol edip yeniden deneyebilirsiniz.'
            : 'The archive data could not be fetched. Check your connection and try again.'}
        </p>
        <div className="error-screen-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            {lang === 'tr' ? 'Yeniden dene' : 'Try again'}
          </button>
          <Link className="btn btn-ghost" to={paths[lang].home!}>
            {lang === 'tr' ? 'Ana sayfa' : 'Home'}
          </Link>
        </div>
      </div>
    </section>
  )
}

/* The home page still has a hero, a bio and book covers without the archive,
   so a failed load is a band inside the page rather than a full takeover —
   but it must be visible, not a silently missing "Benden Seçkiler". */
export function ArchiveInlineFailure({ lang, onRetry }: { lang: Lang; onRetry: () => void }) {
  return (
    <section className="section section-solo">
      <div className="container error-screen" role="alert">
        <p className="lead">
          {lang === 'tr'
            ? 'Arşiv listesi şu anda yüklenemedi, bu yüzden sayaçlar ve seçkiler eksik görünüyor.'
            : 'The archive index could not be loaded, so the counts and picks below are missing.'}
        </p>
        <div className="error-screen-actions">
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            {lang === 'tr' ? 'Yeniden dene' : 'Try again'}
          </button>
        </div>
      </div>
    </section>
  )
}
