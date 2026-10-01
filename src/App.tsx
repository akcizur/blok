import { useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import {
  Globe2,
  Mail,
  Moon,
  Search,
  Sun,
  X,
} from 'lucide-react'
import { PostPage } from './components/PostPage'
import { ContentSkeleton } from './components/ContentSkeleton'
import { PostCard } from './components/PostCard'
import { posts } from './data/posts'
import { VIEW_MODE_ORDER, VIEW_MODES } from './config/viewModes'
import { usePreferences } from './hooks/usePreferences'

export default function App() {
  const { preferences, updatePreference } = usePreferences()
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const searchFormRef = useRef<HTMLFormElement>(null)
  const [selectedPostId, setSelectedPostId] = useState<number | null>(() => {
    const value = new URLSearchParams(window.location.search).get('post')
    const id = value ? Number(value) : NaN
    return Number.isInteger(id) && id > 0 ? id : null
  })

  const { theme, viewMode } = preferences
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
    }
  }, [])

  function navigateToPost(id: number | null) {
    setIsPageTransitioning(true)
    const url = id ? `?post=${id}` : window.location.pathname
    window.history.pushState({}, '', url)
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
    window.requestAnimationFrame(() => {
      setSelectedPostId(id)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      transitionTimerRef.current = window.setTimeout(() => setIsPageTransitioning(false), 420)
    })
  }

  const selectedPost = selectedPostId
    ? posts.find(post => post.id === selectedPostId)
    : undefined

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return posts

    return posts.filter(post =>
      [post.title, post.excerpt, post.category, post.date, post.content]
        .join(' ')
        .toLowerCase()
        .includes(query),
    )
  }, [searchQuery])

  useEffect(() => {
    if (!searchOpen) return

    const frame = window.requestAnimationFrame(() => {
      searchInputRef.current?.focus()
    })
    return () => window.cancelAnimationFrame(frame)
  }, [searchOpen])

  useEffect(() => {
    if (!searchOpen) return

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !searchFormRef.current?.contains(target)) {
        setSearchOpen(false)
      }
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    return () => document.removeEventListener('pointerdown', handleOutsidePointer)
  }, [searchOpen])

  useEffect(() => {
    const syncPost = () => {
      const value = new URLSearchParams(window.location.search).get('post')
      const id = value ? Number(value) : NaN
      setSelectedPostId(Number.isInteger(id) && id > 0 ? id : null)
    }
    window.addEventListener('popstate', syncPost)
    return () => window.removeEventListener('popstate', syncPost)
  }, [])

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
            <div className={`nav-search-shell${searchOpen ? ' is-open' : ''}`}>
              <button
                type="button"
                className="nav-button nav-search-trigger"
                onClick={() => setSearchOpen(true)}
                title="Vyhledávání"
                aria-label="Otevřít vyhledávání"
                tabIndex={searchOpen ? -1 : 0}
              >
                <Search className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
              </button>

              <form
                ref={searchFormRef}
                id="navbar-search"
                className="nav-search-form"
                role="search"
                aria-hidden={!searchOpen}
                onSubmit={event => event.preventDefault()}
                onKeyDown={event => {
                  if (event.key === 'Escape') {
                    setSearchOpen(false)
                    searchInputRef.current?.blur()
                  }
                }}
              >
                <input
                  ref={searchInputRef}
                  className="nav-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => setSearchQuery(event.target.value)}
                  placeholder="Hledat…"
                  aria-label="Hledat poznámky"
                  autoComplete="off"
                  spellCheck={false}
                  tabIndex={searchOpen ? 0 : -1}
                />

                <button
                  type="button"
                  className="nav-search-action"
                  onClick={() => searchInputRef.current?.focus()}
                  aria-label="Zaměřit vyhledávání"
                  title="Hledat"
                  tabIndex={searchOpen ? 0 : -1}
                >
                  <Search className="ui-icon" size={14} strokeWidth={2} aria-hidden="true" />
                </button>

                <button
                  type="button"
                  className="nav-search-close"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchOpen(false)
                  }}
                  aria-label="Zavřít vyhledávání"
                  title="Zavřít"
                  tabIndex={searchOpen ? 0 : -1}
                >
                  <X className="ui-icon" size={13} strokeWidth={2} aria-hidden="true" />
                </button>
              </form>
            </div>

            {!searchOpen && (
              <>
                <button
                  type="button"
                  className="nav-button"
                  onClick={handleThemeToggle}
                  title={`Motiv: ${theme === 'light' ? 'Světlý' : 'Tmavý'}`}
                  aria-label={`Změnit motiv. Aktuálně: ${theme === 'light' ? 'Světlý' : 'Tmavý'}`}
                >
                  {theme === 'light' ? (
                    <Sun className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
                  ) : (
                    <Moon className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
                  )}
                </button>

                <button
                  type="button"
                  className="nav-button"
                  onClick={handleLayoutToggle}
                  title={`Rozložení: ${VIEW_MODES[viewMode].label}`}
                  aria-label={`Změnit rozložení. Aktuálně: ${VIEW_MODES[viewMode].label}`}
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

      <div className={`page-stage${isPageTransitioning ? ' is-transitioning' : ''}`}>
        {isPageTransitioning ? (
          <ContentSkeleton post={Boolean(selectedPost)} mode={viewMode} />
        ) : selectedPost ? (
          <PostPage post={selectedPost} onBack={() => navigateToPost(null)} />
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
            <span>
              {searchQuery
                ? `${filteredPosts.length} z ${posts.length} poznámek`
                : `${posts.length} poznámek`}
            </span>
          </div>

          <div className="posts posts-list">
            {filteredPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                mode={viewMode}
                index={index}
                articleClassName={`post post-${viewMode}`}
                onOpen={navigateToPost}
              />
            ))}
          </div>

          {searchQuery && filteredPosts.length === 0 && (
            <div className="empty-search">
              <Search className="ui-icon" size={20} strokeWidth={2} aria-hidden="true" />
              <strong>Žádné poznámky nenalezeny</strong>
              <span>Zkus jiné hledání.</span>
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
            <a
              className="footer-icon-link"
              href="https://blok.ruzickajakub.cz"
              target="_blank"
              rel="noreferrer"
              title="Web"
              aria-label="Otevřít web"
            >
              <Globe2 className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
            </a>

            <a
              className="footer-icon-link"
              href="mailto:hello@ruzickajakub.cz"
              title="E-mail"
              aria-label="Odeslat e-mail"
            >
              <Mail className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
            </a>

            <a
              className="footer-icon-link"
              href="https://github.com/akcizur/blog.ruzickajakub.cz"
              target="_blank"
              rel="noreferrer"
              title="GitHub repozitář"
              aria-label="Otevřít GitHub repozitář"
            >
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
