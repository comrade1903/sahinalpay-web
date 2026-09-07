/**
 * Single source of truth for the site's public identity.
 *
 * The origin, contact address and social-preview image used to be repeated
 * across index.html, App.tsx, the sitemap script and robots.txt, so a domain
 * change meant hunting for string literals. Everything now derives from here:
 * the app imports it, `vite.config.ts` substitutes it into index.html at build
 * time, and the content scripts read it through scripts/lib/site-config.mjs.
 *
 * The origin is `sahinalpay.com`, registered and confirmed by the owner on
 * 2026-09-08. It replaced the placeholder `sahinalpay.net`, which was never
 * registered, so every canonical, JSON-LD @id, sitemap URL and robots entry
 * pointed at a domain that did not resolve. Changing SITE_ORIGIN below
 * rewrites all of them in one edit; regenerate the sitemap and robots.txt
 * after any such change.
 */

export const SITE_ORIGIN = 'https://sahinalpay.com'

/** The owner's real, monitored mailbox. Deliberately not contact@ on the
 *  site's own domain: that address does not exist, and a published contact
 *  address that silently bounces is worse than an unbranded one — this is the
 *  KVKK data-controller address and the security contact, so mail sent to it
 *  has to arrive. If a domain mailbox or a forwarder is set up later, change
 *  this one line. */
export const CONTACT_EMAIL = 'sahinalpay44@gmail.com'

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
