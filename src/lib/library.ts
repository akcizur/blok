export type SortMode = 'newest' | 'oldest' | 'title' | 'reading'
export type FontScale = 'small' | 'normal' | 'large'

const PREFIX = 'blok-v2'
const keys = {
  favorites: PREFIX + ':favorites',
  history: PREFIX + ':history',
  fontScale: PREFIX + ':font-scale',
  sort: PREFIX + ':sort',
  tag: PREFIX + ':tag',
  reducedMotion: PREFIX + ':reduced-motion',
} as const

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) as T : fallback
  } catch {
    return fallback
  }
}

function writeJson(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage is optional */ }
}

export function getFavorites(): number[] {
  return readJson<number[]>(keys.favorites, []).filter(Number.isInteger)
}

export function toggleFavorite(id: number): number[] {
  const current = new Set(getFavorites())
  if (current.has(id)) current.delete(id)
  else current.add(id)
  const next = [...current]
  writeJson(keys.favorites, next)
  return next
}

export function getHistory(): number[] {
  return readJson<number[]>(keys.history, []).filter(Number.isInteger)
}

export function pushHistory(id: number): number[] {
  const next = [id, ...getHistory().filter(item => item !== id)].slice(0, 12)
  writeJson(keys.history, next)
  return next
}

export function clearHistory() {
  try { localStorage.removeItem(keys.history) } catch { /* optional */ }
}

export function getStoredFontScale(): FontScale {
  const value = localStorage.getItem(keys.fontScale)
  return value === 'small' || value === 'large' ? value : 'normal'
}

export function setStoredFontScale(value: FontScale) {
  try { localStorage.setItem(keys.fontScale, value) } catch { /* optional */ }
}

export function getStoredSort(): SortMode {
  const value = localStorage.getItem(keys.sort)
  return value === 'oldest' || value === 'title' || value === 'reading' ? value : 'newest'
}

export function setStoredSort(value: SortMode) {
  try { localStorage.setItem(keys.sort, value) } catch { /* optional */ }
}

export function getStoredTag() {
  return localStorage.getItem(keys.tag) ?? 'all'
}

export function setStoredTag(value: string) {
  try { localStorage.setItem(keys.tag, value) } catch { /* optional */ }
}

export function getReducedMotionPreference() {
  return localStorage.getItem(keys.reducedMotion) === 'true'
}

export function setReducedMotionPreference(value: boolean) {
  try { localStorage.setItem(keys.reducedMotion, String(value)) } catch { /* optional */ }
}

export function applyFontScale(value: FontScale) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.fontScale = value
}

export function uniqueTags<T extends { tags: string[] }>(items: T[]) {
  return [...new Set(items.flatMap(item => item.tags))].sort((a, b) => a.localeCompare(b, 'cs'))
}
