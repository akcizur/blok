import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { flushSync } from 'react-dom'
import { Bookmark, Command, Copy, Filter, Globe2, Mail, Moon, Search, Sun, X } from 'lucide-react'
import { ContentSkeleton } from './components/ContentSkeleton'
import { PostCard } from './components/PostCard'
import { PostPage } from './components/PostPage'
import { SearchField } from './components/navigation/SearchField'
import { CommandPalette, type CommandItem } from './components/CommandPalette'
import { posts, type Post } from './data/posts'
import { navigateRoute, readRoute, type AppRoute } from './lib/routing'
import { usePreferences } from './hooks/usePreferences'
import { useSearch } from './hooks/useSearch'
import { useScrollRestoration } from './hooks/useScrollRestoration'
import { VIEW_MODE_ORDER, VIEW_MODES } from './config/viewModes'
import { applyFontScale, getFavorites, getHistory, getReducedMotionPreference, getStoredFontScale, getStoredSort, getStoredTag, pushHistory, setReducedMotionPreference, setStoredFontScale, setStoredSort, setStoredTag, toggleFavorite, uniqueTags, type FontScale, type SortMode } from './lib/library'

type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void) => { finished?: Promise<void> } }

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
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>(() => getFavorites())
  const [history, setHistory] = useState<number[]>(() => getHistory())
  const [sortMode, setSortMode] = useState<SortMode>(() => getStoredSort())
  const [activeTag, setActiveTag] = useState(() => getStoredTag())
  const [fontScale, setFontScale] = useState<FontScale>(() => getStoredFontScale())
  const [focusFavorites, setFocusFavorites] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [motionReduced, setMotionReduced] = useState(() => getReducedMotionPreference())
  const [selectedPostId, setSelectedPostId] = useState<number | null>(() => resolvePostId(readRoute()))
  const [isPageTransitioning, setIsPageTransitioning] = useState(false)
  const [transitionTargetPost, setTransitionTargetPost] = useState(false)
  const transitionTimerRef = useRef<number | null>(null)
  const { save: saveScroll, restore: restoreScroll } = useScrollRestoration()
  const { theme, viewMode } = preferences

  useEffect(() => { applyFontScale(fontScale) }, [fontScale])
  useEffect(() => {
    setReducedMotionPreference(motionReduced)
    document.documentElement.dataset.reducedMotion = motionReduced ? 'true' : 'false'
  }, [motionReduced])

  const tags = useMemo(() => uniqueTags(posts), [])
  const orderedPosts = useMemo(() => {
    const list = posts.filter(post => {
      const tagMatch = activeTag === 'all' || post.tags.includes(activeTag)
      const favoriteMatch = !focusFavorites || favorites.includes(post.id)
      return tagMatch && favoriteMatch
    })
    return [...list].sort((a, b) => {
      if (sortMode === 'oldest') return a.timestamp - b.timestamp
      if (sortMode === 'title') return a.title.localeCompare(b.title, 'cs')
      if (sortMode === 'reading') return b.wordCount - a.wordCount
      return b.timestamp - a.timestamp || b.id - a.id
    })
  }, [activeTag, favorites, focusFavorites, sortMode])

  const { results: searchedPosts, activeIndex, setActiveIndex } = useSearch(orderedPosts, searchQuery)
  const selectedPost = selectedPostId === null ? undefined : posts.find(post => post.id === selectedPostId)

  useEffect(() => {
    document.title = selectedPost ? selectedPost.title + ' · Blok' : 'Blok'
    const description = selectedPost?.excerpt ?? 'Blok, poznámky o designu, kódu a tvorbě digitálních věcí.'
    document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [selectedPost])

  const closeSearch = useCallback(() => { setSearchOpen(false); setSearchQuery('') }, [])
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

  useEffect(() => () => {
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
  }, [])

  const applySelection = useCallback((nextId: number | null, restoreHome: boolean) => {
    setTransitionTargetPost(nextId !== null)
    const update = () => {
      flushSync(() => setSelectedPostId(nextId))
      window.scrollTo(0, 0)
      setIsPageTransitioning(false)
    }
    const reduced = motionReduced || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const doc = document as ViewTransitionDocument
    document.documentElement.dataset.navDirection = pageDirection(selectedPostId, nextId)
    if (!reduced && doc.startViewTransition) {
      const transition = doc.startViewTransition(update)
      if (restoreHome && transition.finished) void transition.finished.then(() => restoreScroll('home'))
      return
    }
    setIsPageTransitioning(true)
    if (transitionTimerRef.current !== null) window.clearTimeout(transitionTimerRef.current)
    transitionTimerRef.current = window.setTimeout(() => {
      transitionTimerRef.current = null
      window.requestAnimationFrame(() => { update(); if (restoreHome) restoreScroll('home') })
    }, reduced ? 0 : 90)
  }, [motionReduced, restoreScroll, selectedPostId])

  const navigateToPost = useCallback((postOrId: Post | number | null) => {
    const id = typeof postOrId === 'number' || postOrId === null ? postOrId : postOrId.id
    if (id === selectedPostId) return
    if (selectedPostId === null && id !== null) saveScroll('home')
    const post = id === null ? undefined : posts.find(item => item.id === id)
    if (post) setHistory(pushHistory(post.id))
    navigateRoute(post ? { kind: 'post', slug: post.slug } : { kind: 'home' })
    closeSearch()
    applySelection(id, id === null)
  }, [applySelection, closeSearch, saveScroll, selectedPostId])

  useEffect(() => {
    const syncRoute = () => {
      const route = readRoute()
      applySelection(resolvePostId(route), route.kind === 'home')
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [applySelection])

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target
      const typing = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target instanceof HTMLElement && target.isContentEditable
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        setPaletteOpen(true)
      } else if (!typing && event.key.toLowerCase() === 'f') {
        event.preventDefault()
        setFocusFavorites(value => !value)
      } else if (!typing && event.key.toLowerCase() === 'b') {
        event.preventDefault()
        if (selectedPostId !== null) setFavorites(toggleFavorite(selectedPostId))
      } else if (event.key === 'Escape') {
        setPaletteOpen(false)
        setFiltersOpen(false)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [selectedPostId])

  function moveActive(direction: 1 | -1) {
    if (!searchedPosts.length) return
    setActiveIndex(current => (current + direction + searchedPosts.length) % searchedPosts.length)
  }
  function submitSearch() {
    const target = searchedPosts[activeIndex]
    if (target) navigateToPost(target)
  }
  function handleLayoutToggle() {
    const index = VIEW_MODE_ORDER.indexOf(viewMode)
    updatePreference('viewMode', VIEW_MODE_ORDER[(index + 1) % VIEW_MODE_ORDER.length])
  }
  function handleThemeToggle() { updatePreference('theme', theme === 'light' ? 'dark' : 'light') }
  function handleFavorite(id: number) { setFavorites(toggleFavorite(id)) }
  function handleSort(value: SortMode) { setSortMode(value); setStoredSort(value) }
  function handleTag(value: string) { setActiveTag(value); setStoredTag(value) }
  function handleScale(value: FontScale) { setFontScale(value); setStoredFontScale(value) }
  function handleMotion() {
    setMotionReduced(value => !value)
  }
  async function copyLink() {
    const href = window.location.href
    try { await navigator.clipboard.writeText(href) } catch { /* clipboard is optional */ }
  }
  function handleSubscribe(event: FormEvent<HTMLFormElement>) { event.preventDefault(); if (email.trim()) setSubscribed(true) }

  const commandItems: CommandItem[] = [
    { id: 'search', label: 'Hledat', hint: '/', icon: Search, onRun: openSearch },
    { id: 'theme', label: theme === 'light' ? 'Tmavý motiv' : 'Světlý motiv', icon: theme === 'light' ? Moon : Sun, onRun: handleThemeToggle },
    { id: 'layout', label: 'Změnit rozložení', hint: VIEW_MODES[viewMode].label, icon: Filter, onRun: handleLayoutToggle },
    { id: 'favorite-filter', label: focusFavorites ? 'Zobrazit všechny' : 'Jen oblíbené', hint: 'F', icon: Bookmark, onRun: () => setFocusFavorites(value => !value) },
    { id: 'filters', label: filtersOpen ? 'Skrýt filtry' : 'Zobrazit filtry', icon: Filter, onRun: () => setFiltersOpen(value => !value) },
    { id: 'scale', label: 'Velikost textu: ' + fontScale, icon: Copy, onRun: () => handleScale(fontScale === 'small' ? 'normal' : fontScale === 'normal' ? 'large' : 'small') },
    { id: 'motion', label: 'Pohyb: ' + (motionReduced ? 'omezený' : 'plný'), icon: Command, onRun: handleMotion },
    { id: 'copy', label: 'Kopírovat odkaz', icon: Copy, onRun: copyLink },
  ]

  return (
    <div className="app" data-theme={theme}>
      <header className="site-header">
        <div className="header-inner">
          <button type="button" className="brand brand-button" onClick={() => navigateToPost(null)} aria-label="Blok, domů">Blok</button>
          <nav className="header-actions" aria-label="Ovládání webu">
            <SearchField open={searchOpen} query={searchQuery} resultCount={searchedPosts.length} activeIndex={activeIndex} onOpen={openSearch} onClose={closeSearch} onQueryChange={setSearchQuery} onMoveActive={moveActive} onSubmit={submitSearch} />
            {!searchOpen && <>
              <button type="button" className="nav-button" onClick={handleThemeToggle} title="Motiv" aria-label="Přepnout motiv">{theme === 'light' ? <Sun className="ui-icon" size={15} aria-hidden="true" /> : <Moon className="ui-icon" size={15} aria-hidden="true" />}</button>
              <button type="button" className="nav-button" onClick={handleLayoutToggle} title={'Rozložení: ' + VIEW_MODES[viewMode].label} aria-label={'Změnit rozložení: ' + VIEW_MODES[viewMode].label}>{(() => { const Icon = VIEW_MODES[viewMode].icon; return <Icon className="ui-icon" size={15} aria-hidden="true" /> })()}</button>
              <button type="button" className={'nav-button' + (focusFavorites ? ' is-active' : '')} onClick={() => setFocusFavorites(value => !value)} title="Oblíbené · F" aria-label="Zobrazit oblíbené"><Bookmark size={15} /></button>
              <button type="button" className={'nav-button' + (filtersOpen ? ' is-active' : '')} onClick={() => setFiltersOpen(value => !value)} title="Filtry" aria-label="Zobrazit filtry"><Filter size={15} /></button>
            </>}
          </nav>
        </div>
      </header>

      <CommandPalette open={paletteOpen} items={commandItems} onClose={() => setPaletteOpen(false)} />

      <div className={'page-stage' + (isPageTransitioning ? ' is-transitioning' : '')}>
        {isPageTransitioning ? <ContentSkeleton post={transitionTargetPost} mode={viewMode} /> : selectedPost ? (
          <PostPage post={selectedPost} posts={posts} favorite={favorites.includes(selectedPost.id)} onBack={() => navigateToPost(null)} onOpenPost={navigateToPost} onToggleFavorite={handleFavorite} onCopyLink={copyLink} />
        ) : (
          <main className="main-content">
            <section className="hero">
              <div className="hero-kicker"><span>PERSONAL NOTES</span><span>{posts.length} PUBLISHED</span></div>
              <h1 className="hero-title">Poznámky o designu, kódu,<br />a tvorbě digitálních věcí.</h1>
              <p className="hero-copy">Blok je osobní zápisník o UI/UX designu, vývoji, kódu a brandingu. Poznámky, experimenty a postřehy z reálných projektů.</p>
              <code className="site-chip">blok.ruzickajakub.cz</code>
            </section>

            <div className="posts-heading">
              <div><h2>Poznámky</h2><span className="posts-summary">{searchedPosts.length} výsledků · {favorites.length} oblíbených</span></div>
              <button type="button" className="text-control" onClick={() => setFiltersOpen(value => !value)} aria-expanded={filtersOpen}>{filtersOpen ? <X size={13} /> : <Filter size={13} />} {filtersOpen ? 'Skrýt' : 'Filtrovat'}</button>
            </div>

            {filtersOpen && (
              <section className="filter-panel" aria-label="Filtry a řazení">
                <div className="filter-row">
                  <div className="filter-group"><span>Řazení</span>
                    <select value={sortMode} onChange={event => handleSort(event.target.value as SortMode)} aria-label="Řazení poznámek">
                      <option value="newest">Nejnovější</option><option value="oldest">Nejstarší</option><option value="title">Podle názvu</option><option value="reading">Nejdelší</option>
                    </select>
                  </div>
                  <div className="filter-group"><span>Velikost textu</span>
                    <select value={fontScale} onChange={event => handleScale(event.target.value as FontScale)} aria-label="Velikost textu">
                      <option value="small">Malá</option><option value="normal">Normální</option><option value="large">Velká</option>
                    </select>
                  </div>
                  <button type="button" className={'filter-favorite' + (focusFavorites ? ' is-active' : '')} onClick={() => setFocusFavorites(value => !value)}><Bookmark size={14} /> Jen oblíbené</button>
                </div>
                <div className="tag-row" aria-label="Štítky">
                  <button type="button" className={activeTag === 'all' ? 'tag-filter is-active' : 'tag-filter'} onClick={() => handleTag('all')}>Vše</button>
                  {tags.map(tag => <button type="button" key={tag} className={activeTag === tag ? 'tag-filter is-active' : 'tag-filter'} onClick={() => handleTag(tag)}>{tag}</button>)}
                </div>
                <div className="filter-meta"><span>{searchedPosts.length} odpovídá filtru</span><button type="button" onClick={() => { handleTag('all'); setFocusFavorites(false); handleSort('newest') }}>Resetovat</button></div>
              </section>
            )}

            <div className={'posts ' + VIEW_MODES[viewMode].containerClass} id="post-results" role="region" aria-label="Seznam poznámek">
              {searchedPosts.map((post, index) => (
                <div key={post.id} className="post-result-wrap">
                  <PostCard post={post} mode={viewMode} index={index} articleClassName={'post ' + VIEW_MODES[viewMode].articleClassName} onOpen={navigateToPost} searchActive={Boolean(searchQuery.trim()) && index === activeIndex} searchResultIndex={index} query={searchQuery} />
                  <button type="button" className={'card-favorite' + (favorites.includes(post.id) ? ' is-active' : '')} onClick={() => handleFavorite(post.id)} aria-label={favorites.includes(post.id) ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'} title="Oblíbené"><Bookmark size={14} fill={favorites.includes(post.id) ? 'currentColor' : 'none'} /></button>
                </div>
              ))}
            </div>

            {searchQuery && searchedPosts.length === 0 && <div className="empty-search"><Search size={20} /><strong>Žádné poznámky nenalezeny</strong><span>Zkus jiné hledání nebo filtr.</span><button type="button" className="empty-search-reset" onClick={() => { setSearchQuery(''); handleTag('all'); setFocusFavorites(false) }}>Resetovat hledání</button></div>}

            {history.length > 0 && !searchQuery && !focusFavorites && <section className="history-strip"><div><span className="section-kicker">NAPOSLEDY ČTENÉ</span><strong>{history.map(id => posts.find(post => post.id === id)?.title).filter(Boolean).slice(0, 3).join(' · ')}</strong></div><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Nahoru</button></section>}

            <section className="newsletter">
              {subscribed ? <div className="subscription-success"><div className="success-icon">✓</div><div className="success-title">Jsi na seznamu.</div><p>Další poznámka dorazí do e-mailu.</p></div> : <>
                <div className="newsletter-copy"><h3>Získej další poznámku</h3><p>Občasná dávka poznámek o designu, kódu, vývoji a práci za obrazovkou.</p></div>
                <form onSubmit={handleSubscribe} className="subscribe-form"><input className="email-input" type="email" value={email} onChange={(event: ChangeEvent<HTMLInputElement>) => setEmail(event.target.value)} placeholder="tvuj@email.cz" required aria-label="E-mailová adresa" /><button type="submit" className="subscribe-button" title="Odebírat" aria-label="Odebírat"><Mail className="ui-icon" size={15} aria-hidden="true" /></button></form>
              </>}
            </section>
          </main>
        )}
      </div>

      <footer className="site-footer"><div className="footer-inner">
        <div className="footer-copy"><span><strong>BLOK</strong> · Design, code, branding</span><span>© 2026</span></div>
        <nav className="footer-links" aria-label="Externí odkazy">
          <a className="footer-icon-link" href="https://blok.ruzickajakub.cz" target="_blank" rel="noreferrer" title="Web" aria-label="Otevřít web"><Globe2 size={15} /></a>
          <a className="footer-icon-link" href="mailto:hello@ruzickajakub.cz" title="E-mail" aria-label="Odeslat e-mail"><Mail size={15} /></a>
          <a className="footer-icon-link" href="https://github.com/akcizur/blok" target="_blank" rel="noreferrer" title="GitHub repozitář" aria-label="Otevřít GitHub"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.47.09.64-.2.64-.45v-1.72c-2.62.57-3.18-1.26-3.18-1.26-.43-1.1-1.05-1.4-1.05-1.4-.86-.59.07-.58.07-.58.95.07 1.45.97 1.45.97.85 1.45 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.09-.24-4.29-1.05-4.29-4.68 0-1.03.37-1.87.97-2.53.1-.24-.42-1.2.09-2.5 0 0 .79-.25 2.59.97A9 9 0 0 1 12 6.9c.8 0 1.6.11 2.35.33 1.8-1.22 2.59-.97 2.59-.97.51 1.3.19 2.26.09 2.5.6.3.64.88.64 1.78v2.64c0 .25.17.54.64.45A9.5 9.5 0 0 0 12 2.5Z" /></svg></a>
        </nav>
      </div></footer>
    </div>
  )
}
