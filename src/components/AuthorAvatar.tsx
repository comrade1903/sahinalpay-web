import portrait from '../assets/portrait.jpg'

/* ------------------------------------------------------------------
   The hero portrait. Setting PORTRAIT to null falls back to the ŞA
   monogram, which is what the hero showed before a photo existed.

   A colour photograph from an interview, owner-supplied on 2026-10-27
   as a 640x385 web copy (no original exists). Cropped to the hero's 4:5
   frame and enlarged to 760x950 so the 380px frame stays sharp on 2x
   screens, with the shirt's blue toned down and a magenta cast taken off
   the skin. Source, script and the archival black-and-white portrait it
   replaced are kept outside the repo in Foto/portre.
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
