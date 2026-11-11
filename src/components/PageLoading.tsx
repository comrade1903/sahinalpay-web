import type { Lang } from '../content'

/** What <main> holds for the moment between a click and the arrival of the
 *  new page's code — usually a few milliseconds from cache. It is the same
 *  box the archive loading state uses but without a line of text, so a fast
 *  load does not flash a message; `aria-busy` tells assistive technology the
 *  region is about to change. `lang` keeps the region's language right. */
export function PageLoading({ lang }: { lang: Lang }) {
  return <section className="section section-solo archive-loading" aria-busy="true" lang={lang} />
}
