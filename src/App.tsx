import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import {
  Globe2,
  Mail,
  Moon,
  Search,
  Sun,
} from 'lucide-react'
import { ContentSkeleton } from './components/ContentSkeleton'
import { PostCard } from './components/PostCard'
import { PostPage } from './components/PostPage'
import { SearchField } from './components/navigation/SearchField'
import { posts, type Post } from './data/posts'
import { navigateRoute, readRoute, type AppRoute } from './lib/routing'
import { usePreferences } from './hooks/usePreferences'
import { useSearch } from './hooks/useSearch'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import { VIEW_MODE_ORDER, VIEW_MODES } from './config/viewModes'

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished?: Promise<void> }
}

function resolvePostId(route: AppRoute) {
  if (route.kind === 'home') return null
  if (route.slug.startsWith('__legacy_id__')) {
    const id = Number(route.slug.slice('__legacy_id__'.length))
    return Number.isInteger(id) ? id : null
  }
  return posts.find(post => post.slug === route.slug)?.id ?? null
}

function pageDirection(currentId: number | null, nextId: number | null) {
  if (currentId === null && nextId !== null) return 'forward'
  if (currentId !== null && nextId === null) return 'back'

  const current = posts.findIndex(post => post.id === currentId)
  const next = posts.findIndex(post => post.id === nextId)
  return next < current ? 'forward' : 'back'
}

