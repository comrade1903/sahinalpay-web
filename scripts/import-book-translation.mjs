#!/usr/bin/env node
/* Turns the plain-text export of the English memoir ("I Have a Story", the
 * translation of Bir Hikâyem Var and Hikâyemin Sonu) into the Markdown the
 * Books page's reading dialog loads. The export is text pulled from the
 * typeset PDF: lines wrapped at the page width, page numbers on lines of their
 * own, and paragraphs cut in two at page breaks. This only undoes that
 * layout; it never changes a word of the text.
 *
 *   node scripts/import-book-translation.mjs <export.md> [out.md]
 *
 * Output (default): public/books/i-have-a-story/i-have-a-story.md
 *   # <chapter>         "CHAPTER I / …" headings, rejoined when they wrapped
 *   ## <section>        short unpunctuated lines standing alone
 *   paragraphs          one per line group, separated by a blank line
 * The book's title block (title + author) is dropped — the dialog shows it —
 * and so are the "PHOTO" placeholders, which mark where the print edition
 * carries a photograph (the PDF keeps the layout). */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

const [src, out = 'public/books/i-have-a-story/i-have-a-story.md'] = process.argv.slice(2)
if (!src) {
  console.error('usage: node scripts/import-book-translation.mjs <export.md> [out.md]')
  process.exit(1)
}

const lines = readFileSync(src, 'utf8').replace(/\r\n?/g, '\n').split('\n')

/* Split into blocks on blank lines, dropping page-number lines; a block that
 * a page break interrupted is marked so it can be rejoined below. */
const PAGE_NUMBER = /^\s*\d{1,3}\s*$/
const blocks = []
let current = []
let pageBreakPending = false
const flush = () => {
  if (current.length) blocks.push({ lines: current, afterPageBreak: pageBreakPending })
  if (current.length) pageBreakPending = false
  current = []
}
for (const raw of lines) {
  const line = raw.trim()
  if (PAGE_NUMBER.test(line)) {
    flush()
    pageBreakPending = true
    continue
  }
  if (!line) {
    flush()
    continue
  }
  current.push(line)
}
flush()

const ENDS_SENTENCE = /[.!?…:”"’)\]]$/
const join = (ls) => ls.reduce((acc, l) => (acc ? joinTwo(acc, l) : l), '')
function joinTwo(acc, l) {
  // The typesetting never hyphenates: a line ending in a hyphen breaks a
  // real compound ("horse-drawn", "son-in-law"), and em dashes are set
  // without spaces, so both join with nothing in between.
  if (/[-—]$/.test(acc) || l.startsWith('—')) return `${acc}${l}`
  return `${acc} ${l}`
}

/* Classify blocks. */
const out_ = []
for (let i = 0; i < blocks.length; i++) {
  const { lines: ls, afterPageBreak } = blocks[i]
  const text = join(ls)
  if (i === 0 && text === 'I Have a Story Şahin Alpay') continue
  if (text === 'PHOTO') continue
  if (text === 'Translator’s Note') {
    out_.push({ kind: 'chapter', text })
    continue
  }
  if (/^CHAPTER [IVXL]+ \//.test(text)) {
    out_.push({ kind: 'chapter', text })
    continue
  }
  if (
    ls.length === 1 &&
    text.length <= 70 &&
    !ENDS_SENTENCE.test(text) &&
    !afterPageBreak &&
    /^[\p{Lu}“"‘0-9]/u.test(text)
  ) {
    // Of the capitalised lines only PREFACE opens a part of the book; the
    // others are the newspaper death notice's own lines and the closing
    // "THE END", which stay in the running text.
    const kind = text === 'PREFACE' ? 'chapter' : text === text.toUpperCase() ? 'para' : 'section'
    out_.push({ kind, text })
    continue
  }
  const prev = out_[out_.length - 1]
  if (afterPageBreak && prev?.kind === 'para' && !ENDS_SENTENCE.test(prev.text)) {
    prev.text = joinTwo(prev.text, text)
    continue
  }
  out_.push({ kind: 'para', text })
}

const md = out_
  .map((b) => (b.kind === 'chapter' ? `# ${b.text}` : b.kind === 'section' ? `## ${b.text}` : b.text))
  .join('\n\n')

mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, `${md}\n`)
const count = (k) => out_.filter((b) => b.kind === k).length
console.log(
  `${out}: ${count('chapter')} chapters, ${count('section')} sections, ${count('para')} paragraphs`,
)
