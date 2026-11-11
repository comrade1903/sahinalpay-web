import { Navigate } from 'react-router-dom'
import { content, type Lang } from '../content'
import { FlatArchivePage, NewsstandArchivePage } from '../components/archive'
import { useArchiveGate } from '../components/useArchiveGate'
import { paths, type PageKey } from '../routes'

/* Every section lists the other language's records under their own heading,
   so a reader looking for a piece never has to switch language to find it.
   This is also what replaced the English explainer pages for analyses,
   interviews and academic articles: those sections are almost all Turkish, so
   the English page used to be a title and a button pointing across. It now
   shows the records themselves, each opening on its own language's page. */
export default function ArchiveRoutePage({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  const { data: archiveData, foreign, fallback } = useArchiveGate(lang)
  const t = content[lang]

  if (!archiveData || !foreign) return fallback

  switch (pageKey) {
    case 'columns':
      return (
        <NewsstandArchivePage
          data={{ ...t.columns, outlets: archiveData.columns }}
          foreignOutlets={foreign.columns}
          lang={lang}
        />
      )
    case 'analyses':
      return t.analyses ? (
        <NewsstandArchivePage
          data={{ ...t.analyses, outlets: archiveData.analyses }}
          foreignOutlets={foreign.analyses}
          lang={lang}
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'interviews':
      return t.interviews ? (
        <FlatArchivePage
          data={{ ...t.interviews, items: archiveData.interviews }}
          foreignItems={foreign.interviews}
          lang={lang}
          noun="interview"
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    case 'academic':
      return t.academicArticles ? (
        <FlatArchivePage
          data={{ ...t.academicArticles, items: archiveData.academicArticles }}
          foreignItems={foreign.academicArticles}
          lang={lang}
          noun="article"
        />
      ) : (
        <Navigate to={paths[lang].home!} replace />
      )
    default:
      return <Navigate to={paths[lang].home!} replace />
  }
}
