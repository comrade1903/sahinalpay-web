import fs from 'node:fs'
import path from 'node:path'

/* Guards for output paths built from data the script does not control — a
   manifest entry, a filename taken from a remote URL, a CLI flag. Every one of
   those ends up joined onto an output root, and `path.join(root, '../../x')`
   leaves the root without complaint. These helpers turn that into a loud
   error, and give the content tools an atomic write so a crash mid-run cannot
   leave a truncated source file behind. */

export class PathGuardError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PathGuardError'
  }
}

/** Resolves `target` (absolute, or relative to `baseDir`) and asserts the
 *  result is `baseDir` itself or something below it. Returns the resolved
 *  absolute path so callers can use it directly.
 *
 *  The check is lexical: it stops `..` traversal and absolute-path injection,
 *  which is what untrusted input actually carries. It does not resolve
 *  symlinks — a caller handing out write access to a directory other people
 *  can plant links in needs more than this. */
export function ensureInside(baseDir, target, label = 'path') {
  const base = path.resolve(baseDir)
  const resolved = path.resolve(base, target)
  if (resolved !== base && !resolved.startsWith(base + path.sep)) {
    throw new PathGuardError(`${label} escapes ${base}: ${target}`)
  }
  return resolved
}

/** path.join() that refuses to leave `baseDir`. */
export function safeJoin(baseDir, ...segments) {
  return ensureInside(baseDir, path.join(...segments), segments.join('/'))
}

const MAX_FILE_NAME_LENGTH = 180

/** Character-by-character rather than a regex: a control-character class is
 *  exactly the thing lint rules flag, and this reads the same. */
function stripControlChars(value) {
  let stripped = ''
  for (const char of value) {
    const code = char.codePointAt(0)
    if (code < 0x20 || code === 0x7f) continue
    stripped += char
  }
  return stripped
}

/** Reduces an externally supplied name (a URL path segment, say) to a single
 *  harmless filename: no directory separators, no traversal, no control
 *  characters, bounded length. Throws rather than inventing a name, so a
 *  caller never silently writes two different downloads onto one path. */
export function safeFileName(rawName, label = 'filename') {
  const collapsed = stripControlChars(String(rawName ?? '')).replaceAll('\\', '/')
  const base = path.posix.basename(collapsed).trim()
  if (!base || base === '.' || base === '..') {
    throw new PathGuardError(`${label} is not a usable filename: ${JSON.stringify(rawName)}`)
  }
  // A leading dot would hide the file, and a run of them is the shape every
  // traversal attempt arrives in.
  const cleaned = base.replace(/^\.+/, '')
  if (!cleaned) {
    throw new PathGuardError(`${label} is not a usable filename: ${JSON.stringify(rawName)}`)
  }
  if (cleaned.length <= MAX_FILE_NAME_LENGTH) return cleaned
  // Keep the extension: the tools downstream pick their reader from it.
  const extension = path.posix.extname(cleaned).slice(0, 16)
  return cleaned.slice(0, MAX_FILE_NAME_LENGTH - extension.length) + extension
}

let tempCounter = 0

function tempPathFor(filePath) {
  tempCounter += 1
  return `${filePath}.tmp-${process.pid}-${tempCounter}`
}

/** Writes via a sibling temp file plus rename, so a reader never sees a
 *  half-written file and a crash cannot truncate the original. rename(2) is
 *  atomic within one filesystem, and a sibling is always on the same one. */
export function writeFileAtomic(filePath, data, encoding = 'utf8') {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const tempPath = tempPathFor(filePath)
  try {
    fs.writeFileSync(tempPath, data, encoding)
    fs.renameSync(tempPath, filePath)
  } catch (error) {
    fs.rmSync(tempPath, { force: true })
    throw error
  }
}

/** Same guarantee for a file assembled incrementally (a streamed download):
 *  the caller writes into `tempPath` and calls commit() once the content is
 *  known to be complete, or discard() on any failure. */
export function openAtomicTarget(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  const tempPath = tempPathFor(filePath)
  return {
    tempPath,
    commit() {
      fs.renameSync(tempPath, filePath)
    },
    discard() {
      fs.rmSync(tempPath, { force: true })
    },
  }
}
