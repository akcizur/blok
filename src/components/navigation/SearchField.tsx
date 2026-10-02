import { useEffect, useRef, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { Search, X } from 'lucide-react'

type SearchFieldProps = {
  open: boolean
  query: string
  resultCount: number
  activeIndex: number
  onOpen: () => void
  onClose: () => void
  onQueryChange: (value: string) => void
  onMoveActive: (direction: 1 | -1) => void
  onSubmit: () => void
}

export function SearchField({
  open,
  query,
  resultCount,
  activeIndex,
  onOpen,
  onClose,
  onQueryChange,
  onMoveActive,
  onSubmit,
}: SearchFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wasOpenRef = useRef(open)

  useEffect(() => {
    if (open) {
      const frame = window.requestAnimationFrame(() => inputRef.current?.focus())
      wasOpenRef.current = true
      return () => window.cancelAnimationFrame(frame)
    }

    if (wasOpenRef.current) {
      const frame = window.requestAnimationFrame(() => triggerRef.current?.focus())
      wasOpenRef.current = false
      return () => window.cancelAnimationFrame(frame)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    const handleOutsidePointer = (event: PointerEvent) => {
      const target = event.target
      if (target instanceof Node && !formRef.current?.contains(target)) onClose()
    }

    document.addEventListener('pointerdown', handleOutsidePointer)
    return () => document.removeEventListener('pointerdown', handleOutsidePointer)
  }, [open, onClose])

  useEffect(() => {
    const handleShortcut = (event: globalThis.KeyboardEvent) => {
      if (event.key !== '/' || open) return
      const target = event.target
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement || target instanceof HTMLElement && target.isContentEditable) return
      event.preventDefault()
      onOpen()
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [open, onOpen])

  function handleKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      onClose()
      return
    }

    if (event.key === 'ArrowDown' && resultCount) {
      event.preventDefault()
      onMoveActive(1)
      return
    }

    if (event.key === 'ArrowUp' && resultCount) {
      event.preventDefault()
      onMoveActive(-1)
      return
    }

    if (event.key === 'Enter' && resultCount) {
      event.preventDefault()
      onSubmit()
    }
  }

  return (
    <div className={`nav-search-shell${open ? ' is-open' : ''}`}>
      <button
        type="button"
        ref={triggerRef}
        className="nav-button nav-search-trigger"
        onClick={onOpen}
        title="Vyhledávání · /"
        aria-label="Otevřít vyhledávání"
        aria-expanded={open}
        aria-controls="blokk-search-form"
        tabIndex={open ? -1 : 0}
      >
        <Search className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
      </button>

      <form
        id="blokk-search-form"
        ref={formRef}
        className="nav-search-form"
        role="search"
        aria-hidden={!open}
        onSubmit={event => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <input
          ref={inputRef}
          className="nav-search-input"
          type="search"
          value={query}
          onChange={event => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Hledat…"
          aria-label="Hledat poznámky"
          aria-controls="post-results"
          aria-activedescendant={resultCount ? `search-result-${activeIndex}` : undefined}
          autoComplete="off"
          spellCheck={false}
          tabIndex={open ? 0 : -1}
        />

        <button
          type="submit"
          className="nav-search-action"
          aria-label="Spustit hledání"
          title={resultCount + " výsledků"}
          tabIndex={open ? 0 : -1}
        >
          <Search className="ui-icon" size={14} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="nav-search-close"
          onClick={() => {
            onQueryChange('')
            onClose()
          }}
          aria-label="Zavřít vyhledávání"
          title="Zavřít"
          tabIndex={open ? 0 : -1}
        >
          <X className="ui-icon" size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
