import { ArrowLeft } from 'lucide-react'
import type { Post } from '../data/posts'

type PostPageProps = {
  post: Post
}

export function PostPage({ post }: PostPageProps) {
  return (
    <main className="main-content post-page">
      <a className="back-link" href="./" aria-label="Zpět na poznámky">
        <ArrowLeft className="ui-icon" size={16} strokeWidth={2} aria-hidden="true" />
        <span>Zpět na poznámky</span>
      </a>

      <article className="post-detail">
        <h1 className="post-detail-title">{post.title}</h1>

        <div className="post-detail-meta">
          <span>{post.category}</span>
          <span aria-hidden="true">·</span>
          <span>{post.date}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readTime}</span>
        </div>

        <div className="post-detail-rule" />

        <p className="post-detail-excerpt">{post.excerpt}</p>

        <div className="post-detail-body" dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>
    </main>
  )
}
