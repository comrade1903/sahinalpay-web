import { useParams } from 'react-router-dom'
import { useArchiveGate } from '../components/useArchiveGate'
import { hasReaderPage } from '../archive/links'
import { LoadedArticlePage } from '../components/reader'
import { TurkishItemRedirect } from './TurkishItemRedirect'

/* The English and German interviews and academic articles live at the English
   address, and a Turkish one with a reader page of its own reads there too,
   under the English interface (see readerBasePath in archive/links.ts). Any
   other slug on that path is a Turkish citation-only piece cited by its
   English URL and still goes to its Turkish address, as TurkishItemRedirect
   does for analyses. */
export default function EnglishMirroredItem({ pageKey }: { pageKey: 'interviews' | 'academic' }) {
  const { slug } = useParams<{ slug: string }>()
  const { data, foreign, fallback } = useArchiveGate('en')
  if (!data || !foreign) return fallback
  const records = (archive: typeof data) =>
    pageKey === 'interviews' ? archive.interviews : archive.academicArticles
  if (
    slug &&
    (records(data).some((item) => item.slug === slug) ||
      records(foreign).some((item) => item.slug === slug && hasReaderPage(item)))
  ) {
    return <LoadedArticlePage lang="en" archiveData={data} foreignData={foreign} />
  }
  return <TurkishItemRedirect pageKey={pageKey} />
}
