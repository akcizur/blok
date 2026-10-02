import { useEffect, useRef, useState } from 'react'
import { Command, Moon, Search, Sun, X } from 'lucide-react'

export type CommandItem = {
  id: string
  label: string
  hint?: string
  onRun: () => void
  icon?: typeof Command
}

type Props = {
  open: boolean
  items: CommandItem[]
  onClose: () => void
}

export function CommandPalette({ open, items, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = items.filter(item =>
    (item.label + ' ' + (item.hint ?? '')).toLocaleLowerCase('cs-CZ').includes(query.trim().toLocaleLowerCase('cs-CZ')),
  )

  useEffect(() => {
    if (!open) return
    setQuery('')
    setActive(0)
    requestAnimationFrame(() => inputRef.current?.focus())
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose(); return }
      if (event.key === 'ArrowDown') { event.preventDefault(); setActive(v => Math.min(v + 1, Math.max(filtered.length - 1, 0))); return }
      if (event.key === 'ArrowUp') { event.preventDefault(); setActive(v => Math.max(v - 1, 0)); return }
      if (event.key === 'Enter' && filtered[active]) { event.preventDefault(); filtered[active].onRun(); onClose() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, filtered, active, onClose])

  if (!open) return null

  return (
    <div className="command-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) onClose() }}>
      <div className="command-palette" role="dialog" aria-modal="true" aria-label="Rychlé příkazy">
        <div className="command-search">
          <Command size={16} aria-hidden="true" />
          <input ref={inputRef} value={query} onChange={event => { setQuery(event.target.value); setActive(0) }} placeholder="Co chceš udělat?" aria-label="Hledat příkaz" />
          <button type="button" onClick={onClose} aria-label="Zavřít"><X size={14} /></button>
        </div>
        <div className="command-list">
          {filtered.length ? filtered.map((item, index) => {
            const Icon = item.icon ?? Search
            return (
              <button
                key={item.id}
                type="button"
                className={'command-item' + (index === active ? ' is-active' : '')}
                onMouseEnter={() => setActive(index)}
                onClick={() => { item.onRun(); onClose() }}
              >
                <Icon size={15} aria-hidden="true" />
                <span><strong>{item.label}</strong>{item.hint && <small>{item.hint}</small>}</span>
              </button>
            )
          }) : <div className="command-empty">Žádný příkaz</div>}
        </div>
        <div className="command-footer"><span>↑↓ výběr</span><span>Enter spustit</span><span>Esc zavřít</span></div>
      </div>
    </div>
  )
}

export const commandIcons = { Command, Moon, Sun }
