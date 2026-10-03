import { marked } from 'marked'

export type Frontmatter = Record<string, string | string[]>

marked.setOptions({
  gfm: true,
  breaks: false,
})

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

export function parseListValue(value: string): string[] {
  const trimmed = value.trim()
  const body = trimmed.startsWith('[') && trimmed.endsWith(']')
    ? trimmed.slice(1, -1)
    : trimmed

  return body
    .split(',')
    .map(item => parseValue(item).trim())
    .filter(Boolean)
}

export function parseFrontmatter(source: string): { data: Frontmatter; body: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!match) return { data: {}, body: source.trim() }

  const data: Frontmatter = {}
  for (const line of match[1].split(/\r?\n/)) {
    const separator = line.indexOf(':')
    if (separator === -1) continue

    const key = line.slice(0, separator).trim()
    const rawValue = line.slice(separator + 1).trim()
    if (!key) continue

    data[key] = key === 'tags' ? parseListValue(rawValue) : parseValue(rawValue)
  }

  return { data, body: match[2].trim() }
}

function textFromHtml(value: string) {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

export function slugifyHeading(value: string) {
  return textFromHtml(value)
    .toLocaleLowerCase('cs-CZ')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
}

export function calculateReadTime(markdown: string) {
  const words = markdown
    .replace(/[^a-zA-Z0-9À-ž]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean).length

  return Math.max(1, Math.ceil(words / 200))
}

export function renderMarkdown(markdown: string) {
  let html = String(marked.parse(markdown))
  html = html.replace(/^\s*<h1[^>]*>[\s\S]*?<\/h1>\s*/i, '')

  const usedIds = new Map<string, number>()
  html = html.replace(/<h(2|3|4)>([\s\S]*?)<\/h(2|3|4)>/gi, (_match, depth: string, text: string) => {
    const base = slugifyHeading(text) || 'section-' + depth
    const count = usedIds.get(base) ?? 0
    usedIds.set(base, count + 1)
    const id = count ? base + '-' + (count + 1) : base
    return '<h' + depth + ' id="' + id + '"><a class="heading-anchor" href="#' + id + '" aria-label="Odkaz na sekci">#</a><span class="heading-text">' + text + '</span></h' + depth + '>'
  })

  html = html.replace(
    /<pre><code(?: class="language-([^"]+)")?>/gi,
    (_match, language?: string) =>
      '<pre data-code-language="' + (language ?? 'text') + '"><code' +
      (language ? ' class="language-' + language + '"' : '') +
      '>',
  )

  return html
}
