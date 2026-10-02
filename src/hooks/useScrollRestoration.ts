import { useEffect, useRef } from 'react'

export function useScrollRestoration() {
  const positions = useRef(new Map<string, number>())

  useEffect(() => {
    const previous = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'

    return () => {
      window.history.scrollRestoration = previous
    }
  }, [])

  function save(key: string) {
    positions.current.set(key, window.scrollY)
  }

  function restore(key: string) {
    const top = positions.current.get(key) ?? 0
    window.requestAnimationFrame(() => window.scrollTo(0, top))
  }

  return { save, restore }
}
