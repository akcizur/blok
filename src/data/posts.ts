import { calculateReadTime, parseFrontmatter, renderMarkdown } from '../lib/markdown'

export type Post = {
  id: number
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  slug: string
  tags: string[]
  content: string
  timestamp: number
  wordCount: number
}

const markdownModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseDate(value: string) {
  const trimmed = value.trim()
  const iso = Date.parse(trimmed)
  if (!Number.isNaN(iso)) return iso

  const match = trimmed.match(/^(\d{1,2})\.\s*(\d{1,2})\.\s*(\d{4})$/)
  if (!match) return 0

  const [, day, month, year] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

function asString(value: string | string[] | undefined, key: string, fileName: string) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new Error('Missing "' + key + '" frontmatter in ' + fileName)
  }
  return value.trim()
}

function toPost(path: string, source: string): Post {
  const { data, body } = parseFrontmatter(source)
  const fileName = path.split('/').pop() ?? 'post'
  const slug = fileName.replace(/\.md$/i, '')

  const idValue = asString(data.id, 'id', fileName)
  const id = Number(idValue)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Invalid "id" frontmatter in ' + fileName)
  }

  const title = asString(data.title, 'title', fileName)
  const excerpt = asString(data.excerpt, 'excerpt', fileName)
  const category = asString(data.category, 'category', fileName)
  const date = asString(data.date, 'date', fileName)
  const tags = Array.isArray(data.tags) && data.tags.length > 0 ? data.tags : [category]
  const timestamp = parseDate(date)
  const wordCount = body.split(/\s+/).filter(Boolean).length

  return {
    id,
    title,
    excerpt,
    category,
    date,
    readTime: calculateReadTime(body) + ' min',
    slug,
    tags,
    content: renderMarkdown(body),
    timestamp,
    wordCount,
  }
}

export const posts: Post[] = Object.entries(markdownModules)
  .map(([path, source]) => toPost(path, source))
  .sort((a, b) => b.timestamp - a.timestamp || b.id - a.id)
