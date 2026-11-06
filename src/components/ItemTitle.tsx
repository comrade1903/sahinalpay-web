import type { DisplayItem } from '../archive/display'

/** A record's title as a page shows it: the title itself, marked up in its
 *  own language when that differs from the page's, followed on an English
 *  page, on the line below, by the English rendering of a Turkish title in brackets — the way a
 *  bibliography gives a translated title. The brackets say it is ours, not
 *  the author's. */
export function ItemTitle({ item, pageLang }: { item: DisplayItem; pageLang: string }) {
  if (!item.titleTranslation) return <>{item.title}</>
  return (
    <>
      <span lang={item.lang === pageLang ? undefined : item.lang}>{item.title}</span>{' '}
      <span className="title-translation" lang="en">
        [{item.titleTranslation}]
      </span>
    </>
  )
}
