/**
 * Loads the real archive modules the way the app sees them.
 *
 * Content scripts used to re-parse `src/archive/**` with hand-written
 * regexes, so a title containing an escaped quote (or any field the regex
 * did not know about) was read differently by the tooling than by the
 * running site. Everything now goes through one Vite SSR build of the very
 * modules the browser imports, so scripts and app share a single source of
 * truth.
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { build } from 'vite'

const here = path.dirname(fileURLToPath(import.meta.url))
export const projectRoot = path.resolve(here, '..', '..')

let cached = null
const tempDirs = []
let cleanupRegistered = false

function registerCleanup() {
  if (cleanupRegistered) return
  cleanupRegistered = true
  process.on('exit', () => {
    for (const dir of tempDirs) fs.rmSync(dir, { recursive: true, force: true })
  })
}

async function bundle(entry, outFile) {
  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sa-archive-'))
  // Kept alive for the whole process: lazily loaded body chunks are emitted
  // as sibling files and imported long after this call returns.
  tempDirs.push(outDir)
  registerCleanup()
  {
    await build({
      root: projectRoot,
      configFile: false,
      logLevel: 'error',
      build: {
        ssr: true,
        outDir,
        emptyOutDir: true,
        minify: false,
        write: true,
        codeSplitting: false,
        rollupOptions: {
          input: path.resolve(projectRoot, entry),
          output: {
            entryFileNames: outFile,
            format: 'es',
          },
        },
      },
    })
    const url = pathToFileURL(path.join(outDir, outFile)).href
    return await import(url)
  }
}

/** The assembled archive (same object the app's dynamic import yields). */
export async function loadArchive() {
  cached ??= bundle('src/archive/index.ts', 'archive.mjs')
  return cached
}

/** Every normalized ArchiveItem, across both languages. */
export async function loadArchiveItems() {
  const mod = await loadArchive()
  return mod.allArchiveItems()
}

const moduleCache = new Map()

/** Loads an arbitrary project module (e.g. src/routes.ts) for scripts.
 *  Memoised per entry: each call is a full Vite build, and the validator
 *  alone wants half a dozen of them. */
export async function loadModule(entry, outFile = 'module.mjs') {
  let pending = moduleCache.get(entry)
  if (!pending) {
    pending = bundle(entry, outFile).catch((error) => {
      moduleCache.delete(entry)
      throw error
    })
    moduleCache.set(entry, pending)
  }
  return pending
}
