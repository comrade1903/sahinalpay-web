import { Link } from 'react-router-dom'
import { content, type Lang } from '../content'
import { paths } from '../routes'
import { Reveal } from './Reveal'

/* Shown instead of silently redirecting home. A citation that resolves to
   the wrong page with no warning is worse for the record than an honest
   dead end. */
export function DeadEnd({
  lang,
  title,
  body,
  searchTerm,
}: {
  lang: Lang
  title: string
  body: string
  searchTerm?: string
}) {
  const t = content[lang]
  const columnsPath = paths[lang].columns!
  return (
    <section className="section section-solo">
      <div className="container container-narrow">
        <Reveal>
          <p className="kicker">{t.notFound.kicker}</p>
          <h1 className="section-title">{title}</h1>
          <p className="lead">{body}</p>
          <div className="hero-actions">
            <Link
              className="btn btn-primary"
              to={
                searchTerm
                  ? `${columnsPath}?q=${encodeURIComponent(searchTerm)}`
                  : columnsPath
              }
            >
              {t.notFound.browseArchive}
            </Link>
            <Link className="btn btn-ghost" to={paths[lang].home!}>
              {t.notFound.backHome}
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
