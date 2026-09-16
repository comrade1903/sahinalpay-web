import { Link, useLocation, useParams } from 'react-router-dom'
import { content, type Lang } from '../../content'
import { paths } from '../../routes'
import { pageAlternates, pageUrl, usePageMeta } from '../../lib/seo'
import { Reveal } from '../Reveal'
import { DeadEnd } from '../DeadEnd'
import { foreignPress, turkishPress, findPressItem } from '../../press'
import type { PressItem } from '../../press/types'

/** The pieces themselves are Turkish, so their reader pages exist only under
 *  /tr — the English list links straight into them, the same rule the archive
 *  uses for a Turkish column shown on /columns. */
function pressItemPath(item: PressItem): string {
  return `${paths.tr.press!}/${item.slug}`
}

function PressRow({ item }: { item: PressItem }) {
  return (
    <li>
      <Link to={pressItemPath(item)} className="archive-row">
        <div className="archive-row-meta">
          {item.date && <span className="archive-row-date">{item.date}</span>}
          <span className="archive-row-outlet press-row-outlet">{item.outlet}</span>
        </div>
        <div className="archive-row-body">
          <h3 className="archive-row-title">{item.title ?? item.author}</h3>
          <p className="archive-row-excerpt">{item.author}</p>
        </div>
        <span className="archive-row-arrow material-symbols-outlined" aria-hidden="true">
          arrow_forward
        </span>
      </Link>
    </li>
  )
}

/* Both lists sit inside the page's single <section>, the way the archive's
   own list pages do: a section per list gave each one a full band of
   vertical padding and left the page mostly gaps. */
function PressList({ label, items }: { label: string; items: PressItem[] }) {
  if (items.length === 0) return null
  return (
    <>
      <Reveal>
        <h2 className="press-list-title">{label}</h2>
      </Reveal>
      <ul className="archive-list">
        {items.map((item) => (
          <PressRow key={item.id} item={item} />
        ))}
      </ul>
    </>
  )
}

export function PressPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const copy = t.press!
  const location = useLocation()
  usePageMeta({
    title: `${copy.title} — Şahin Alpay`,
    description: copy.subtitle,
    alternates: pageAlternates(location.pathname),
  })

  return (
    <section className="section section-solo">
      <div className="container">
          <Reveal>
            <p className="kicker">{copy.kicker}</p>
            <h1 className="section-title">{copy.title}</h1>
            <p className="archive-intro">{copy.subtitle}</p>
          </Reveal>
          <Reveal className="press-intro" delay={0.1}>
            <p>{copy.intro}</p>
            {/* His friend's tally of the Swedish coverage, exactly as it
                stands in the manuscript — including the total, which is the
                figure he gives rather than the sum of the rows. */}
            <dl className="press-tally">
              {copy.tallyRows.map((row) => (
                <div className="press-tally-row" key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
              <div className="press-tally-row press-tally-total">
                <dt>{copy.tallyTotalLabel}</dt>
                <dd>{copy.tallyTotalValue}</dd>
              </div>
            </dl>
            <p>{copy.outro}</p>
          </Reveal>

          <PressList label={copy.turkishLabel} items={turkishPress} />
          <PressList label={copy.foreignLabel} items={foreignPress} />
      </div>
    </section>
  )
}

export function PressArticlePage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const copy = t.press!
  const { slug } = useParams()
  const location = useLocation()
  const item = slug ? findPressItem(slug) : undefined
  const heading = item?.title ?? item?.author ?? copy.title

  usePageMeta({
    title: `${heading} — ${copy.title} — Şahin Alpay`,
    description: item ? `${item.author} · ${item.outlet}${item.date ? ` · ${item.date}` : ''}` : copy.subtitle,
    alternates: item ? { tr: pageUrl(pressItemPath(item)) } : pageAlternates(location.pathname),
  })

  if (!item) {
    return (
      <DeadEnd
        lang={lang}
        title={t.notFound.missingTitle}
        body={t.notFound.missingBody}
        {...(slug ? { searchTerm: slug.replace(/-/g, ' ') } : {})}
      />
    )
  }

  return (
    <section className="section section-solo article-page">
      <div className="container container-narrow">
        <Reveal>
          <nav className="breadcrumb" aria-label={lang === 'tr' ? 'Kırıntı yolu' : 'Breadcrumb'}>
            <Link to={paths[lang].home!}>{lang === 'tr' ? 'Ana sayfa' : 'Home'}</Link>
            <span aria-hidden="true">/</span>
            <Link to={paths[lang].press!}>{copy.backLabel}</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{heading}</span>
          </nav>
          <div className="article-tools">
            <Link className="back-link" to={paths[lang].press!}>
              <span
                className="material-symbols-outlined"
                aria-hidden="true"
                style={{ fontSize: 'var(--icon-md)' }}
              >
                arrow_back
              </span>
              {copy.backLabel}
            </Link>
          </div>
          <h1 className="section-title">{heading}</h1>
          <p className="press-byline">
            {item.author} · {item.outlet}
            {item.date ? ` · ${item.date}` : ''}
          </p>
        </Reveal>

        <Reveal className="prose article-body" delay={0.1}>
          {item.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {/* Only where the manuscript itself records the address. Most of
              these pieces carry none, and none is invented. */}
          {item.url && (
            <p className="press-source">
              {copy.sourceLinkLabel}:{' '}
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                {item.url}
              </a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  )
}
