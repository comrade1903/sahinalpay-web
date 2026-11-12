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
        <Route path="/en" element={<RouteFor lang="en" pageKey="home" />} />
        <Route path="/en/about" element={<RouteFor lang="en" pageKey="about" />} />
        <Route
          path="/en/columns"
          element={<RouteFor lang="en" pageKey="columns" />}
        />
        <Route path="/en/columns/:slug" element={<ArticlePage lang="en" />} />
        <Route
          path="/en/analyses"
          element={<RouteFor lang="en" pageKey="analyses" />}
        />
        <Route
          path="/en/analyses/:slug"
          element={<TurkishItemRedirect pageKey="analyses" />}
        />
        <Route
          path="/en/interviews"
          element={<RouteFor lang="en" pageKey="interviews" />}
        />
        <Route
          path="/en/interviews/:slug"
          element={<EnglishMirroredItem pageKey="interviews" />}
        />
        <Route
          path="/en/academic-articles"
          element={<RouteFor lang="en" pageKey="academic" />}
        />
        <Route
          path="/en/academic-articles/:slug"
          element={<EnglishMirroredItem pageKey="academic" />}
        />
        <Route path="/en/my-story-in-photographs" element={<PhotoStoryPage lang="en" />} />
        <Route path="/en/books" element={<RouteFor lang="en" pageKey="books" />} />
        <Route path="/en/trial-process" element={<TrialProcessPage lang="en" />} />
        <Route path="/en/about-me-in-the-press" element={<PressPage lang="en" />} />
        <Route
          path="/en/about-me-in-the-press/:slug"
          element={<TurkishItemRedirect pageKey="press" />}
        />
        <Route path="/en/cookie-policy" element={<CookiePolicyPage lang="en" />} />

        <Route path="/" element={<RouteFor lang="tr" pageKey="home" />} />
        <Route
          path="/kimdir"
          element={<RouteFor lang="tr" pageKey="about" />}
        />
        <Route
          path="/kose-yazilari"
          element={<RouteFor lang="tr" pageKey="columns" />}
        />
        <Route
          path="/kose-yazilari/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/analizler"
          element={<RouteFor lang="tr" pageKey="analyses" />}
        />
        <Route
          path="/analizler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/soylesiler"
          element={<RouteFor lang="tr" pageKey="interviews" />}
        />
        <Route
          path="/soylesiler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route
          path="/akademik-makaleler"
          element={<RouteFor lang="tr" pageKey="academic" />}
        />
        <Route
          path="/akademik-makaleler/:slug"
          element={<ArticlePage lang="tr" />}
        />
        <Route path="/fotograflarla-hikayem" element={<PhotoStoryPage lang="tr" />} />
        <Route
          path="/kitaplar"
          element={<RouteFor lang="tr" pageKey="books" />}
        />
        <Route
          path="/yargilanma-surecim"
          element={<TrialProcessPage lang="tr" />}
        />
        <Route path="/basinda-hakkimda" element={<PressPage lang="tr" />} />
        <Route
          path="/basinda-hakkimda/:slug"
          element={<PressArticlePage lang="tr" />}
        />
        <Route
          path="/cerez-politikasi"
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
