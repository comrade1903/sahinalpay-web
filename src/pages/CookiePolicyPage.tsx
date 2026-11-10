import { useLocation } from 'react-router-dom'
import { content, type Lang } from '../content'
import { pageAlternates, usePageMeta } from '../lib/seo'

export default function CookiePolicyPage({ lang }: { lang: Lang }) {
  const t = content[lang].cookiePolicy
  const location = useLocation()
  usePageMeta({
    title: `${t.title} — Şahin Alpay`,
    description: t.intro,
    alternates: pageAlternates(location.pathname),
  })
  return (
    <section className="section section-solo">
      <div className="container container-narrow">
        <p className="kicker">{t.kicker}</p>
        <h1 className="section-title">{t.title}</h1>
        <div className="prose">
          <p className="lead">{t.intro}</p>
          {t.sections.map((section) => (
            <div key={section.heading} className="policy-block">
              <h2>{section.heading}</h2>
              {section.body.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
