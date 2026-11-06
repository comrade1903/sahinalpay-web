import { describe, expect, it } from 'vitest'
import { allArchiveItems } from '../src/archive/index'
import { displayItem } from '../src/archive/display'
import { englishCitation, englishDate } from '../src/archive/english'
import { titleTranslations } from '../src/archive/tr/english'

/* Every section page lists the other language's records too. On the English
   pages a Turkish record shows its English view: an English rendering beside
   its title and its descriptive text in English (owner's request,
   2026-11-06). */
const turkish = allArchiveItems().filter((item) => item.lang === 'tr')

/* Words that would mean a Turkish citation line or note slipped through. */
const TURKISH_MARKERS =
  /(?<!\p{L})(Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık|Yorum|Sayfa|sayı|söyleşi|kupür|arşivinden|alınmıştır|çeviri|diğerleri|Kapak Görseli|Fotoğraf)(?!\p{L})|(?<!\p{L})s\. \d/u

describe('the English view of Turkish records', () => {
  it('gives every listed Turkish record a title entry', () => {
    for (const item of turkish) {
      expect(item.slug in titleTranslations, `${item.slug} has no title translation`).toBe(true)
    }
  })

  it('has no translation entry for a record that does not exist', () => {
    const slugs = new Set(turkish.map((item) => item.slug))
    for (const slug of Object.keys(titleTranslations)) {
      expect(slugs.has(slug), `translation for unknown record ${slug}`).toBe(true)
    }
  })

  it('leaves no Turkish in the date, note, credit or page labels', () => {
    for (const item of turkish) {
      const shown = displayItem(item, 'en')
      const fields = [
        shown.date,
        item.sourceNote ? shown.sourceNote : undefined,
        item.imageCredit ? shown.imageCredit : undefined,
        ...(shown.clippings ?? []).map((clipping) => clipping.pageLabel),
      ]
      for (const field of fields) {
        if (field === undefined) continue
        expect(field, `${item.slug}: "${field}"`).not.toMatch(TURKISH_MARKERS)
      }
      if (item.sourceNote) expect(shown.sourceNote, `${item.slug} note untranslated`).not.toBe(item.sourceNote)
      if (item.imageCredit) expect(shown.imageCredit, `${item.slug} credit untranslated`).not.toBe(item.imageCredit)
    }
  })

  it('translates every citation line except a standfirst kept as one', () => {
    for (const item of turkish) {
      if (!item.subtitle) continue
      const shown = displayItem(item, 'en')
      /* P24 stores each piece's standfirst as its subtitle; that is the
         author's prose, and stays in Turkish like the body. */
      if (item.outletKey === 'p24') continue
      expect(shown.subtitle, `${item.slug} subtitle untranslated`).not.toBe(item.subtitle)
      expect(shown.subtitle, `${item.slug}: "${shown.subtitle}"`).not.toMatch(TURKISH_MARKERS)
    }
  })

  it('keeps the Turkish title and adds the translation beside it', () => {
    const item = turkish.find((candidate) => candidate.slug === 'cumhuriyet-mi-demokrasi-mi')!
    const shown = displayItem(item, 'en')
    expect(shown.title).toBe('Cumhuriyet mi, demokrasi mi?')
    expect(shown.titleTranslation).toBe('Republic or democracy?')
    expect(shown.date).toBe('1 November 2012')
    expect(shown.subtitle).toBe('Zaman, Opinion, 1 November 2012')
  })

  it('changes nothing on a Turkish page or for an English record', () => {
    const item = turkish[0]!
    expect(displayItem(item, 'tr')).toBe(item)
    const english = allArchiveItems().find((candidate) => candidate.lang === 'en')!
    expect(displayItem(english, 'en')).toBe(english)
  })
})

describe('citation and date rules', () => {
  it('translates the newspaper citation shapes', () => {
    expect(englishCitation('Zaman, Yorum, 8 Haziran 2006, s. 17')).toBe('Zaman, Opinion, 8 June 2006, p. 17')
    expect(englishCitation('Milliyet, Entellektüel Bakış, 3 Şubat 1999, s. 20 — Joschka Fischer ile söyleşi')).toBe(
      'Milliyet, Entellektüel Bakış, 3 February 1999, p. 20 — interview with Joschka Fischer',
    )
    expect(englishCitation('Cumhuriyet Kitap, sayı 12, 4 Ağustos 1988, s. 6-7')).toBe(
      'Cumhuriyet Kitap, no. 12, 4 August 1988, pp. 6-7',
    )
    expect(englishCitation('Beraat etmeyi bekliyorum.')).toBeUndefined()
  })

  it('translates month names, including those that start with Ş and A', () => {
    expect(englishDate('14 Şubat 1944')).toBe('14 February 1944')
    expect(englishDate('30 Ağustos 2012')).toBe('30 August 2012')
    expect(englishDate('1987')).toBe('1987')
  })
})
