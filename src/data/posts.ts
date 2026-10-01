import { marked } from 'marked'

export type Post = {
  id: number
  title: string
  excerpt: string
  category: string
  date: string
  readTime: string
  slug: string
  content: string
}

marked.setOptions({
  gfm: true,
  breaks: false,
})

const markdownModules = import.meta.glob('../content/posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function parseValue(value: string): string {
  const trimmed = value.trim()
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1)
  }
  return trimmed
}

function parseFrontmatter(source: string): { data: Record<string, string>; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return { data: {}, body: source.trim() }
  }

  const data: Record<string, string> = {}

  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const value = parseValue(line.slice(separator + 1))

    if (key) data[key] = value
  }

  return {
    data,
    body: match[2].trim(),
  }
}

function toPost(path: string, source: string): Post {
  const { data, body } = parseFrontmatter(source)
  const fileName = path.split('/').pop() ?? 'post'
  const slug = fileName.replace(/\.md$/i, '')

  for (const key of ['title', 'excerpt', 'category', 'date', 'readTime']) {
    if (!data[key]) {
      throw new Error('Missing "' + key + '" frontmatter in ' + fileName)
    }
  }

  const id = Number(data.id)
  if (!Number.isInteger(id) || id < 1) {
    throw new Error('Invalid "id" frontmatter in ' + fileName)
  }

  return {
    id,
    title: data.title,
    excerpt: data.excerpt,
    category: data.category,
    date: data.date,
    readTime: data.readTime,
    slug,
    content: marked.parse(body),
  }
}

export const posts: Post[] = Object.entries(markdownModules)
  .map(([path, source]) => toPost(path, source))
  .sort((a, b) => b.id - a.id)
