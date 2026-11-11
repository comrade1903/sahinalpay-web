import { useParams, Navigate } from 'react-router-dom'
import { paths, type PageKey } from '../routes'

/* Analyses, interviews and academic articles are almost all Turkish, but their
   English URLs are real addresses that appear in citations. Sending them to the
   homepage threw away a link that points at an article we actually have; send the
   reader to the piece itself instead. */
export function TurkishItemRedirect({ pageKey }: { pageKey: PageKey }) {
  const { slug } = useParams<{ slug: string }>()
  const base = paths.tr[pageKey]!
  return <Navigate to={slug ? `${base}/${slug}` : base} replace />
}
