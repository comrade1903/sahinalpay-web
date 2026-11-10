import { useLocation } from 'react-router-dom'
import { content, type Lang } from '../content'
import { paths } from '../routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../lib/seo'
import { aboutJsonLd } from '../lib/structuredData'
import NarrativeBody from './NarrativeBody'

export default function AboutPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const location = useLocation()
  const metaDescription = t.about.lead || t.about.sections[0]?.paragraphs[0] || t.about.title
  usePageMeta({
    title: `${t.about.title} — Şahin Alpay`,
    description: metaDescription,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'about',
    aboutJsonLd({
      name: t.about.title,
      description: metaDescription,
      lang,
      url: pageUrl(paths[lang].about!),
    }),
  )
  return <NarrativeBody lang={lang} copy={t.about} className="bio-story-about" />
}
