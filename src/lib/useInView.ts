import { useEffect, useRef, useState, type RefObject } from 'react'

const supported = () => typeof IntersectionObserver !== 'undefined'

/** True once the element has entered the viewport, and from the first render
 *  where IntersectionObserver does not exist — content must never wait for
 *  an event that cannot come. It stays true once set. */
export function useInView<T extends Element>(rootMargin = '0px'): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null)
  const [inView, setInView] = useState(() => !supported())
  useEffect(() => {
    if (inView || !supported() || !ref.current) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setInView(true)
          observer.disconnect()
        }
      },
      { rootMargin },
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [inView, rootMargin])
  return [ref, inView]
}
