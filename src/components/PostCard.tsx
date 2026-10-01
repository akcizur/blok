import type { Post } from '../data/posts'
import type { ViewMode } from '../config/viewModes'

type PostCardProps = {
  post: Post
  mode: ViewMode
  index: number
  articleClassName: string
  onOpen: (id: number) => void
}

function PostMeta({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <div className={'post-card-meta' + (compact ? ' compact-meta' : '')}>
      <span>{post.category}</span><span aria-hidden="true">·</span><span>{post.date}</span><span aria-hidden="true">·</span><span>{post.readTime}</span>
    </div>
  )
}

export function PostCard({ post, mode, index, articleClassName, onOpen }: PostCardProps) {
  const open = () => onOpen(post.id)
  const label = 'Číst: ' + post.title

  if (mode === 'compact') return (
    <button type="button" className="post-link post-link-button" onClick={open} aria-label={label}>
      <article className={articleClassName} tabIndex={0}>
        <div className="compact-copy"><span className="compact-title">{post.title}</span></div>
        <PostMeta post={post} compact />
      </article>
    </button>
  )

  if (mode === 'magazine') return (
    <button type="button" className="post-link post-link-button" onClick={open} aria-label={label}>
      <article className={articleClassName + (index === 0 ? ' is-featured' : '')} tabIndex={0}>
        <PostMeta post={post} /><h4>{post.title}</h4>{index === 0 && <p>{post.excerpt}</p>}
      </article>
    </button>
  )

  if (mode === 'grid') return (
    <button type="button" className="post-link post-link-button" onClick={open} aria-label={label}>
      <article className={articleClassName} tabIndex={0}><PostMeta post={post} /><h4>{post.title}</h4><p>{post.excerpt}</p></article>
    </button>
  )

  return (
    <button type="button" className="post-link post-link-button" onClick={open} aria-label={label}>
      <article className={articleClassName} tabIndex={0}><h4>{post.title}</h4><p>{post.excerpt}</p><PostMeta post={post} /></article>
    </button>
  )
}