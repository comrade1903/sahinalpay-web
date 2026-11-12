import { useLocation } from 'react-router-dom'
import { content, type Lang } from '../content'
import { paths } from '../routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../lib/seo'
import { aboutJsonLd } from '../lib/structuredData'
import { trialSections } from '../trialCopy'
import NarrativeBody from './NarrativeBody'

/** The case brought against Şahin Alpay after the 2016 coup attempt. The
 *  Turkish page is his own full account — courtroom statements and the
 *  Constitutional Court's and ECHR's rulings, transferred verbatim from his
 *  own document; the English page is a short factual summary rather than a
 *  translation of that record (see the note on `trial` in routes.ts). */
export default function TrialProcessPage({ lang }: { lang: Lang }) {
  const t = content[lang]
  const location = useLocation()
  const trial = { ...t.trialProcess!, sections: trialSections[lang] }
  const metaDescription = trial.lead || trial.sections[0]?.paragraphs[0] || trial.title
  usePageMeta({
    title: `${trial.title} — Şahin Alpay`,
    description: metaDescription,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'trial',
    aboutJsonLd({
      name: trial.title,
      description: metaDescription,
      lang,
      url: pageUrl(paths[lang].trial!),
    }),
  )
  return <NarrativeBody lang={lang} copy={trial} />
}
