import { copyFileSync, existsSync, mkdirSync } from 'node:fs'

if (!existsSync('dist/index.html')) {
  throw new Error('dist/index.html was not created before the postbuild step')
}

mkdirSync('dist', { recursive: true })
copyFileSync('dist/index.html', 'dist/404.html')
console.log('Created dist/404.html for GitHub Pages SPA fallback')
