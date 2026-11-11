import { type Lang } from '../content'
import type { NarrativeDocument } from '../trialProcess'
import { NarrativeHeader, BackToTop } from '../components/NarrativeHeader'

/** Shape shared by every long-form narrative page (About, Trial Process):
 *  a title/subtitle/lead intro beside a jump-to-section control, followed by
 *  the sections themselves. */
export interface NarrativeCopy {
  kicker: string
  title: string
  subtitle: string
  lead: string
  editorialNote: string
  contentsLabel: string
  /** `sub` marks a heading inside the main section before it. */
  sections: { id: string; title: string; sub?: boolean; paragraphs: string[]; document?: NarrativeDocument }[]
}

/** A narrative page: the shared header, then the sections themselves. The
 *  jump control and the back-to-top link appear together, once the page has
 *  enough titled sections to be worth navigating rather than scrolling.
 *  Where some sections are sub-headings (the trial record), the main ones
 *  read as part headings, the jump control lists only those, and the gaps
 *  between sections tighten (`bio-story-parts`). */
export default function NarrativeBody({
  lang,
  copy,
  className,
}: {
  lang: Lang
  copy: NarrativeCopy
  /** An extra class on the article, for one page's own adjustments. */
  className?: string
}) {
  const hasContents = copy.sections.length > 1 && copy.sections.every((section) => section.title)
  const hasParts = copy.sections.some((section) => section.sub)
  const mainSections = copy.sections.filter((section) => !section.sub)
  return (
    <>
      <NarrativeHeader
        lang={lang}
        title={copy.title}
        subtitle={copy.subtitle}
        contentsLabel={copy.contentsLabel}
        jumpTargets={hasContents ? mainSections : []}
      >
        {copy.lead || copy.editorialNote ? (
          <>
            {copy.lead && <p className="lead">{copy.lead}</p>}
            {copy.editorialNote && <p className="bio-editorial-note">{copy.editorialNote}</p>}
          </>
        ) : null}
      </NarrativeHeader>

      <article
        className={['section bio-story', hasParts && 'bio-story-parts', className].filter(Boolean).join(' ')}
        aria-label={copy.kicker}
      >
        <div className="container container-narrow prose">
          {copy.sections.map((section) => (
            <section
              className={section.sub ? 'bio-chapter bio-chapter-sub' : 'bio-chapter'}
              id={section.id}
              key={section.id}
            >
              {section.title && (section.sub ? <h3>{section.title}</h3> : <h2>{section.title}</h2>)}
              {/* Keyed by position: a statement repeats its salutation, so the
                  text alone is not unique. The list never reorders. */}
              {section.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              {section.document && (
                <p className="bio-document">
                  <a className="btn btn-ghost" href={section.document.href} target="_blank" rel="noopener noreferrer">
                    <span translate="no" className="material-symbols-outlined" aria-hidden="true">
                      picture_as_pdf
                    </span>
                    {section.document.label}
                  </a>
                </p>
              )}
            </section>
          ))}
        </div>
      </article>

      {hasContents && <BackToTop lang={lang} />}
    </>
  )
}
