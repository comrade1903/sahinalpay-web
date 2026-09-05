import { motion, useReducedMotion, type MotionStyle } from 'motion/react'
import type { ReactNode } from 'react'

/**
 * Scroll-reveal wrapper. Every animation on the site goes through motion and
 * respects prefers-reduced-motion: the readership skews older, and motion
 * that cannot be turned off is not acceptable here.
 */
export function Reveal({
  children,
  delay = 0,
  as = 'div',
  className,
  id,
  style,
}: {
  children: ReactNode
  delay?: number | undefined
  as?: 'div' | 'section' | 'li' | 'article' | 'aside' | undefined
  className?: string | undefined
  id?: string | undefined
  /* MotionStyle, not React's CSSProperties: the value is forwarded straight
     to a motion element, and under exactOptionalPropertyTypes the two are
     genuinely different types (CSSProperties allows `x: undefined`, which
     motion's transform shorthands do not). */
  style?: MotionStyle | undefined
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as]
  return (
    /* Optional props are spread in only when set rather than passed as
       `undefined`: motion's prop types do not accept an explicit undefined
       under exactOptionalPropertyTypes, and "no className" is an absent
       prop, not a prop whose value is undefined. */
    <MotionTag
      {...(className ? { className } : {})}
      {...(id ? { id } : {})}
      {...(style ? { style } : {})}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      {...(reduce ? {} : { whileInView: { opacity: 1, y: 0 } })}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
