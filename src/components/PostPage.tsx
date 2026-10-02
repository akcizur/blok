import { ArrowLeft } from 'lucide-react'
import type { CSSProperties } from 'react'
import type { Post } from '../data/posts'
import { MarkdownRenderer } from './MarkdownRenderer'
import { PostNavigation } from './PostNavigation'

type PostPageProps = {
  post: Post
  posts: Post[]
  onBack: () => void
  onOpenPost: (post: Post) => void
}

const sharedTitleStyle = (slug: string) =>
  ({ viewTransitionName: 'post-title-' + slug }) as CSSProperties

export function PostPage({ post, posts, onBack, onOpenPost }: PostPageProps) {
  const currentIndex = posts.findIndex(item => item.id === post.id)
  const previous = currentIndex >= 0 ? posts[currentIndex + 1] : undefined
  const next = currentIndex > 0 ? posts[currentIndex - 1] : undefined

  const related = posts
    .filter(item => item.id !== post.id && (
      item.category === post.category ||
      item.tags.some(tag => post.tags.includes(tag))
    ))
    .slice(0, 3)

  return (
    <main className="main-content post-page">
      <button type="button" className="back-link back-button" onClick={onBack} aria-label="Zpět na poznámky">
        <ArrowLeft className="ui-icon" size={16} strokeWidth={2} aria-hidden="true" />
        <span>Zpět na poznámky</span>
      </button>

      <article className="post-detail">
        <header className="post-detail-header">
          <h1 className="post-detail-title" style={sharedTitleStyle(post.slug)}>{post.title}</h1>

          <div className="post-detail-meta">
            <span>{post.category}</span>
            <span aria-hidden="true">·</span>
            <span>{post.date}</span>
            <span aria-hidden="true">·</span>
            <span>{post.readTime}</span>
            <span aria-hidden="true">·</span>
            <span>{post.wordCount} slov</span>
          </div>

          {post.tags.length > 0 && (
            <div className="post-tags" aria-label="Štítky">
              {post.tags.map(tag => <span key={tag}>{tag}</span>)}
            </div>
          )}
        </header>

        <div className="post-detail-rule" />

        <p className="post-detail-excerpt">{post.excerpt}</p>

        <MarkdownRenderer html={post.content} />

        <PostNavigation previous={previous} next={next} related={related} onOpen={onOpenPost} />
      </article>
    </main>
  )
}
