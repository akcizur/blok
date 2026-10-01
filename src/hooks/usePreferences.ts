import { useEffect, useState } from 'react'
import { VIEW_MODES, type ViewMode } from '../config/viewModes'

export type Theme = 'light' | 'dark'

export type Preferences = {
  theme: Theme
  viewMode: ViewMode
}

const STORAGE_KEYS = {
  theme: 'dimple-theme',
  viewMode: 'dimple-view',
} as const

function getInitialPreferences(): Preferences {
  if (typeof window === 'undefined') {
    return { theme: 'light', viewMode: 'list' }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.theme)
  const savedViewMode = localStorage.getItem(STORAGE_KEYS.viewMode)

  const theme: Theme =
    savedTheme === 'dark' || savedTheme === 'light'
      ? savedTheme
      : window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

  const viewMode: ViewMode =
    savedViewMode && savedViewMode in VIEW_MODES
      ? savedViewMode as ViewMode
      : 'list'

  return { theme, viewMode }
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<Preferences>(getInitialPreferences)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.theme, preferences.theme)
    localStorage.setItem(STORAGE_KEYS.viewMode, preferences.viewMode)
  }, [preferences])

  function updatePreference<K extends keyof Preferences>(key: K, value: Preferences[K]) {
    setPreferences(current => ({ ...current, [key]: value }))
  }

  return { preferences, updatePreference }
}
