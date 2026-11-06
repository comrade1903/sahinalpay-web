import portrait from '../assets/portrait.jpg'

/* ------------------------------------------------------------------
   The hero portrait. Setting PORTRAIT to null falls back to the ŞA
   monogram, which is what the hero showed before a photo existed.

   A colour photograph from an interview; the current file is the
   owner's corrected 1280x770 copy (2026-11-06), cropped to the hero's 4:5
   frame and enlarged to 960x1200 so the 380px frame stays sharp on 2x
   screens. See the note above Hero in App.tsx.
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
