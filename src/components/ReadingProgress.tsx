import { useEffect, useRef } from 'react'

export function ReadingProgress() {
  const progressRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const node = progressRef.current
    if (!node) return

    let frame = 0

    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      node.style.transform = 'scaleX(' + progress + ')'
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return <div ref={progressRef} className="reading-progress" aria-hidden="true" />
}
