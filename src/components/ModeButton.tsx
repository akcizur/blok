import type { LucideIcon } from 'lucide-react'
import type { ViewMode } from '../config/viewModes'

type ModeButtonProps = {
  mode: ViewMode
  icon: LucideIcon
  currentLabel: string
  nextLabel: string
  onClick: () => void
}

export function ModeButton({
  mode,
  icon: Icon,
  currentLabel,
  nextLabel,
  onClick,
}: ModeButtonProps) {
  return (
    <button
      className="nav-button nav-mode-button"
      data-mode={mode}
      onClick={onClick}
      title={currentLabel + ' view · click for ' + nextLabel}
      aria-label={currentLabel + ' view · click to switch to ' + nextLabel}
    >
      <Icon className="ui-icon" size={15} strokeWidth={2} aria-hidden="true" />
      <span className="nav-mode-label">{currentLabel}</span>
    </button>
  )
}
