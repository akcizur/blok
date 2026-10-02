import { useEffect, useMemo, useState } from 'react'
import type { Post } from '../data/posts'

function plainText(html: string) {
  if (typeof document === 'undefined') return html.replace(/<[^>]+>/g, ' ')
  const el = document.createElement('div')
  el.innerHTML = html
  return el.textContent ?? ''
}

export function useSearch(posts: Post[], query: string) {
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('cs-CZ')
    if (!normalized) return posts

    return posts.filter(post => {
      const haystack = [
        post.title,
        post.excerpt,
        post.category,
        post.date,
        post.slug,
        post.tags.join(' '),
        plainText(post.content),
      ]
        .join(' ')
        .toLocaleLowerCase('cs-CZ')

      return haystack.includes(normalized)
    })
  }, [posts, query])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  useEffect(() => {
    setActiveIndex(current => Math.min(current, Math.max(results.length - 1, 0)))
  }, [results.length])

  return {
    results,
    activeIndex,
    setActiveIndex,
  }
}
