import {
  Grid2X2,
  List,
  type LucideIcon,
  Newspaper,
  Rows3,
} from 'lucide-react'

export type ViewMode = 'list' | 'grid' | 'magazine' | 'compact'

type ViewModeConfig = {
  icon: LucideIcon
  label: string
  containerClass: string
  articleClassName: string
}

export const VIEW_MODE_ORDER: ViewMode[] = [
  'list',
  'grid',
  'magazine',
  'compact',
]

export const VIEW_MODES: Record<ViewMode, ViewModeConfig> = {
  list: {
    icon: List,
    label: 'Seznam',
    containerClass: 'posts posts-list',
    articleClassName: 'post post-list',
  },
  grid: {
    icon: Grid2X2,
    label: 'Mřížka',
    containerClass: 'posts posts-grid',
    articleClassName: 'post post-grid',
  },
  magazine: {
    icon: Newspaper,
    label: 'Magazín',
    containerClass: 'posts posts-magazine',
    articleClassName: 'post post-magazine',
  },
  compact: {
    icon: Rows3,
    label: 'Kompaktní',
    containerClass: 'posts posts-compact',
    articleClassName: 'post post-compact',
  },
}
