import { useEffect, useState } from 'react'

const QUERY = '(prefers-reduced-motion: reduce)'

const matches = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(QUERY).matches
    : false

/** True while the system asks for reduced motion, and updated live when the
 *  setting changes. CSS handles the animations themselves; this is for the
 *  few motions made in script, such as a smooth scroll. */
export function useReducedMotion(): boolean {
  const [reduce, setReduce] = useState(matches)
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const query = window.matchMedia(QUERY)
    const update = () => setReduce(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return reduce
}
