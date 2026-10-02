import type { Post } from '../data/posts'

type PostNavigationProps = {
  previous?: Post
  next?: Post
  related: Post[]
  onOpen: (post: Post) => void
}

export function PostNavigation({ previous, next, related, onOpen }: PostNavigationProps) {
  return (
    <div className="post-navigation">
      {(previous || next) && (
        <nav className="post-prev-next" aria-label="Navigace mezi poznámkami">
          {previous ? (
            <button type="button" className="post-nav-link post-nav-prev" onClick={() => onOpen(previous)}>
              <span>← Předchozí</span>
              <strong>{previous.title}</strong>
            </button>
          ) : <span />}
          {next ? (
            <button type="button" className="post-nav-link post-nav-next" onClick={() => onOpen(next)}>
              <span>Další →</span>
              <strong>{next.title}</strong>
            </button>
          ) : <span />}
        </nav>
      )}

      {related.length > 0 && (
        <section className="related-posts" aria-labelledby="related-heading">
          <div className="related-heading" id="related-heading">Další poznámky</div>
          <div className="related-list">
            {related.map(post => (
              <button type="button" className="related-link" key={post.id} onClick={() => onOpen(post)}>
                <span className="related-meta">{post.category} · {post.readTime}</span>
                <strong>{post.title}</strong>
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
