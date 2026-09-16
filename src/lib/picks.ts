import type { Lang } from '../content'
import type { ArchiveSummary, PickSeed } from '../archive/useArchiveSummary'

/**
 * The homepage's "Benden Seçkiler" / "My Picks". Deterministic: a seeded
 * shuffle, so every visitor sees the same pieces in a given week, with no
 * cron job, no backend and no editorial queue to keep filled.
 */

/** Deterministic mulberry32 PRNG — same seed always produces the same
 *  sequence, so every visitor sees the same picks during a given week. */
export function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Fisher–Yates, seeded. Written with an explicit swap through locals rather
 *  than a destructuring swap so it type-checks under noUncheckedIndexedAccess:
 *  both indices are provably in range, but the compiler cannot know that. */
export function shuffleWith<T>(items: readonly T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    const a = out[i]!
    const b = out[j]!
    out[i] = b
    out[j] = a
  }
  return out
}

/** ISO-8601 week number combined with its year (e.g. 2026 week 3 -> 202603),
 *  so the seed — and therefore the picks below — changes once a week. */
export function isoWeekKey(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = (d.getUTCDay() + 6) % 7
  d.setUTCDate(d.getUTCDate() - dayNum + 3)
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3)
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000))
  return d.getUTCFullYear() * 100 + week
}

/** A random-but-stable set of full articles, reshuffled once a week (not a
 *  fabricated "featured" pick — every item is real, just chosen by a seed
 *  that only changes on ISO week boundaries). */
export function weeklyPicks(summary: ArchiveSummary, lang: Lang, count: number): PickSeed[] {
  return shuffleWith(summary.pickPool[lang], mulberry32(isoWeekKey(new Date()))).slice(
    0,
    count,
  )
}
