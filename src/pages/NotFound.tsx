import { useLocation } from 'react-router-dom'
import { content } from '../content'
import { DeadEnd } from '../components/DeadEnd'
import { langForPath } from '../routes'
import { usePageMeta } from '../lib/seo'

/* One layout for both dead ends: a URL that resolves to nothing, and an article
   slug that no longer matches an entry. Both used to <Navigate> home, which hands
   the reader a 200 OK page showing the wrong thing with no signal that anything
   went wrong — worse for a citable record than an honest dead end. */
export default function NotFound() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  usePageMeta({
    title: `${t.notFound.title} — Şahin Alpay`,
    description: t.notFound.body,
    robots: 'noindex, follow',
  })
  return <DeadEnd lang={lang} title={t.notFound.title} body={t.notFound.body} />
}
