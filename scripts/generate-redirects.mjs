#!/usr/bin/env node
/**
 * Rewrites the `redirects` array in vercel.json.
 *
 * Two kinds live there, and both have to be server-side rather than
 * client-side. Since the build prerenders every real route and vercel.json has
 * no catch-all rewrite, an address with no file answers 404 — so a redirect
 * the app performs after mounting never gets the chance to run.
 *
 *   1. The English archive item routes, whose content exists only in Turkish.
 *   2. Retired slugs from src/archive/aliases.ts, so a citation of an old
 *      address keeps resolving.
 *
 * vercel.json is committed and CI fails if it is stale, the same way it does
 * for the sitemap.
 *
 *   npm run generate:redirects
 */
import fs from 'node:fs'
import path from 'node:path'
import { sectionPath } from './lib/archive-model.mjs'
import { loadModule, projectRoot } from './lib/load-archive.mjs'

const aliasesModule = await loadModule('src/archive/aliases.ts', 'aliases-redirects.mjs')
const routes = await loadModule('src/routes.ts', 'routes-redirects.mjs')
const { paths } = routes

/* Analyses, interviews and academic articles are Turkish-only content, but
   their English URLs are real addresses that appear in citations. */
const LANGUAGE_REDIRECTS = [
  ['analyses', 'analyses'],
  ['interviews', 'interviews'],
  ['academic', 'academic'],
].map(([pageKey]) => ({
  source: `${paths.en[pageKey]}/:slug`,
  destination: `${paths.tr[pageKey]}/:slug`,
  permanent: true,
}))

const aliasRedirects = []
for (const [lang, table] of Object.entries(aliasesModule.archiveSlugAliases)) {
  for (const [oldSlug, currentSlug] of Object.entries(table)) {
    /* An alias is recorded per language, and a slug's section is not encoded
       in the table, so every section that language serves gets an entry. The
       one that matches the record is the one a reader will ever hit. */
    for (const category of ['columns', 'analyses', 'interviews', 'academic']) {
      const base = await sectionPath(category, lang)
      if (!base) continue
      aliasRedirects.push({
        source: `${base}/${oldSlug}`,
        destination: `${base}/${currentSlug}`,
        permanent: true,
      })
    }
  }
}

const configPath = path.join(projectRoot, 'vercel.json')
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'))
/* Aliases first: they name an exact path, the language rules a pattern. */
config.redirects = [...aliasRedirects, ...LANGUAGE_REDIRECTS]
fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`)

console.log(
  `Wrote ${config.redirects.length} redirect(s) to vercel.json: ` +
    `${aliasRedirects.length} retired slug(s), ${LANGUAGE_REDIRECTS.length} language rule(s).`,
)
