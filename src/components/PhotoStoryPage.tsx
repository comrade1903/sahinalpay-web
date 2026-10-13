import { useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { content, type Lang } from '../content'
import { paths } from '../routes'
import { pageAlternates, pageUrl, usePageMeta, useJsonLd } from '../lib/seo'
import { aboutJsonLd } from '../lib/structuredData'
import { photoSrc, photoStoryEntries, type PhotoStoryPhoto } from '../photoStory'
import { ImageLightbox, type LightboxImage } from './ImageLightbox'
import { Reveal } from './Reveal'

/** The caption's own emphasis: **bold** as he set it, *italic* for the
 *  publication names. Anything else is plain text. */
function renderCaption(caption: string): ReactNode[] {
  return caption.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>
    return part
  })
}

function Photo({
  photo,
  enlargeLabel,
  pair,
  onOpen,
}: {
  photo: PhotoStoryPhoto
  enlargeLabel: string
  pair: boolean
  onOpen: () => void
}) {
  /* A pair shares the column, so each photo is drawn at half the width a
     single one gets; `sizes` tells the browser which file that needs. */
  const sizes = pair
    ? '(max-width: 768px) 46vw, 560px'
    : '(max-width: 768px) calc(100vw - 2rem), 620px'
  return (
    <button
      type="button"
      className="photo-story-frame"
      aria-haspopup="dialog"
      aria-label={enlargeLabel}
      onClick={onOpen}
      /* In a pair, each frame grows in proportion to its photo's aspect
         ratio, so a portrait and a landscape print come out the same
         height instead of the same width. */
      {...(pair ? { style: { flexGrow: photo.width / photo.height } } : {})}
    >
      <img
        src={photoSrc(photo.id, 800)}
        srcSet={`${photoSrc(photo.id, 800)} 800w, ${photoSrc(photo.id, 1600)} 1600w`}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={photo.alt ?? ''}
        loading="lazy"
        decoding="async"
      />
    </button>
  )
}

/* Every photograph in story order, each carrying its entry's caption, so the
   lightbox can step through the whole story; a pair's two photos share one. */
const gallery: LightboxImage[] = photoStoryEntries.flatMap((entry) =>
  entry.photos.map((photo) => ({
    src: photoSrc(photo.id, 1600),
    srcSet: `${photoSrc(photo.id, 800)} 800w, ${photoSrc(photo.id, 1600)} 1600w`,
    width: photo.width,
    height: photo.height,
    alt: photo.alt ?? '',
    caption: renderCaption(entry.caption),
    captionLang: 'tr' as const,
  })),
)
const galleryIndex = new Map(
  photoStoryEntries.flatMap((entry) => entry.photos).map((photo, i) => [photo.id, i]),
)

/** "Fotoğraflarla Hikayem": his photographs and captions in his own order,
 *  photo and caption side by side and alternating sides down the page,
 *  collapsing to photo-above-caption on a phone. Both language pages show
 *  the same Turkish captions; see src/photoStory.ts. */
export function PhotoStoryPage({ lang }: { lang: Lang }) {
  const location = useLocation()
  const copy = content[lang].photoStory
  const [open, setOpen] = useState<number | null>(null)
  usePageMeta({
    title: `${copy.title} — Şahin Alpay`,
    description: copy.description,
    alternates: pageAlternates(location.pathname),
  })
  useJsonLd(
    'photos',
    aboutJsonLd({
      name: copy.title,
      description: copy.description,
      lang,
      url: pageUrl(paths[lang].photos!),
    }),
  )
  return (
    <section className="section section-solo">
      <div className="container">
        <Reveal>
          <p className="kicker">{copy.kicker}</p>
          <h1 className="section-title">{copy.title}</h1>
          {copy.captionNote && <p className="photo-story-note">{copy.captionNote}</p>}
        </Reveal>

        <ol className="photo-story" lang="tr">
          {photoStoryEntries.map((entry) => {
            const pair = entry.photos.length > 1
            return (
              <li key={entry.photos[0]!.id} className="photo-story-entry">
                <Reveal>
                  <figure className={pair ? 'photo-story-figure photo-story-figure-pair' : 'photo-story-figure'}>
                    <div className={pair ? 'photo-story-media photo-story-pair' : 'photo-story-media'}>
                      {entry.photos.map((photo) => (
                        <Photo
                          key={photo.id}
                          photo={photo}
                          enlargeLabel={copy.enlargeLabel}
                          pair={pair}
                          onOpen={() => setOpen(galleryIndex.get(photo.id)!)}
                        />
                      ))}
                    </div>
                    <figcaption className="photo-story-caption">{renderCaption(entry.caption)}</figcaption>
                  </figure>
                </Reveal>
              </li>
            )
          })}
        </ol>
      </div>
      <ImageLightbox
        images={gallery}
        index={open}
        onIndexChange={setOpen}
        onClose={() => setOpen(null)}
        lang={lang}
      />
    </section>
  )
}
