import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'

const contentDir = 'src/content/posts'
const outDir = 'dist'
const basePath = (process.env.VITE_BASE_PATH || '/').replace(/\/+$/, '/')
const siteUrl = (process.env.SITE_URL || 'https://blok.ruzickajakub.cz').replace(/\/+$/, '')
const files = readdirSync(contentDir).filter(file => file.endsWith('.md')).sort()

const urls = [
  siteUrl + basePath,
  ...files.map(file => siteUrl + basePath + 'post/' + encodeURIComponent(file.replace(/\.md$/i, ''))),
]

const body = urls.map(url => '  <url><loc>' + url + '</loc></url>').join('\n')
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  body + '\n</urlset>\n'

mkdirSync(outDir, { recursive: true })
writeFileSync(join(outDir, 'sitemap.xml'), xml)
console.log('Generated dist/sitemap.xml with ' + urls.length + ' URLs')
