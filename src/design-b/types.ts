/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ArticleCategory = {
  KoseYazisi: "Köşe Yazısı",
  Analiz: "Analiz",
  Soylesi: "Söyleşi",
  AkademikMakale: "Akademik Makale",
} as const;
export type ArticleCategory = (typeof ArticleCategory)[keyof typeof ArticleCategory];

export interface Footnote {
  index: number;
  text: string;
}

export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  source: string;
  date?: string; // e.g., "14 Ocak 1992"
  year: number | null; // For date range filtering; null when the date couldn't be parsed
  readTime: string; // e.g., "8 Dakika", estimated from word count
  excerpt: string;
  content: string[]; // split by paragraphs for rich rendering
  /** Not present in the source archive yet — left empty rather than invented. */
  tags?: string[];
  /** No real per-article image exists in the archive yet. */
  featuredImage?: string;
  footnotes?: Footnote[];
  /** Other real articles picked from the archive, not a fabricated recommendation. */
  similarIds?: string[];
  /** Link back to the original source (e.g. platform24.org). */
  url?: string;
}

export interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  description: string;
  bgGradient: string;
  iconName: string;
}

export interface TimelineEvent {
  /** Only set when an explicit year/range is stated in the source text. */
  yearRange?: string;
  title: string;
  description: string;
  details: string[];
  image?: string;
}

export interface Book {
  id: string;
  title: string;
  year: number;
  /** Publisher/page count/synopsis are not recorded in the archive yet. */
  publisher?: string;
  coverImage?: string;
  description: string;
  synopsis?: string;
  pageCount?: number;
  purchaseUrl?: string;
}
