# Autobiography source and editorial notes

This records the evidence behind the original website introduction at `/tr/kimdir`
and `/about`, and the revised page introductions. The first-person narrative is
new editorial writing based on the author's accounts, not a transcript, quotation
or newly obtained statement. That distinction is visible on the page and in its
no-JavaScript fallback. The archive articles themselves are unchanged.

## Source selection

Primary source directory: `/Users/inancozgirgin/Projects/sahinalpay-web/Archive`.

- `birinci kitap/bir hikayem var_01.pdf`: the typeset first volume, **Bir Hikâyem
  Var**, with a November 2024 imprint. Consulted the author biography, contents,
  foreword, chapter openings and relevant passages on education, political
  change, Sweden, journalism and university work. This is the authority for the
  first volume's chronology and scope; later retail edition dates do not replace
  its first-publication year.
- `birinci kitap/Edited kitap.docx`: an earlier combined manuscript, used as a
  supplementary language and overlap reference; not treated as a separate book.
- `ikinci kitap/2. KİTAP ANA METİN.doc`: the second-volume manuscript, still headed
  with its working series title. Consulted the foreword, its account of Zaman,
  changing assessments of the AKP and Gülen movement, the Silivri section,
  reunion with Fatma and retrospective conclusion. **Hikâyemin Sonu** is the
  published title, already recorded in the site catalogue and confirmed by the
  retailer listing below. This is a manuscript source, not a claim to have checked
  every passage against the published second edition.
- `ikinci kitap/SİLİVRİ GÜNCESİ EDİTED.doc`, `Silivri'den mektuplar.docx` and
  `Yargı süreci.docx`: supporting records of detention and correspondence. No
  private letter or diary scene is reproduced in the new website text.
- `birinci kitap/I have a story.docx`: English reference used in the overlap
  check. The English site narrative is a translation of the new Turkish
  introduction, not an extract from this manuscript.

Other writing consulted in `src/archive/tr/columns/p24.body.ts`:

- **Hocam ve dostum Tomas Hammar’a veda**: refuge in Sweden, research opportunities
  and gratitude towards a teacher.
- **Manga komutanıma veda**: education, work, friendships and intellectual change.
- **Fikirdaşlık ve arkadaşlık üzerine**: political agreement and personal loyalty.
- **Yeni dünya görüşüm**: reconsidering earlier beliefs after imprisonment and loss.
- **Stockholm’e Dönüş**: retrospective chronology and limits of release from prison.
- **Gün Zileli’nin anıları üzerine**: revisiting youthful politics and disagreements.
- **Fatma’ya veda**: family chronology and her distinct character.
- **Gerçekle aramız hiç iyi değil** and **Fark, karizma olabilir mi?**: the move from
  a concrete occasion to an argument, qualifications and explicit attribution.

These essays contain quotations from other people. Those passages were not treated
as examples of Alpay's own narrative voice.

## Language decisions

The transferable features are plain chronological narration, named people and
places, a connection between experience and political judgment, willingness to
admit uncertainty and error, and warmth when discussing friends and family.
Sentence lengths vary, but the website uses shorter paragraphs than the books.

The new text avoids the previous heroic register, invented aphorisms and grand
claims about public influence. It does not reproduce dialogue, letters, distinctive
book scenes, jokes or chapter-by-chapter plot summaries. The two-volume invitation
identifies each book's broad scope while leaving the lived details in the books.
Book titles are retained as bibliographic identifiers, not quotations.

The original `blockquote` and attribution were removed because no source was
provided for that alleged quotation. The infinite column count and inconsistent
outlet counts were removed from the biography. Page introductions are original
site copy and have no quotation marks or personal quote attribution.

## Evidence map

| New section | Main evidence |
| --- | --- |
| The life behind my writing | First-volume foreword; second-volume foreword and conclusion |
| Istanbul and Ayvalık | Typeset author biography; first-volume family chapter |
| Education | Typeset author biography; first-volume chapters 2 and 3 |
| Youthful politics | First-volume chapters 3–5; second-volume retrospective conclusion |
| Sweden | First-volume chapter 6; Hammar essay |
| Journalism | First-volume chapters 7–9; Toprak essay |
| Teaching and Zaman | Typeset biography; first-volume chapter 10; second-volume chapter 11 |
| Political hopes and mistakes | Second-volume foreword, chapters 11–16 and conclusion |
| Silivri and return | Second-volume chapters 17–18; court-process and letter files |
| Fatma and memoirs | First-volume foreword; second-volume chapter 18 and conclusion; farewell essay |

### Corrections and limits

- **Birthplace:** the first volume explicitly gives **18 April 1944, Istanbul**,
  to an Ayvalık family. The old site incorrectly said Ayvalık. Corrected the
  portrait captions, biography, Person JSON-LD and `public/llms.txt` together.
- **Detention:** distinguish custody on 27 July 2016 from remand on 31 July.
  Release is described as March 2018, followed by house arrest. The narrative does
  not present release or rights-violation judgments as an acquittal, and makes no
  assertion about the present status of the case.
- **Book scope:** the first volume reaches the early 2000s; prison and the final
  months with Fatma belong to the second. The old first-volume teaser wrongly
  included cells. Both teasers were rewritten.
- **Chronicle:** archival gaps cannot establish that the author stopped writing.
  Replaced the old claim that the chart proved his silence in 2016.

## Retail destinations

The existing product links were opened and checked on 7 September 2026. No price,
stock claim, sales figure or review quotation is reproduced on the site.

- [Bir Hikâyem Var](https://www.kitapyurdu.com/kitap/bir-hikayem-var-anilar-birinci-kitap/698652.html)
- [Hikâyemin Sonu](https://www.kitapyurdu.com/kitap/hikayemin-sonu-anilar-ikinci-kitap/710333.html)

## Text and implementation checks

- The Turkish narrative is approximately 1,400 words, well below the 5,000-word
  ceiling. The English counterpart is approximately 2,000 words.
- A normalized eight-word overlap check compared the new narratives against the
  extracted memoirs, supplementary documents and P24 text. Two ordinary factual
  formulations were rewritten after the first pass. This supplements editorial
  review; it is not presented as a proof of literary originality.
- Original books and extracted source files remain outside the shipped website.
  Research extracts are in the ignored `tmp/autobiography/` directory.
- Chapter headings, editorial note and updated birth information
  are available in the no-JavaScript page as well as the client application.
- The design hook's Material Symbols font and 24px base-size findings concern the
  existing icon ligature stylesheet, documented as a distinct icon system. They
  are contextual false positives, not new prose typography. The existing error
  detail size was moved to the small-body token. No hook suppression was added.
