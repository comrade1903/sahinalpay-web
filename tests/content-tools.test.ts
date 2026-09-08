/**
 * @vitest-environment node
 *
 * Integration coverage for the content-production tools, which rewrite the
 * archive's own data files. The risk they carry is silent loss — a field
 * dropped, a body wiped on a second run, a real record replaced by a
 * differently-shaped one — so these exercise the file they leave behind, not
 * just the exit code.
 *
 * Fixtures live under tmp/, which is gitignored and inside the repository
 * root the tools insist their targets stay within.
 */
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const splitScript = path.join(projectRoot, 'scripts/split-archive-body.mjs')

let workDir: string
let relative: string

interface RunResult {
  status: number
  stdout: string
  stderr: string
}

function run(script: string, args: string[]): RunResult {
  try {
    const stdout = execFileSync(process.execPath, [script, ...args], {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: 'pipe',
    })
    return { status: 0, stdout, stderr: '' }
  } catch (error) {
    const failure = error as { status?: number; stdout?: string; stderr?: string }
    return {
      status: failure.status ?? 1,
      stdout: failure.stdout ?? '',
      stderr: failure.stderr ?? '',
    }
  }
}

const outletPath = () => path.join(workDir, 'outlet.ts')
const bodyPath = () => path.join(workDir, 'outlet.body.ts')
const read = (file: string) => fs.readFileSync(file, 'utf8')

function writeOutlet(body: string) {
  fs.writeFileSync(
    outletPath(),
    `import type { ArchiveItemSeed } from '../../src/archive/types'

${body}`,
  )
}

/** One seed of each shape the archive actually holds: full text, and a
 *  clipping-only record carrying the fields added since the tool was written. */
const MIXED_SEEDS = `/** Provenance note that must survive the split. */
export const probeSeeds: ArchiveItemSeed[] = [
  {
    slug: 'has-body',
    title: 'Gövdeli yazı',
    date: '7 Kasım 2017',
    archiveUrl: 'https://web.archive.org/web/2018/https://example.org/x',
    tags: ['etiket', 'ikinci'],
    pdfSrc: '/archive/pdf/x.pdf',
    pdfPageCount: 3,
    pieceKind: 'interview',
    body: ['Birinci paragraf.', 'İkinci paragraf.'],
  },
  {
    slug: 'no-body',
    title: 'Kupürlü yazı',
    date: 'Ekim 1969',
    clippings: [{ src: '/archive/clippings/x/page-1.webp', pageLabel: 's. 2' }],
  },
]
`

beforeEach(() => {
  /* Fixtures have to live inside the repository root, because the tools
     refuse a target outside it. tmp/ is the gitignored scratch area — and it
     is gitignored, so a fresh clone does not have it. */
  const scratch = path.join(projectRoot, 'tmp')
  fs.mkdirSync(scratch, { recursive: true })
  workDir = fs.mkdtempSync(path.join(scratch, 'split-test-'))
  relative = path.relative(projectRoot, workDir)
})

afterEach(() => {
  fs.rmSync(workDir, { recursive: true, force: true })
})

