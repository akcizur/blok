import type { ViewMode } from '../config/viewModes'

type SkeletonProps = {
  post?: boolean
  mode?: ViewMode
}

function Line({ className = '' }: { className?: string }) {
  return <span className={`skeleton-line ${className}`} aria-hidden="true" />
}

export function ContentSkeleton({ post = false, mode = 'list' }: SkeletonProps) {
  if (post) {
    return (
      <main className="main-content post-page skeleton-page" aria-busy="true" aria-label="Načítání poznámky">
        <div className="skeleton-back">
          <Line className="skeleton-icon" />
          <Line className="skeleton-back-text" />
        </div>
        <article className="post-detail skeleton-detail">
          <Line className="skeleton-detail-title" />
          <Line className="skeleton-detail-title short" />
          <div className="skeleton-meta">
            <Line /><Line /><Line />
          </div>
          <Line className="skeleton-rule" />
          <Line className="skeleton-excerpt" />
          <Line className="skeleton-excerpt medium" />
          <div className="skeleton-body">
            <Line /><Line className="wide" /><Line className="medium" />
            <div className="skeleton-gap" />
            <Line className="wide" /><Line /><Line className="short" />
            <div className="skeleton-code">
              <Line /><Line /><Line className="medium" />
            </div>
            <Line className="wide" /><Line className="medium" />
          </div>
        </article>
      </main>
    )
  }

  return (
    <main className="main-content skeleton-page" aria-busy="true" aria-label="Načítání poznámek">
      <section className="hero skeleton-hero">
        <Line className="skeleton-hero-title" />
        <Line className="skeleton-hero-title short" />
        <Line className="skeleton-hero-copy" />
        <Line className="skeleton-hero-copy medium" />
        <Line className="skeleton-chip" />
      </section>
      <div className="posts-heading">
        <Line className="skeleton-heading" />
        <Line className="skeleton-count" />
      </div>
      <div className={`posts posts-list skeleton-posts posts-${mode}`}>
        {Array.from({ length: 5 }, (_, index) => (
          <article className={`skeleton-card skeleton-card-${mode}`} key={index}>
            <div className="skeleton-meta"><Line /><Line /><Line /></div>
            <Line className="skeleton-card-title" />
            <Line className="skeleton-card-copy" />
            {mode !== 'compact' && <Line className="skeleton-card-copy medium" />}
            {mode === 'grid' && <Line className="skeleton-card-copy short" />}
          </article>
        ))}
      </div>
    </main>
  )
}
