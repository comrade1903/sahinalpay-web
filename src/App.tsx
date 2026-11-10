import { Suspense, lazy, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { content, type Lang } from './content'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { CookieConsent } from './components/CookieConsent'
import { PageLoading } from './components/PageLoading'
import HomePage from './pages/HomePage'
import { TurkishItemRedirect } from './pages/TurkishItemRedirect'
import { langForPath, type PageKey } from './routes'

/* ------------------------------------------------------------------
   Şahin Alpay — a personal & political legacy site. Bilingual (EN/TR),
   multi-page (each archive category is its own route — see routes.ts).

   This file is the shell: header, the route table, footer. Each page's
   code lives in src/pages (or its component folder) and is downloaded
   only when that page is opened. The home page is the exception: it is
   where most visits start, so it ships with the shell instead of costing
   a second request.
------------------------------------------------------------------ */

const AboutPage = lazy(() => import('./pages/AboutPage'))
const BooksPage = lazy(() => import('./pages/BooksPage'))
const TrialProcessPage = lazy(() => import('./pages/TrialProcessPage'))
const CookiePolicyPage = lazy(() => import('./pages/CookiePolicyPage'))
const ArchiveRoutePage = lazy(() => import('./pages/ArchiveRoutePage'))
const EnglishMirroredItem = lazy(() => import('./pages/EnglishMirroredItem'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ArticlePage = lazy(() => import('./components/reader').then((m) => ({ default: m.ArticlePage })))
const PressPage = lazy(() => import('./components/press').then((m) => ({ default: m.PressPage })))
const PressArticlePage = lazy(() =>
  import('./components/press').then((m) => ({ default: m.PressArticlePage })),
)
const PhotoStoryPage = lazy(() =>
  import('./components/PhotoStoryPage').then((m) => ({ default: m.PhotoStoryPage })),
)

function PageForKey({ pageKey, lang }: { pageKey: PageKey; lang: Lang }) {
  switch (pageKey) {
    case 'home':
      return <HomePage lang={lang} />
    case 'about':
      return <AboutPage lang={lang} />
    case 'books':
      return <BooksPage data={content[lang].books} lang={lang} />
    default:
      return <ArchiveRoutePage pageKey={pageKey} lang={lang} />
  }
}

function RouteFor({ lang, pageKey }: { lang: Lang; pageKey: PageKey }) {
  return <PageForKey pageKey={pageKey} lang={lang} />
}

function MainShell() {
  const location = useLocation()
  const mainRef = useRef<HTMLElement | null>(null)
  const didMount = useRef(false)

  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true
      return
    }
    // A route change is a new page, not a scroll within the old one — start
    // at the top regardless of where the previous page had scrolled to.
    // Explicit 'instant' overrides the site-wide smooth scroll-behavior,
    // which would otherwise animate all the way up from the old position.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    mainRef.current?.focus({ preventScroll: true })
  }, [location.pathname])


  return (
    <main id="main-content" tabIndex={-1} ref={mainRef}>
      {/* Inside <main>, so the floor under it keeps the footer still while a
          page's code arrives. */}
      <Suspense fallback={<PageLoading lang={langForPath(location.pathname)} />}>
      <Routes>
        <Route path="/" element={<RouteFor lang="en" pageKey="home" />} />
        <Route path="/about" element={<RouteFor lang="en" pageKey="about" />} />
        <Route
          path="/columns"
          element={<RouteFor lang="en" pageKey="columns" />}
        />
        <Route path="/columns/:slug" element={<ArticlePage lang="en" />} />
        <Route
          path="/analyses"
          element={<RouteFor lang="en" pageKey="analyses" />}
        />
        <Route
          path="/analyses/:slug"
          element={<TurkishItemRedirect pageKey="analyses" />}
        />
        <Route
          path="/interviews"
          element={<RouteFor lang="en" pageKey="interviews" />}
        />
        <Route
          path="/interviews/:slug"
          element={<EnglishMirroredItem pageKey="interviews" />}
        />
        <Route
          path="/academic-articles"
          element={<RouteFor lang="en" pageKey="academic" />}
        />
        <Route
          path="/academic-articles/:slug"
          element={<EnglishMirroredItem pageKey="academic" />}
        />
        <Route path="/my-story-in-photographs" element={<PhotoStoryPage lang="en" />} />
        <Route path="/books" element={<RouteFor lang="en" pageKey="books" />} />
        <Route path="/trial-process" element={<TrialProcessPage lang="en" />} />
        <Route path="/about-me-in-the-press" element={<PressPage lang="en" />} />
        <Route
          path="/about-me-in-the-press/:slug"
          element={<TurkishItemRedirect pageKey="press" />}
        />
        <Route path="/cookie-policy" element={<CookiePolicyPage lang="en" />} />

        <Route path="/tr" element={<RouteFor lang="tr" pageKey="home" />} />
        <Route
          path="/tr/kimdir"
          element={<RouteFor lang="tr" pageKey="about" />}
        />
        <Route
          path="/tr/kose-yazilari"
          element={<RouteFor lang="tr" pageKey="columns" />}
        />
        <Route
          path="/tr/kose-yazilari/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/tr/analizler"
          element={<RouteFor lang="tr" pageKey="analyses" />}
        />
        <Route
          path="/tr/analizler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/tr/soylesiler"
          element={<RouteFor lang="tr" pageKey="interviews" />}
        />
        <Route
          path="/tr/soylesiler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/tr/akademik-makaleler"
          element={<RouteFor lang="tr" pageKey="academic" />}
        />
        <Route
          path="/tr/akademik-makaleler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route path="/tr/fotograflarla-hikayem" element={<PhotoStoryPage lang="tr" />} />
        <Route
          path="/tr/kitaplar"
          element={<RouteFor lang="tr" pageKey="books" />}
        />
        <Route
          path="/tr/yargilanma-surecim"
          element={<TrialProcessPage lang="tr" />}
        />
        <Route path="/tr/basinda-hakkimda" element={<PressPage lang="tr" />} />
        <Route
          path="/tr/basinda-hakkimda/:slug"
          element={<PressArticlePage lang="tr" />}
        />
        <Route
          path="/tr/cerez-politikasi"
          element={<CookiePolicyPage lang="tr" />}
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </main>
  )
}

export default function App() {
  return (
    <>
      <Header />
      <MainShell />
      <Footer />
      <CookieConsent />
    </>
  )
}
