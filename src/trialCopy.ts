import type { Lang } from './content'
import { trialProcessSections, type TrialProcessSection } from './trialProcess'

/** The trial page's sections, kept out of content.ts so they download with
 *  that page alone: content.ts reaches the header and footer, and so the
 *  entry script. Imported only by TrialProcessPage and scripts/prerender.mjs.
 *  Turkish is his own full record (src/trialProcess.ts); English is a short
 *  factual summary, not a translation of it. */
export const trialSections: Record<Lang, TrialProcessSection[]> = {
  tr: trialProcessSections,
  en: [
    {
      id: 'overview',
      title: '',
      paragraphs: [
        'On 27 July 2016, days after the failed military coup of 15 July, I was detained at my home in Istanbul and, three days later, arrested on suspicion of membership in the Fethullahist Terror Organization (FETÖ/PDY), the movement blamed for the coup attempt. The evidence cited against me was a handful of newspaper columns I had written for Zaman between December 2013 and March 2014.',
        "I spent close to twenty months in Silivri Prison before Turkey's Constitutional Court, and then the European Court of Human Rights, both ruled that my detention had violated my rights to liberty and to freedom of expression, finding no credible evidence that my columns served any organization's aims. I was released under house arrest in March 2018, and fully released a few months later.",
        'In July 2018 a criminal court convicted me of membership in a terrorist organization and sentenced me to eight years and nine months in prison, without detention pending appeal. Turkey’s Court of Cassation quashed that verdict in 2020 for insufficient evidence and ordered a retrial.',
        'The retrial concluded in November 2022 with a different verdict: not membership, but knowingly aiding a terrorist organization, carrying a sentence of two years and six months. I have appealed that decision, and it remains before the Court of Cassation.',
        'I have written my own detailed account of these proceedings — my courtroom statements and the Constitutional Court’s and European Court of Human Rights’ rulings in full — in Turkish, on this site’s Turkish pages.',
        'The defence statement I gave at the first hearing, at Silivri on 18 September 2017, can be read in English below.',
      ],
      document: {
        href: '/archive/pdf/trial/sahin-alpay-defence-2017-09-18.pdf',
        label: 'My defence statement, 18 September 2017',
      },
    },
  ],
}
