import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

afterEach(() => {
  cleanup()
})

/* A browser rejects an animation's `finished` promise when the animation is
   cancelled, and so does happy-dom — but here nothing is listening when the
   motion library cancels on unmount, so every cancel surfaced as an unhandled
   rejection and failed the run. Mark the promise handled before cancelling. */
const AnimationClass = (globalThis as { Animation?: typeof Animation }).Animation
if (AnimationClass) {
  const cancel = AnimationClass.prototype.cancel
  AnimationClass.prototype.cancel = function (this: Animation) {
    this.finished.catch(() => {})
    cancel.call(this)
  }
}
