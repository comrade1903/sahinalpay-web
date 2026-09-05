import portrait from '../assets/portrait.jpg'

/* ------------------------------------------------------------------
   The hero portrait. Setting PORTRAIT to null falls back to the ŞA
   monogram, which is what the hero showed before a photo existed.

   Source: expressioninterrupted.com (P24), the only size that site
   publishes — 670x310, so the 4/5 frame crops it to roughly 248x310 and
   upscales from there. Replace this file with a taller, larger original
   when one is available; nothing else needs to change.
------------------------------------------------------------------ */
export const PORTRAIT: string | null = portrait

export function AuthorAvatar({ className }: { className: string }) {
  if (PORTRAIT) {
    return <img className={className} src={PORTRAIT} alt="" aria-hidden="true" />
  }
  return (
    <span className={className} aria-hidden="true">
      ŞA
    </span>
  )
}
