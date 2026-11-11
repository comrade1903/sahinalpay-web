import { useReducedMotion } from '../lib/useReducedMotion'
import type { MouseEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { content } from '../content'
import { langForPath, paths } from '../routes'
import { CONTACT_EMAIL, SITE_CREDIT_EMAIL, SITE_CREDIT_NAME } from '../siteConfig'

/* Read once at load rather than during render, which oxlint's react(purity)
   rule flags: a static page only needs the year it was opened in. */
const CURRENT_YEAR = new Date().getFullYear()

export function Footer() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  const reduce = useReducedMotion()
  const isHome = (location.pathname.replace(/\/+$/, '') || '/') === paths[lang].home
  /* "Back to top" means the top of this page, not the home page. Focus goes
     to <main> as well, so a keyboard user's next Tab starts at the top too. */
  const toTop = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    window.scrollTo({ top: 0, left: 0, behavior: reduce ? 'instant' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }
  return (
    <footer className="site-footer" id="contact">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="kicker">{t.footer.kicker}</p>
            <p className="footer-name">Şahin Alpay</p>
          </div>
          <nav className="footer-links" aria-label={t.footer.navLabel}>
            <a href={`mailto:${CONTACT_EMAIL}`}>{t.footer.email}</a>
            <Link to={paths[lang].columns!}>{t.footer.columnsLabel}</Link>
            <Link to={paths[lang].books!}>{t.footer.booksLabel}</Link>
            <a href="#main-content" onClick={toTop}>
              {t.footer.backToTop}
            </a>
            <Link to={paths[lang].cookies!}>{t.footer.cookieLabel}</Link>
          </nav>
        </div>
        <div className="footer-meta">
          <span>
            © {CURRENT_YEAR} Şahin Alpay. {t.footer.rights}
          </span>
          <span>{t.footer.tagline}</span>
        </div>
        {/* The site's credit, on the home page only: compared exactly, since
            pageKeyForPath falls back to 'home' for unknown paths. */}
        {isHome && (
          <p className="footer-credit">
            {t.footer.creditLabel}{' '}
            <a href={`mailto:${SITE_CREDIT_EMAIL}`}>{SITE_CREDIT_NAME}</a>
          </p>
        )}
      </div>
    </footer>
  )
}
