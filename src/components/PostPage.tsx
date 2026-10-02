import { ArrowLeft, Bookmark, Check, Copy, Printer, Share2 } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Post } from '../data/posts'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostNavigation } from './PostNavigation'
import { ReadingProgress } from './ReadingProgress'

type PostPageProps = {
  post: Post
  posts: Post[]
  favorite: boolean
  onBack: () => void
  onOpenPost: (post: Post) => void
  onToggleFavorite: (id: number) => void
  onCopyLink: () => Promise<void> | void
}

const sharedTitleStyle = (slug: string) => ({ viewTransitionName: 'post-title-' + slug }) as CSSProperties

export function PostPage({ post, posts, favorite, onBack, onOpenPost, onToggleFavorite, onCopyLink }: PostPageProps) {
  const currentIndex = posts.findIndex(item => item.id === post.id)
  const previous = currentIndex >= 0 ? posts[currentIndex + 1] : undefined
  const next = currentIndex > 0 ? posts[currentIndex - 1] : undefined
  const related = posts.filter(item => item.id !== post.id && (item.category === post.category || item.tags.some(tag => post.tags.includes(tag)))).slice(0, 3)

  async function share() {
    const data = { title: post.title, text: post.excerpt, url: window.location.href }
    if (navigator.share) {
      try { await navigator.share(data) } catch { /* user cancelled */ }
    } else {
      await onCopyLink()
    }
  }

  function printPage() { window.print() }

  return (
    <main className="main-content post-page">
      <ReadingProgress />
      <div className="article-toolbar">
        <button type="button" className="back-link back-button" onClick={onBack} aria-label="Zpět na poznámky"><ArrowLeft size={16} /><span>Zpět na poznámky</span></button>
        <div className="article-actions" aria-label="Akce článku">
          <button type="button" className={'article-action' + (favorite ? ' is-active' : '')} onClick={() => onToggleFavorite(post.id)} aria-pressed={favorite} title={favorite ? 'Odebrat z oblíbených' : 'Přidat do oblíbených'}><Bookmark size={15} fill={favorite ? 'currentColor' : 'none'} /><span className="sr-only">Oblíbené</span></button>
          <button type="button" className="article-action" onClick={share} title="Sdílet"><Share2 size={15} /><span className="sr-only">Sdílet</span></button>
          <button type="button" className="article-action" onClick={onCopyLink} title="Kopírovat odkaz"><Copy size={15} /><span className="sr-only">Kopírovat odkaz</span></button>
          <button type="button" className="article-action" onClick={printPage} title="Tisk"><Printer size={15} /><span className="sr-only">Tisk</span></button>
        </div>
      </div>

      <article className="post-detail">
        <header className="post-detail-header">
          <div className="article-kicker"><span>{post.category}</span><span>{post.readTime}</span><span>{post.wordCount} slov</span></div>
          <h1 className="post-detail-title" style={sharedTitleStyle(post.slug)}>{post.title}</h1>
          <div className="post-detail-meta"><span>{post.date}</span>{post.tags.length > 0 && <><span aria-hidden="true">·</span><span>{post.tags.join(' · ')}</span></>}</div>
        </header>
        <div className="post-detail-rule" />
        <p className="post-detail-excerpt">{post.excerpt}</p>
        <MarkdownRenderer html={post.content} />
        <div className="article-end-tools">
          <span>Tohle byl konec poznámky.</span>
          <button type="button" onClick={onCopyLink}><Check size={13} /> Sdílet odkaz</button>
        </div>
        <PostNavigation previous={previous} next={next} related={related} onOpen={onOpenPost} />
      </article>
    </main>
  )
}
