/**
 * Single source of truth for the site's public identity.
 *
 * The origin, contact address and social-preview image used to be repeated
 * across index.html, App.tsx, the sitemap script and robots.txt, so a domain
 * change meant hunting for string literals. Everything now derives from here:
 * the app imports it, `vite.config.ts` substitutes it into index.html at build
 * time, and the content scripts read it through scripts/lib/site-config.mjs.
 *
 * NOTE: the production domain is still the placeholder `sahinalpay.net`.
 * Switching to the registered `sahinalpay.com` is the owner's call — see the
 * `domain-migration` skill. Changing SITE_ORIGIN below now rewrites every
 * canonical, JSON-LD @id, sitemap URL and robots entry in one edit.
 */

export const SITE_ORIGIN = 'https://sahinalpay.net'

export const CONTACT_EMAIL = 'contact@sahinalpay.net'

/** Social-preview card. Typographic, drawn from this site's own palette and
 *  display face by scripts/generate-og-image.py; the committed PNG is what
 *  ships. PNG rather than SVG because the major card scrapers do not render
 *  SVG. index.html used to point at an /og-image.png that was never in
 *  public/, so every shared link fell back to no image at all. */
export const OG_IMAGE_PATH = '/og-image.png'

export const OG_IMAGE_TYPE = 'image/png'

export const OG_IMAGE_WIDTH = 1200

export const OG_IMAGE_HEIGHT = 630

/** Stable JSON-LD node identifiers, referenced from several schema graphs. */
export const PERSON_ID = `${SITE_ORIGIN}/#person`

export const WEBSITE_ID = `${SITE_ORIGIN}/#website`

export function siteUrl(pathname: string): string {
  return `${SITE_ORIGIN}${pathname}`
}
