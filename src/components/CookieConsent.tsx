import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { content } from '../content'
import { langForPath, paths } from '../routes'
import { CONSENT_KEY, CONSENT_VALUE } from '../lib/preferences'
import { readStoredValue, writeStoredValue } from '../lib/storage'

/**
 * The notice is informational, not a consent gate: the site sets no cookies
 * and runs no tracking, and the three values it stores are functional. It
 * exists because KVKK and the GDPR require the disclosure.
 */
function readConsent(): boolean {
  return readStoredValue(CONSENT_KEY) === CONSENT_VALUE
}

export function CookieConsent() {
  const location = useLocation()
  const lang = langForPath(location.pathname)
  const t = content[lang].cookieNotice
  const [acknowledged, setAcknowledged] = useState(() => readConsent())

  if (acknowledged) return null

  const accept = () => {
    // Storage may be unavailable (private mode); the notice still dismisses
    // for this session, it just reappears on the next visit.
    writeStoredValue(CONSENT_KEY, CONSENT_VALUE)
    setAcknowledged(true)
  }

  return (
    // Slides in once (.cookie-notice in index.css); still under reduced motion.
    <aside className="cookie-notice" role="region" aria-label={t.ariaLabel}>
      <div className="container cookie-notice-inner">
        <p className="cookie-notice-text">
          {t.text} <Link to={paths[lang].cookies!}>{t.policyLinkLabel}</Link>
        </p>
        <div className="cookie-notice-actions">
          <button type="button" className="btn btn-primary" onClick={accept}>
            {t.acceptLabel}
          </button>
        </div>
      </div>
    </aside>
  )
}
