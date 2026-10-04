import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import type { Post } from '../data/posts'
import type { ViewMode } from '../config/viewModes'
import { hrefForRoute } from '../lib/routing'

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

type PostLinkProps = {
  post: Post
  id: string
  className: string
  onOpen: (id: number) => void
  children: ReactNode
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
    <div className="post-meta-stack">
      <div className={'post-card-meta' + (compact ? ' compact-meta' : '')}>
        <span>{post.category}</span>
        <span aria-hidden="true">·</span>
        <span>{post.date}</span>
        <span aria-hidden="true">·</span>
        <span>{post.readTime}</span>
      </div>
    </div>
  )
}

function PostTagRail({ post }: { post: Post }) {
  if (post.tags.length === 0) return null

  return (
    <aside className="post-tag-rail" aria-label="Štítky">
      {post.tags.slice(0, 4).map(tag => (
        <span key={tag}>#{tag.replace(/^#/, '')}</span>
      ))}
    </aside>
  )
}

function CardPreview({ post, mode }: { post: Post; mode: ViewMode }) {
  if (!post.previewImage || mode === 'compact' || mode === 'index' || mode === 'timeline') return null

  return (
    <div className={'post-preview post-preview-' + mode} aria-hidden="true">
      <img src={post.previewImage} alt="" loading="lazy" decoding="async" />
    </div>
  )
}

function CardContent({
  post,
  title,
  showExcerpt = true,
}: {
  post: Post
  title: ReactNode
  showExcerpt?: boolean
}) {
  return (
    <div className="post-card-copy">
      <div className="post-card-layout">
        <PostTagRail post={post} />
        <div className="post-card-main">
          <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
          {showExcerpt && <p>{post.excerpt}</p>}
          <PostMeta post={post} />
        </div>
      </div>
    </div>
  )
}

const sharedTitleStyle = (slug: string) =>
  ({ viewTransitionName: 'post-title-' + slug }) as CSSProperties

function PostLink({ post, id, className, onOpen, children }: PostLinkProps) {
  const handleClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()
    onOpen(post.id)
  }

  return (
    <a
      id={id}
      className={className}
      href={hrefForRoute({ kind: 'post', slug: post.slug })}
      onClick={handleClick}
      aria-label={'Číst: ' + post.title}
    >
      {children}
    </a>
  )
}

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
  const title = <Highlight text={post.title} query={query} />
  const resultId = 'search-result-' + searchResultIndex
  const className = 'post-link-button' + (searchActive ? ' is-search-active' : '')

  if (mode === 'compact') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <div className="compact-copy">
          <span className="compact-title" style={sharedTitleStyle(post.slug)}>{title}</span>
        </div>
        <PostMeta post={post} compact />
      </article>
    </PostLink>
  )

  if (mode === 'magazine') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName + (index === 0 ? ' is-featured' : '')}>
        <CardPreview post={post} mode={mode} />
        <CardContent post={post} title={title} showExcerpt={index === 0} />
      </article>
    </PostLink>
  )

  if (mode === 'grid') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <CardPreview post={post} mode={mode} />
        <CardContent post={post} title={title} />
      </article>
    </PostLink>
  )

  if (mode === 'timeline') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <div className="timeline-rail" aria-hidden="true">
          <span>{post.date.slice(-4)}</span>
          <i />
        </div>
        <div className="timeline-content">
          <div className="timeline-card-layout">
            <PostTagRail post={post} />
            <div className="timeline-card-main">
              <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
              <p>{post.excerpt}</p>
              <PostMeta post={post} />
            </div>
          </div>
        </div>
      </article>
    </PostLink>
  )

  if (mode === 'editorial') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName + (index === 0 ? ' is-featured' : '')}>
        <CardPreview post={post} mode={mode} />
        <CardContent post={post} title={title} />
      </article>
    </PostLink>
  )

  if (mode === 'index') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <span className="index-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div className="index-main">
          <div className="index-heading-row">
            <PostTagRail post={post} />
            <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
          </div>
          <PostMeta post={post} compact />
        </div>
      </article>
    </PostLink>
  )

  if (mode === 'columns') return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <CardPreview post={post} mode={mode} />
        <CardContent post={post} title={title} />
      </article>
    </PostLink>
  )

  return (
    <PostLink post={post} id={resultId} className={className} onOpen={onOpen}>
      <article className={articleClassName}>
        <h4 className="post-card-title" style={sharedTitleStyle(post.slug)}>{title}</h4>
        <p>{post.excerpt}</p>
        <PostMeta post={post} />
      </article>
    </PostLink>
  )
}
