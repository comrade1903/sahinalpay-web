import { useEffect, useId, useRef, useState, type ReactNode } from 'react'
import type { Lang } from '../content'

export interface LightboxImage {
  src: string
  srcSet?: string
  width?: number
  height?: number
  alt: string
  /** Shown under the image, the way a caption runs under a printed photo. */
  caption?: ReactNode
  /** Language of the caption text, when it differs from the page's. */
  captionLang?: Lang
}

const LABELS = {
  tr: {
    close: 'Kapat',
    prev: 'Önceki fotoğraf',
    next: 'Sonraki fotoğraf',
    zoomIn: 'Yakınlaştır',
    zoomOut: 'Ekrana sığdır',
    zoomHint: 'Yakınlaştırmak için görsele tıklayın',
    unzoomHint: 'Sığdırmak için yeniden tıklayın',
    dialog: 'Fotoğraf',
  },
  en: {
    close: 'Close',
    prev: 'Previous image',
    next: 'Next image',
    zoomIn: 'Zoom in',
    zoomOut: 'Fit to screen',
    zoomHint: 'Click the image to zoom in',
    unzoomHint: 'Click again to fit the screen',
    dialog: 'Image',
  },
} as const

/** Every image on the site opens here instead of in a new tab, so a reader
 *  never leaves the page to look at a photograph or a clipping. Like
 *  BookForewordDialog it is a native modal <dialog>: the browser supplies the
 *  top layer, focus containment, Escape to close and focus return to the
 *  opener. With more than one image, the arrow buttons and the arrow keys
 *  step through them. Clicking the image toggles between fitting the screen
 *  and its natural size, which is what makes newspaper type readable. */
export function ImageLightbox({
  images,
  index,
  onIndexChange,
  onClose,
  lang,
}: {
  images: LightboxImage[]
  index: number | null
  onIndexChange: (index: number) => void
  onClose: () => void
  lang: Lang
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const captionId = useId()
  /* Zoom belongs to the image it was set on, so stepping to the next one
     starts it fitted to the screen again. */
  const [zoomedAt, setZoomedAt] = useState<number | null>(null)
  const zoomed = index !== null && zoomedAt === index
  const labels = LABELS[lang]
  const image = index === null ? null : (images[index] ?? null)
  const many = images.length > 1

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (image && !dialog.open) dialog.showModal()
    if (!image && dialog.open) dialog.close()
  }, [image])

  const step = (delta: number) => {
    if (index === null || !many) return
    onIndexChange((index + delta + images.length) % images.length)
  }

  return (
    <dialog
      ref={ref}
      className="lightbox"
      aria-label={labels.dialog}
      {...(image?.caption ? { 'aria-describedby': captionId } : {})}
      onClose={() => {
        setZoomedAt(null)
        onClose()
      }}
      onClick={(event) => {
        // A click whose target is the <dialog> itself landed on the backdrop.
        if (event.target === event.currentTarget) event.currentTarget.close()
      }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') step(-1)
        else if (event.key === 'ArrowRight') step(1)
      }}
    >
      {image && (
        <div className="lightbox-sheet">
          <div className="lightbox-bar">
            {many && (
              <span className="lightbox-count" aria-live="polite">
                {index! + 1} / {images.length}
              </span>
            )}
            <span className="lightbox-hint" aria-hidden="true">
              {zoomed ? labels.unzoomHint : labels.zoomHint}
            </span>
            <button type="button" className="lightbox-close" onClick={() => ref.current?.close()}>
              <span className="material-symbols-outlined" aria-hidden="true">
                close
              </span>
              {labels.close}
            </button>
          </div>
          <div className={zoomed ? 'lightbox-stage is-zoomed' : 'lightbox-stage'}>
            <button
              type="button"
              className="lightbox-image"
              aria-label={zoomed ? labels.zoomOut : labels.zoomIn}
              aria-pressed={zoomed}
              onClick={() => setZoomedAt(zoomed ? null : index)}
            >
              <img
                key={image.src}
                src={image.src}
                {...(image.srcSet ? { srcSet: image.srcSet, sizes: zoomed ? '1600px' : '100vw' } : {})}
                {...(image.width && image.height ? { width: image.width, height: image.height } : {})}
                alt={image.alt}
                decoding="async"
              />
            </button>
          </div>
          {(image.caption || many) && (
            <div className="lightbox-foot">
              {many && (
                <button
                  type="button"
                  className="lightbox-step"
                  aria-label={labels.prev}
                  onClick={() => step(-1)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_back
                  </span>
                </button>
              )}
              {image.caption ? (
                <p
                  id={captionId}
                  className="lightbox-caption"
                  {...(image.captionLang ? { lang: image.captionLang } : {})}
                >
                  {image.caption}
                </p>
              ) : (
                <span className="lightbox-caption" />
              )}
              {many && (
                <button
                  type="button"
                  className="lightbox-step"
                  aria-label={labels.next}
                  onClick={() => step(1)}
                >
                  <span className="material-symbols-outlined" aria-hidden="true">
                    arrow_forward
                  </span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </dialog>
  )
}
