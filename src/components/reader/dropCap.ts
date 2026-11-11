/** True when the opening paragraph should not get a drop cap: missing, shorter
 *  than 60 characters, or not starting with a letter. A drop cap enlarges the
 *  first character only, so an opener like "1972'nin Kasım ayıydı" was set as
 *  a large "1" followed by "972'nin", and a quotation mark became the cap. */
export function skipsDropCap(first: string | undefined): boolean {
  if (!first || first.length < 60) return true
  return !/^\p{L}/u.test(first)
}
