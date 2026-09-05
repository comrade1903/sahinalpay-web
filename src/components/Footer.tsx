import { Link, useLocation } from 'react-router-dom'
import { content } from '../content'
import { langForPath, paths } from '../routes'
import { CONTACT_EMAIL } from '../siteConfig'

export function Footer() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang]
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
            <Link to={paths[lang].home!}>{t.footer.backToTop}</Link>
            <Link to={paths[lang].cookies!}>{t.footer.cookieLabel}</Link>
          </nav>
        </div>
        <div className="footer-meta">
          <span>
            © {new Date().getFullYear()} Şahin Alpay. {t.footer.rights}
          </span>
          <span>{t.footer.tagline}</span>
        </div>
      </div>
    </footer>
  )
}
