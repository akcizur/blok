import type { CSSProperties } from 'react'
import type { Post } from '../data/posts'
import type { ViewMode } from '../config/viewModes'

type PostCardProps = {
  post: Post
  mode: ViewMode
  index: number
  articleClassName: string
  onOpen: (id: number) => void
  searchActive?: boolean
  searchResultIndex?: number
  query?: string
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^$()|[\]\\]/g, '\\$&')
}

function Highlight({ text, query }: { text: string; query?: string }) {
  const normalized = query?.trim()
  if (!normalized) return <>{text}</>

  const parts = text.split(new RegExp('(' + escapeRegExp(normalized) + ')', 'ig'))
  const lower = normalized.toLocaleLowerCase('cs-CZ')

  return (
    <>
      {parts.map((part, index) =>
        part.toLocaleLowerCase('cs-CZ') === lower
          ? <mark key={index}>{part}</mark>
          : part,
      )}
    </>
  )
}

function PostMeta({ post, compact = false }: { post: Post; compact?: boolean }) {
  return (
    <div className={'post-card-meta' + (compact ? ' compact-meta' : '')}>
      <span>{post.category}</span>
      <span aria-hidden="true">·</span>
      <span>{post.date}</span>
      <span aria-hidden="true">·</span>
      <span>{post.readTime}</span>
    </div>
  )
}

const sharedTitleStyle = (slug: string) =>
  ({ viewTransitionName: 'post-title-' + slug }) as CSSProperties

export function PostCard({
  post,
  mode,
  index,
  articleClassName,
  onOpen,
  searchActive = false,
  searchResultIndex = 0,
  query,
}: PostCardProps) {
  const open = () => onOpen(post.id)
  const label = 'Číst: ' + post.title
  const title = <Highlight text={post.title} query={query} />
  const resultId = 'search-result-' + searchResultIndex
  const className = 'post-link post-link-button' + (searchActive ? ' is-search-active' : '')

  if (mode === 'compact') return (
    <button id={resultId} type="button" className={className} onClick={open} aria-label={label}>
      <article className={articleClassName}>
        <div className="compact-copy">
          <span className="compact-title" style={sharedTitleStyle(post.slug)}>{title}</span>
        </div>
        <PostMeta post={post} compact />
      </article>
    </button>
  )

  if (mode === 'magazine') return (
    <button id={resultId} type="button" className={className} onClick={open} aria-label={label}>
      <article className={articleClassName + (index === 0 ? ' is-featured' : '')}>
        <PostMeta post={post} />
        <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
        {index === 0 && <p>{post.excerpt}</p>}
      </article>
    </button>
  )

  if (mode === 'grid') return (
    <button id={resultId} type="button" className={className} onClick={open} aria-label={label}>
      <article className={articleClassName}>
        <PostMeta post={post} />
        <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
        <p>{post.excerpt}</p>
      </article>
    </button>
  )

  return (
    <button id={resultId} type="button" className={className} onClick={open} aria-label={label}>
      <article className={articleClassName}>
        <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
        <p>{post.excerpt}</p>
        <PostMeta post={post} />
      </article>
    </button>
  )
}
