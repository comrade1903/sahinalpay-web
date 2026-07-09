import fs from 'node:fs'
import path from 'node:path'
import { readArchiveEntries } from './archive-utils.mjs'

const entries = readArchiveEntries()
const errors = []

function assertUnique(field) {
  const seen = new Map()
  for (const entry of entries) {
    const value = entry[field]
    if (!value) {
      errors.push(`${entry.filePath}: missing ${field}`)
      continue
    }
    if (seen.has(value)) {
      errors.push(`Duplicate ${field} "${value}" in ${entry.filePath} and ${seen.get(value)}`)
    } else {
      seen.set(value, entry.filePath)
    }
  }
}

assertUnique('id')
assertUnique('slug')

for (const entry of entries) {
  if (entry.date && Number.isNaN(Date.parse(entry.date)) && !/\d{4}/.test(entry.date)) {
    errors.push(`${entry.filePath}: "${entry.title}" has an invalid-looking date "${entry.date}"`)
  }

  for (const assetPath of entry.assetPaths) {
    const diskPath = path.join(process.cwd(), 'public', assetPath)
    if (!fs.existsSync(diskPath)) {
      errors.push(`${entry.filePath}: missing clipping asset ${assetPath}`)
    }
  }
}

if (errors.length > 0) {
  console.error(errors.join('\n'))
  process.exit(1)
}

console.log(`Content validation passed for ${entries.length} archive entries.`)
