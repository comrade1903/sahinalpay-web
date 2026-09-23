import type { ReactNode } from 'react'
import type { Lang } from '../content'
import { AuthorAvatar } from './AuthorAvatar'
import { Reveal } from './Reveal'

/* ------------------------------------------------------------------
   The opening every long first-person page shares: his portrait and the
   page title in a sticky aside, with that page's own opening text beside
   it, and a jump-to-section control when the page is long enough to need
   one. About, 15 Temmuz Yargılanma Sürecim and Basında Hakkımda all render through
   this, so they read as one section of the site rather than three
   separate designs.
------------------------------------------------------------------ */

export interface NarrativeJumpTarget {
  id: string
  title: string
}

/** A "list of values" rather than a link list: at 47 sections the Trial
 *  Process page's contents ran longer than the text beside it. Styled like
 *  the archive's own sort control, and it jumps on choice — the anchor is a
 *  hash, so the browser scrolls (and honours prefers-reduced-motion) itself. */
function JumpToSection({
  lang,
  contentsLabel,
  targets,
}: {
  lang: Lang
  contentsLabel: string
  targets: NarrativeJumpTarget[]
}) {
  return (
    <nav className="bio-contents" aria-label={contentsLabel}>
      <label className="bio-contents-label" htmlFor="bio-contents-select">
        {contentsLabel}
      </label>
      <select
        id="bio-contents-select"
        className="sort-select bio-contents-select"
        defaultValue=""
        onChange={(e) => {
          const id = e.target.value
          if (id) window.location.hash = id
        }}
      >
        <option value="" disabled>
          {lang === 'tr' ? 'Bir bölüm seçin' : 'Choose a section'}
        </option>
        {targets.map((target) => (
          <option key={target.id} value={target.id}>
            {target.title}
          </option>
        ))}
      </select>
    </nav>
  )
}

export function NarrativeHeader({
  lang,
  title,
  subtitle,
  contentsLabel,
  jumpTargets,
  children,
}: {
  lang: Lang
  title: string
  subtitle: string
  contentsLabel: string
  /** Empty on a page too short to need jumping around. */
  jumpTargets: NarrativeJumpTarget[]
  /** The page's opening text, which sits beside the title. */
  children: ReactNode
}) {
  return (
    <section className="section section-solo" id="top">
      <div className="container bio-grid">
        <Reveal className="bio-aside">
          <AuthorAvatar className="about-avatar" />
          <h1 className="section-title">{title}</h1>
          {subtitle && <p className="bio-subtitle">{subtitle}</p>}
        </Reveal>

        <Reveal className="prose" delay={0.1}>
          {children}
          {jumpTargets.length > 1 && (
            <JumpToSection lang={lang} contentsLabel={contentsLabel} targets={jumpTargets} />
          )}
        </Reveal>
      </div>
    </section>
  )
}

/** Fixed to the side of a page long enough that scrolling back by hand is a
 *  chore. Pairs with the `id="top"` the header above carries. */
export function BackToTop({ lang }: { lang: Lang }) {
  return (
    <a href="#top" className="back-to-top">
      {lang === 'tr' ? 'Başa dön ↑' : 'Back to top ↑'}
    </a>
  )
}
