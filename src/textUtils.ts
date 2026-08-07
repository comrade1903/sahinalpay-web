/** Folds text for search comparison.
 *
 *  `String.prototype.toLowerCase()` is wrong for Turkish and fails silently:
 *  `"İstanbul".toLowerCase()` is `"i" + U+0307` (a combining dot above), which
 *  does not contain `"istanbul"`, and `"IŞIK".toLowerCase()` is `"işik"`, which
 *  does not contain `"isik"`. Searching the archive for a correctly spelled
 *  Turkish word therefore returned nothing, with no error — the archive appeared
 *  to say he never wrote about it.
 *
 *  Both sides of every search comparison run through this. It maps the dotted and
 *  dotless capitals to their true lowercase, folds the six Turkish-specific
 *  letters to bare ASCII so a reader without a Turkish keyboard can still find
 *  "Gülen" by typing "gulen", and strips any remaining combining marks (the
 *  U+0307 above, and accents such as the â in "Hikâyem"). */
export function foldSearchText(value: string): string {
  return value
    .replace(/İ/g, 'i')
    .replace(/I/g, 'ı')
    .toLocaleLowerCase('tr')
    .replace(/ı/g, 'i')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