describe('split-archive-body', () => {
  it('moves body text out and leaves metadata behind', () => {
    writeOutlet(MIXED_SEEDS)
    const result = run(splitScript, [`${relative}/outlet.ts`])
    expect(result.status, result.stderr).toBe(0)

    const metadata = read(outletPath())
    expect(metadata).toContain('hasBody: true')
    expect(metadata).not.toMatch(/^\s*body: \[/m)
    /* The first paragraph stays behind as the list-page excerpt — that is
       deliberate, and the reason the check below names the second one. */
    expect(metadata).toContain('excerpt:')
    expect(metadata).not.toContain('İkinci paragraf.')

    const bodies = read(bodyPath())
    expect(bodies).toContain('Birinci paragraf.')
    expect(bodies).toContain('İkinci paragraf.')
  })

  /* The defect this guards: the tool rebuilt each record from a fixed list of
     12 fields, so anything added to ArchiveItemSeed since — archiveUrl, tags,
     pdfSrc, pdfPageCount, pieceKind — was silently dropped. */
  it('preserves every field a record carries, including the newer ones', () => {
    writeOutlet(MIXED_SEEDS)
    expect(run(splitScript, [`${relative}/outlet.ts`]).status).toBe(0)
    const metadata = read(outletPath())
    for (const field of ['archiveUrl', 'tags', 'pdfSrc', 'pdfPageCount', 'pieceKind']) {
      expect(metadata, `${field} was dropped`).toContain(field)
    }
    expect(metadata).toContain('web.archive.org')
    expect(metadata).toContain('pdfPageCount: 3')
    expect(metadata).toContain('"interview"')
  })

  it('keeps a clipping-only record untouched', () => {
    writeOutlet(MIXED_SEEDS)
    expect(run(splitScript, [`${relative}/outlet.ts`]).status).toBe(0)
    const metadata = read(outletPath())
    expect(metadata).toContain('page-1.webp')
    expect(metadata).toContain('s. 2')
  })

  it("keeps the file's own provenance comment", () => {
    writeOutlet(MIXED_SEEDS)
    expect(run(splitScript, [`${relative}/outlet.ts`]).status).toBe(0)
    expect(read(outletPath())).toContain('Provenance note that must survive the split.')
  })

  /* The other defect: after the first run the seeds no longer carry `body`,
     so a second run emitted an empty body module — wiping every body. */
  it('is idempotent: a second run changes neither file', () => {
    writeOutlet(MIXED_SEEDS)
    expect(run(splitScript, [`${relative}/outlet.ts`]).status).toBe(0)
    const firstMetadata = read(outletPath())
    const firstBodies = read(bodyPath())

    const second = run(splitScript, [`${relative}/outlet.ts`])
    expect(second.status, second.stderr).toBe(0)
    expect(second.stdout).toContain('unchanged')
    expect(read(outletPath())).toBe(firstMetadata)
    expect(read(bodyPath())).toBe(firstBodies)
    expect(read(bodyPath())).toContain('Birinci paragraf.')
  })

  it('--dry-run writes nothing at all', () => {
    writeOutlet(MIXED_SEEDS)
    const before = read(outletPath())
    const result = run(splitScript, ['--dry-run', `${relative}/outlet.ts`])
    expect(result.status, result.stderr).toBe(0)
    expect(result.stdout).toContain('[dry-run]')
    expect(read(outletPath())).toBe(before)
    expect(fs.existsSync(bodyPath())).toBe(false)
  })

  it('leaves no temporary files behind', () => {
    writeOutlet(MIXED_SEEDS)
    expect(run(splitScript, [`${relative}/outlet.ts`]).status).toBe(0)
    expect(fs.readdirSync(workDir).filter((name) => name.includes('.tmp-'))).toEqual([])
  })

  describe('refusals', () => {
    const cases: [string, string][] = [
      [
        'hasBody with no body anywhere',
        `export const s: ArchiveItemSeed[] = [{ slug: 'x', title: 'T', hasBody: true }]
`,
      ],
      [
        'two body-bearing records sharing a slug',
        `export const s: ArchiveItemSeed[] = [
  { slug: 'dup', title: 'A', body: ['one'] },
  { slug: 'dup', title: 'B', body: ['two'] },
]
`,
      ],
    ]

    for (const [name, seeds] of cases) {
      it(`refuses: ${name}`, () => {
        writeOutlet(seeds)
        const before = read(outletPath())
        const result = run(splitScript, [`${relative}/outlet.ts`])
        expect(result.status).not.toBe(0)
        expect(read(outletPath()), 'the source file must be left alone').toBe(before)
        expect(fs.existsSync(bodyPath())).toBe(false)
      })
    }

    it('refuses an unknown flag', () => {
      writeOutlet(MIXED_SEEDS)
      expect(run(splitScript, ['--nope', `${relative}/outlet.ts`]).status).not.toBe(0)
    })

    it('refuses a target outside the repository', () => {
      expect(run(splitScript, ['/etc/passwd']).status).not.toBe(0)
    })

    it('refuses to run with no target', () => {
      expect(run(splitScript, []).status).not.toBe(0)
    })
  })
})

/* These two rewrite real archive files from sources outside the repository,
   so the only thing that can be tested here is that they refuse to run —
   which is the behaviour that matters, since both would otherwise overwrite
   live records. */
describe('importers refuse to clobber the live archive', () => {
  /* Before and after, not "clean": the claim is that the importer wrote
     nothing, and comparing against an empty status instead asserted that
     whoever runs the suite has no uncommitted archive edits of their own —
     which fails for a reason that has nothing to do with the importer, and
     passes in CI only because CI checks out clean. */
  const archiveStatus = () =>
    execFileSync('git', ['status', '--porcelain', 'src/archive'], {
      cwd: projectRoot,
      encoding: 'utf8',
    })

  it('import-zaman-md refuses the clipping-based Zaman files', () => {
    const before = archiveStatus()
    const result = run(path.join(projectRoot, 'scripts/import-zaman-md.mjs'), [])
    expect(result.status).not.toBe(0)
    expect(result.stderr + result.stdout).toMatch(/clipping-based|--force-overwrite/)
    expect(archiveStatus()).toBe(before)
  })

  it('import-p24-pdf-images refuses to run without a source directory', () => {
    const result = run(path.join(projectRoot, 'scripts/import-p24-pdf-images.mjs'), [])
    expect(result.status).not.toBe(0)
    expect(result.stderr + result.stdout).toContain('Usage')
  })

  it('import-p24-pdf-images refuses a source directory that does not exist', () => {
    const result = run(path.join(projectRoot, 'scripts/import-p24-pdf-images.mjs'), [
      path.join(workDir, 'no-such-dir'),
    ])
    expect(result.status).not.toBe(0)
  })
})
