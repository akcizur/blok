import { useEffect, useRef } from 'react'
import hljs from 'highlight.js/lib/common'

type MarkdownRendererProps = {
  html: string
}

export function MarkdownRenderer({ html }: MarkdownRendererProps) {
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const codeBlocks = Array.from(root.querySelectorAll<HTMLElement>('pre code'))
    const cleanups: Array<() => void> = []

    codeBlocks.forEach((code, index) => {
      if (!code.className) code.classList.add('language-plaintext')
      if (!code.classList.contains('hljs')) {
        try {
          hljs.highlightElement(code)
        } catch {
          code.classList.add('hljs')
        }
      }

      const pre = code.closest('pre')
      if (!pre || pre.querySelector('.code-copy')) return

      const language = code.className.match(/language-([\w-]+)/)?.[1] ?? 'text'
      pre.dataset.codeLanguage = language

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'code-copy'
      button.setAttribute('aria-label', 'Kopírovat kód')
      button.title = 'Kopírovat'
      button.textContent = 'Copy'

      const copy = async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? '')
          button.textContent = 'Copied'
          button.classList.add('is-copied')
          window.setTimeout(() => {
            button.textContent = 'Copy'
            button.classList.remove('is-copied')
          }, 1200)
        } catch {
          button.textContent = 'Nelze kopírovat'
          window.setTimeout(() => {
            button.textContent = 'Copy'
          }, 1200)
        }
      }

      button.addEventListener('click', copy)
      pre.appendChild(button)
      cleanups.push(() => {
        button.removeEventListener('click', copy)
        button.remove()
      })

      if (index === 0) pre.classList.add('first-code-block')
    })

    return () => cleanups.forEach(cleanup => cleanup())
  }, [html])

  return <div ref={rootRef} className="markdown-renderer" dangerouslySetInnerHTML={{ __html: html }} />
}
