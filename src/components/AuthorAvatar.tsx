import portrait from '../assets/portrait.webp'
import portraitAvatar from '../assets/portrait-avatar.webp'

/* ------------------------------------------------------------------
   The hero portrait. Setting PORTRAIT to null falls back to the ŞA
   monogram, which is what the hero showed before a photo existed.

   A colour photograph from an interview; the current file is the
   owner's corrected 1280x770 copy (2026-11-06), cropped to the hero's 4:5
   frame and enlarged to 960x1200 so the 380px frame stays sharp on 2x
   screens. See the note above Hero in App.tsx. The served files are made
   from src/assets/originals/portrait.jpg by
   scripts/generate-image-variants.sh.
------------------------------------------------------------------ */
export const PORTRAIT: string | null = portrait

/* The avatar is drawn 40-88px wide; the hero file is 960px and was being
   downloaded on every article just for the byline circle. */
const AVATAR: string | null = PORTRAIT ? portraitAvatar : null

export function AuthorAvatar({ className }: { className: string }) {
  if (AVATAR) {
    return (
      <img className={className} src={AVATAR} width={192} height={240} alt="" aria-hidden="true" />
    )
  }
  return (
    <span className={className} aria-hidden="true">
      ŞA
    </span>
  )
}
