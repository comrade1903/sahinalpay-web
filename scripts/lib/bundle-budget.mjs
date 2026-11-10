import zlib from 'node:zlib'

/** The scripts a first visit downloads: the entry module and every
 *  modulepreload, as paths relative to dist/. Classic scripts (the theme
 *  script in <head>) and JSON-LD blocks are not part of the bundle. */
export function initialScripts(indexHtml) {
  const found = []
  const tag = /<script\b[^>]*\btype="module"[^>]*\bsrc="\/([^"]+\.js)"[^>]*>|<link\b[^>]*\brel="modulepreload"[^>]*\bhref="\/([^"]+\.js)"[^>]*>/g
  for (const match of indexHtml.matchAll(tag)) found.push(match[1] ?? match[2])
  return found
}

/** gzip size in kB, one decimal (zlib.gzipSync, level 9), rounded up so a
 *  file that exists never reads as 0 kB. */
export function gzipKb(buffer) {
  return Math.ceil((zlib.gzipSync(buffer, { level: 9 }).length / 1024) * 10) / 10
}
