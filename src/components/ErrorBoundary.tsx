import { Component, type ErrorInfo, type ReactNode } from 'react'
import { langForPath } from '../routes'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

const copy = {
  tr: {
    kicker: 'Beklenmeyen hata',
    title: 'Bir şeyler ters gitti',
    intro:
      'Sayfa görüntülenirken beklenmeyen bir hata oluştu. Arşiv içeriği yerinde duruyor; sayfayı yeniden yüklemek çoğu durumda yeterli oluyor.',
    reload: 'Sayfayı yenile',
    home: 'Ana sayfaya dön',
    details: 'Teknik ayrıntı',
  },
  en: {
    kicker: 'Unexpected error',
    title: 'Something went wrong',
    intro:
      'An unexpected error stopped this page from rendering. The archive itself is unaffected; reloading usually clears it.',
    reload: 'Reload the page',
    home: 'Back to the home page',
    details: 'Technical detail',
  },
} as const

/**
 * Root error boundary.
 *
 * Without one, a single render-time exception anywhere in the tree unmounts
 * the whole app and leaves the visitor on a blank white page with no way
 * back. This keeps the failure contained to a readable, bilingual screen
 * that offers a reload and a link home.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  override componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled render error', error, info.componentStack)
  }

  override render() {
    const { error } = this.state
    if (!error) return this.props.children

    const lang =
      typeof window === 'undefined' ? 'en' : langForPath(window.location.pathname)
    const t = copy[lang]
    const homePath = lang === 'tr' ? '/tr' : '/'

    return (
      <main className="section section-solo" id="main-content">
        <div className="container error-screen">
          <p className="kicker">{t.kicker}</p>
          <h1 className="section-title">{t.title}</h1>
          <p className="lead">{t.intro}</p>
          <div className="error-screen-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.location.reload()}
            >
              {t.reload}
            </button>
            <a className="btn btn-ghost" href={homePath}>
              {t.home}
            </a>
          </div>
          <details className="error-screen-details">
            <summary>{t.details}</summary>
            <pre>{error.message}</pre>
          </details>
        </div>
      </main>
    )
  }
}
