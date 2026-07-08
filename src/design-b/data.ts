/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/* This module derives everything it exports from the real site content in
   `../content.ts` — it holds no article/book data of its own, so there is
   nothing here to keep in sync by hand. */

import { content, type ArchiveItem } from "../content";
import { parseTurkishDate } from "../dateUtils";
import { slugFromUrl } from "../routes";
import { ArticleCategory } from "./types";
import type { Article, Book, CategoryInfo, TimelineEvent } from "./types";

const t = content.tr;

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function readTime(body: string[]): string {
  const words = body.join(" ").split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} Dakika`;
}

function excerptOf(item: ArchiveItem): string {
  if (item.excerpt) return item.excerpt;
  if (item.subtitle) return item.subtitle;
  const first = item.body?.[0] ?? "";
  return first.length > 220 ? first.slice(0, 220).trimEnd() + "…" : first;
}

function toArticle(
  item: ArchiveItem,
  category: ArticleCategory,
  source: string,
): Omit<Article, "similarIds"> {
  const id = item.url ? slugFromUrl(item.url) : slugify(item.title);
  const ts = item.date ? parseTurkishDate(item.date) : null;
  return {
    id,
    title: item.title,
    category,
    source,
    date: item.date,
    year: ts !== null ? new Date(ts).getUTCFullYear() : null,
    readTime: readTime(item.body ?? []),
    excerpt: excerptOf(item),
    content: item.body ?? [],
    url: item.url,
  };
}

const hasBody = (item: ArchiveItem) => !!item.body && item.body.length > 0;

const columnArticles = t.columns.outlets.flatMap((o) =>
  o.items.filter(hasBody).map((item) => toArticle(item, ArticleCategory.KoseYazisi, o.outlet)),
);
const analysisArticles = (t.analyses?.outlets ?? []).flatMap((o) =>
  o.items.filter(hasBody).map((item) => toArticle(item, ArticleCategory.Analiz, o.outlet)),
);
const interviewArticles = (t.interviews?.items ?? [])
  .filter(hasBody)
  .map((item) => toArticle(item, ArticleCategory.Soylesi, "Söyleşi"));
const academicArticleList = (t.academicArticles?.items ?? [])
  .filter(hasBody)
  .map((item) => toArticle(item, ArticleCategory.AkademikMakale, "Akademik"));

const allArticles = [...columnArticles, ...analysisArticles, ...interviewArticles, ...academicArticleList];

// "Similar articles": the next few real pieces in archive order, excluding self.
function similarIdsFor(index: number): string[] {
  const ids: string[] = [];
  for (let offset = 1; ids.length < 3 && offset < allArticles.length; offset++) {
    ids.push(allArticles[(index + offset) % allArticles.length].id);
  }
  return ids;
}

export const ARTICLES: Article[] = allArticles.map((a, i) => ({
  ...a,
  similarIds: similarIdsFor(i),
}));

export const BOOKS: Book[] = t.books.books.map((b) => ({
  id: slugify(b.title),
  title: b.title,
  year: parseInt(b.year, 10),
  coverImage: b.cover,
  description: b.desc,
  purchaseUrl: b.purchaseUrl,
}));

export const CATEGORIES: CategoryInfo[] = [
  {
    id: "kose-yazilari",
    name: t.columns.title,
    count: columnArticles.length,
    description: t.columns.intro,
    bgGradient: "from-blue-700 to-blue-900",
    iconName: "PenTool",
  },
  {
    id: "analizler",
    name: t.analyses?.title ?? "Analizler",
    count: analysisArticles.length,
    description: t.analyses?.intro ?? "",
    bgGradient: "from-sky-700 to-sky-900",
    iconName: "FileText",
  },
  {
    id: "soylesiler",
    name: t.interviews?.title ?? "Söyleşiler",
    count: interviewArticles.length,
    description: t.interviews?.intro ?? "",
    bgGradient: "from-indigo-700 to-indigo-900",
    iconName: "MessageSquare",
  },
  {
    id: "akademik-makaleler",
    name: t.academicArticles?.title ?? "Akademik Makaleler",
    count: academicArticleList.length,
    description: t.academicArticles?.intro ?? "",
    bgGradient: "from-slate-800 to-slate-950",
    iconName: "Award",
  },
  {
    id: "kitaplar",
    name: t.books.title,
    count: BOOKS.length,
    description: t.books.intro,
    bgGradient: "from-cyan-700 to-cyan-900",
    iconName: "BookOpen",
  },
  {
    id: "kimdir",
    name: t.about.title,
    count: 1,
    description: t.about.lead,
    bgGradient: "from-blue-900 to-slate-950",
    iconName: "User",
  },
];

// Pull an explicit year or year-range out of a real bio paragraph, when one is stated —
// never invented for periods the text doesn't actually date.
function extractYearRange(text: string): string | undefined {
  const years = Array.from(text.matchAll(/\b(19|20)\d{2}\b/g)).map((m) => m[0]);
  if (years.length === 0) return undefined;
  const first = years[0];
  const last = years[years.length - 1];
  return first === last ? first : `${first}–${last}`;
}

export const TIMELINE_EVENTS: TimelineEvent[] = t.about.paragraphs.map((paragraph, i) => ({
  yearRange: extractYearRange(paragraph),
  title: t.about.eras[i] ?? t.about.title,
  description: paragraph,
  details: [paragraph],
}));

export const ABOUT_QUOTE = t.about.quote;
export const ABOUT_LEAD = t.about.lead;
export const ABOUT_FACTS = t.about.facts;