export default function App() {
  const { preferences, updatePreference } = usePreferences()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const initialRoute = readRoute()
  const [selectedPostId, setSelectedPostId] = useState<number | null>(() => resolvePostId(initialRoute))
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [transitionTargetPost, setTransitionTargetPost] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)
  const { save: saveScroll, restore: restoreScroll } = useScrollRestoration()

  const { theme, viewMode } = preferences
  const { results: filteredPosts, activeIndex, setActiveIndex } = useSearch(posts, searchQuery)
  const selectedPost = selectedPostId === null
    ? undefined
    : posts.find(post => post.id === selectedPostId)

  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const openSearch = useCallback(() => setSearchOpen(true), [])

  useEffect(() => {
    const route = readRoute()
    const id = resolvePostId(route)

    if (route.kind !== 'post') return

    if (route.slug.startsWith('__legacy_id__')) {
      const post = id === null ? undefined : posts.find(item => item.id === id)
      if (post) navigateRoute({ kind: 'post', slug: post.slug }, true)
      else navigateRoute({ kind: 'home' }, true)
      return
    }

    if (id === null) navigateRoute({ kind: 'home' }, true)
  }, [])

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
    }
  }, [])

  const applySelection = useCallback((nextId: number | null, restoreHome: boolean) => {
    setTransitionTargetPost(nextId !== null)

    const update = () => {
      flushSync(() => setSelectedPostId(nextId))
      window.scrollTo(0, 0)
      setIsPageTransitioning(false)
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const startTransition = reducedMotion
      ? undefined
      : (document as ViewTransitionDocument).startViewTransition

    document.documentElement.dataset.navDirection = pageDirection(selectedPostId, nextId)

    if (startTransition) {
      const transition = startTransition(update)
      if (restoreHome && transition.finished) {
        void transition.finished.then(() => restoreScroll('home'))
      }
      return
    }

    setIsPageTransitioning(true)
    window.requestAnimationFrame(update)

    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = window.setTimeout(() => {
      setIsPageTransitioning(false)
      if (restoreHome) restoreScroll('home')
    }, 360)
  }, [restoreScroll, selectedPostId])

  const navigateToPost = useCallback((postOrId: Post | number | null) => {
    const id = typeof postOrId === 'number' || postOrId === null ? postOrId : postOrId.id
    if (id === selectedPostId) return

    if (selectedPostId === null && id !== null) saveScroll('home')

    const post = id === null ? undefined : posts.find(item => item.id === id)
    const route: AppRoute = post
      ? { kind: 'post', slug: post.slug }
      : { kind: 'home' }

    navigateRoute(route)
    setSearchOpen(false)
    applySelection(id, id === null)
  }, [applySelection, saveScroll, selectedPostId])

  useEffect(() => {
    const syncRoute = () => {
      const route = readRoute()
      const id = resolvePostId(route)
      applySelection(id, route.kind === 'home')
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [applySelection])

  function moveActive(direction: 1 | -1) {
    if (!filteredPosts.length) return
    setActiveIndex(current => (current + direction + filteredPosts.length) % filteredPosts.length)
  }

  function submitSearch() {
    const target = filteredPosts[activeIndex]
    if (target) navigateToPost(target)
  }

  function handleLayoutToggle() {
    const index = VIEW_MODE_ORDER.indexOf(viewMode)
    const nextMode = VIEW_MODE_ORDER[(index + 1) % VIEW_MODE_ORDER.length]
    updatePreference('viewMode', nextMode)
  }

  function handleThemeToggle() {
    updatePreference('theme', theme === 'light' ? 'dark' : 'light')
  }

  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (email.trim()) setSubscribed(true)
  }

  return (
    <div className="app" data-theme={theme}>
      <header className="site-header">
        <div className="header-inner">
          <span className="brand">Blok</span>

          <nav className="header-actions" aria-label="Ovládání webu">
            <SearchField
              open={searchOpen}
              query={searchQuery}
              resultCount={filteredPosts.length}
              activeIndex={activeIndex}
              onOpen={openSearch}
              onClose={closeSearch}
              onQueryChange={setSearchQuery}
              onMoveActive={moveActive}
              onSubmit={submitSearch}
            />

            {!searchOpen && (
              <>
                <button
                  type="button"
                  className="nav-button"
                  onClick={handleThemeToggle}
                  title={'Motiv: ' + (theme === 'light' ? 'Světlý' : 'Tmavý')}
                  aria-label={'Změnit motiv. Aktuálně: ' + (theme === 'light' ? 'Světlý' : 'Tmavý')}
                >
                  {theme === 'light'
                    ? <Sun className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
                    : <Moon className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />}
                </button>

                <button
                  type="button"
                  className="nav-button"
                  onClick={handleLayoutToggle}
                  title={'Rozložení: ' + VIEW_MODES[viewMode].label}
                  aria-label={'Změnit rozložení. Aktuálně: ' + VIEW_MODES[viewMode].label}
                >
                  {(() => {
                    const ViewIcon = VIEW_MODES[viewMode].icon
                    return <ViewIcon className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
                  })()}
                </button>
              </>
            )}
          </nav>
        </div>
      </header>

      <div className={'page-stage' + (isPageTransitioning ? ' is-transitioning' : '')}>
        {isPageTransitioning ? (
          <ContentSkeleton post={transitionTargetPost} mode={viewMode} />
        ) : selectedPost ? (
          <PostPage
            post={selectedPost}
            posts={posts}
            onBack={() => navigateToPost(null)}
            onOpenPost={navigateToPost}
          />
        ) : (
          <main className="main-content">
            <section className="hero">
              <h1 className="hero-title">
                Poznámky o designu, kódu,<br />a tvorbě digitálních věcí.
              </h1>
              <p className="hero-copy">
                Blok je osobní zápisník Jakuba Růžičky o UI/UX designu, vývoji, kódu a brandingu. Najdeš tu poznámky z frontend a full-stack vývoje, práci s design systémy, tvorbu značek, experimenty a postřehy z reálných projektů.
              </p>
              <code className="site-chip">blok.ruzickajakub.cz</code>
            </section>

            <div className="posts-heading">
              <h2>Poznámky</h2>
              <span aria-live="polite">
                {searchQuery
                  ? filteredPosts.length + ' z ' + posts.length + ' poznámek'
                  : posts.length + ' poznámek'}
              </span>
            </div>

            <div className={'posts ' + VIEW_MODES[viewMode].containerClass} id="post-results" role="region" aria-label="Seznam poznámek">
              {filteredPosts.map((post, index) => (
                <PostCard
                  key={post.id}
                  post={post}
                  mode={viewMode}
                  index={index}
                  articleClassName={'post ' + VIEW_MODES[viewMode].articleClassName}
                  onOpen={navigateToPost}
                  searchActive={Boolean(searchQuery.trim()) && index === activeIndex}
                  searchResultIndex={index}
                  query={searchQuery}
                />
              ))}
            </div>

            {searchQuery && filteredPosts.length === 0 && (
              <div className="empty-search">
                <span className="empty-search-key">No results</span>
                <Search className="ui-icon" size={20} strokeWidth={2} aria-hidden="true" />
                <strong>Žádné poznámky nenalezeny</strong>
                <span>Zkus jiné hledání nebo vymaž filtr.</span>
                <button type="button" className="empty-search-reset" onClick={() => setSearchQuery('')}>Vymazat hledání</button>
              </div>
            )}

            <section className="newsletter">
              {subscribed ? (
                <div className="subscription-success">
                  <div className="success-icon">✓</div>
                  <div className="success-title">Jsi na seznamu.</div>
                  <p>Další poznámka dorazí do e-mailu.</p>
                </div>
              ) : (
                <>
                  <div className="newsletter-copy">
                    <h3>Získej další poznámku</h3>
                    <p>Občasná dávka poznámek o designu, kódu, vývoji a práci za obrazovkou.</p>
                  </div>
                  <form onSubmit={handleSubscribe} className="subscribe-form">
                    <input
                      className="email-input"
                      type="email"
                      value={email}
                      onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)}
                      placeholder="tvuj@email.cz"
                      required
                      aria-label="E-mailová adresa"
                    />
                    <button type="submit" className="subscribe-button" title="Odebírat" aria-label="Odebírat">
                      <Mail className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
                    </button>
                  </form>
                </>
              )}
            </section>
          </main>
        )}
      </div>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-copy">
            <span><strong>BLOK</strong> · Design, code, branding</span>
            <span>© 2026</span>
          </div>

          <nav className="footer-links" aria-label="Externí odkazy">
            <a className="footer-icon-link" href="https://blok.ruzickajakub.cz" target="_blank" rel="noreferrer" title="Web" aria-label="Otevřít web">
              <Globe2 className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
            </a>
            <a className="footer-icon-link" href="mailto:hello@ruzickajakub.cz" title="E-mail" aria-label="Odeslat e-mail">
              <Mail className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
            </a>
            <a className="footer-icon-link" href="https://github.com/akcizur/blog.ruzickajakub.cz" target="_blank" rel="noreferrer" title="GitHub repozitář" aria-label="Otevřít GitHub repozitář">
              <svg className="ui-icon" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.64-.2.64-.45v-1.72c-2.62.57-3.18-1.26-3.18-1.26-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.07-.58.07-.58.95.07 1.45.97 1.45.97.85 1.45 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.68 0-1.03.37-1.87.97-2.53.1-.24-.42-1.2.09-2.5 0 0 .79-.25 2.59.97A9 9 0 0 1 12 6.9c.8 0 1.6.11 2.35.33 1.8-1.22 2.59-.97 2.59-.97.51 1.3.19 2.26.09 2.5.6.66.97 1.5.97 2.53 0 3.64-2.2 4.44-4.3 4.67.34.3.64.88.64 1.78v2.64c0 .25.17.54.64.45A9.5 9.5 0 0 0 12 2.5Z" />
              </svg>
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
