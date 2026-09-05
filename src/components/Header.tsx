import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { content, type Lang } from '../content'
import { equivalentPath, langForPath, pageKeyForPath, paths } from '../routes'
import { LANG_KEY, useTheme } from '../lib/preferences'
import { writeStoredValue } from '../lib/storage'

/**
 * Site header: wordmark, primary navigation, the mobile menu, and the
 * language and theme toggles.
 *
 * The mobile menu is a focus trap — background landmarks get `inert`, Tab
 * cycles within the panel and Escape returns focus to the button that opened
 * it. Keyboard access to the archive is not optional here.
 */
export function SunMoon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  )
}

export function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const lang = langForPath(location.pathname)
  const t = content[lang]
  const { toggle, isDark } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement | null>(null)
  const mobileNavRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuOpen) return undefined
    const background = [
      ...document.querySelectorAll<HTMLElement>(
        '.wordmark, .nav, .lang-toggle, .theme-toggle',
      ),
      document.getElementById('main-content'),
      document.querySelector('footer'),
    ].filter(Boolean) as HTMLElement[]
    background.forEach((element) => element.setAttribute('inert', ''))

    const firstLink = mobileNavRef.current?.querySelector<HTMLAnchorElement>('a')
    const focusFrame = window.requestAnimationFrame(() => firstLink?.focus())

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        window.requestAnimationFrame(() => menuButtonRef.current?.focus())
        return
      }
      if (event.key !== 'Tab') return

      const links = Array.from(
        mobileNavRef.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [],
      )
      const focusables = [menuButtonRef.current, ...links].filter(Boolean) as HTMLElement[]
      const first = focusables[0]
      const last = focusables.at(-1)
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      window.cancelAnimationFrame(focusFrame)
      background.forEach((element) => element.removeAttribute('inert'))
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuOpen])

  const onToggleLang = () => {
    const target: Lang = lang === 'tr' ? 'en' : 'tr'
    writeStoredValue(LANG_KEY, target)
    navigate(equivalentPath(location.pathname, target))
  }

  return (
    <>
      <a className="skip-link" href="#main-content">
        {lang === 'tr' ? 'Ana içeriğe geç' : 'Skip to main content'}
      </a>
      <header className="site-header" data-scrolled={scrolled}>
        <div className="container header-inner">
          <Link to={paths[lang].home!} className="wordmark">
            Şahin <span>Alpay</span>
          </Link>
          <nav className="nav" aria-label={lang === 'tr' ? 'Ana menü' : 'Primary'}>
            {t.nav.map((n) => (
              <Link
                key={n.key}
                to={paths[lang][n.key]!}
                aria-current={
                  pageKeyForPath(location.pathname) === n.key ? 'page' : undefined
                }
              >
                {n.label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <button
              type="button"
              className="mobile-menu-toggle"
              ref={menuButtonRef}
              aria-label={lang === 'tr' ? 'Menüyü aç veya kapat' : 'Open or close menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span className="material-symbols-outlined" aria-hidden="true">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          <button
            type="button"
            className="lang-toggle"
            onClick={onToggleLang}
            aria-label={t.langToggleLabel}
            lang={lang === 'tr' ? 'en' : 'tr'}
          >
            {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <button
            type="button"
            className="theme-toggle"
            onClick={toggle}
            aria-label={t.themeToggleLabel}
            aria-pressed={isDark}
          >
            <SunMoon />
          </button>
          </div>
        </div>
        <div
          className="mobile-nav-backdrop"
          data-open={menuOpen}
          onClick={() => {
            setMenuOpen(false)
            window.requestAnimationFrame(() => menuButtonRef.current?.focus())
          }}
          aria-hidden="true"
        />
        <nav
          id="mobile-nav"
          className="mobile-nav"
          ref={mobileNavRef}
          data-open={menuOpen}
          aria-label={lang === 'tr' ? 'Mobil menü' : 'Mobile menu'}
        >
          {t.nav.map((n) => (
            <Link
              key={n.key}
              to={paths[lang][n.key]!}
              aria-current={
                pageKeyForPath(location.pathname) === n.key ? 'page' : undefined
              }
              onClick={() => setMenuOpen(false)}
            >
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  )
}
