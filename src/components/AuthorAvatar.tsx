import portrait from '../assets/portrait.jpg'

/* ------------------------------------------------------------------
   The hero portrait. Setting PORTRAIT to null falls back to the ŞA
   monogram, which is what the hero showed before a photo existed.

   An archival black-and-white photograph (898x1400), owner-supplied.
   Tall enough that the 4/5 frame's object-fit: cover crops it rather
   than upscaling, unlike the earlier 670x310 source it replaced.
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
