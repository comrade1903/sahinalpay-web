import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../lib/useInView'

/**
 * Scroll-reveal wrapper: the block fades and rises into place the first time
 * it enters the viewport. The animation is CSS (`.reveal` in index.css) and is
 * switched off entirely under `prefers-reduced-motion` — the readership skews
 * older, and motion that cannot be turned off is not acceptable here.
 */
export function Reveal({
  children,
  delay = 0,
  as: Tag = 'div',
  className,
  id,
  lang,
  style,
}: {
  children: ReactNode
  delay?: number | undefined
  as?: 'div' | 'section' | 'li' | 'article' | 'aside' | undefined
  className?: string | undefined
  id?: string | undefined
  lang?: string | undefined
  style?: CSSProperties | undefined
}) {
  const [ref, inView] = useInView<HTMLElement>('-60px')
  return (
    <Tag
      // The intrinsic tags differ in element type; the ref is used only to
      // observe the element, which every one of them is.
      ref={ref as never}
      className={className ? `reveal ${className}` : 'reveal'}
      data-inview={inView}
      id={id}
      lang={lang}
      style={{ ...style, ...(delay ? { '--reveal-delay': `${delay}s` } : {}) } as CSSProperties}
    >
      {children}
    </Tag>
  )
}
