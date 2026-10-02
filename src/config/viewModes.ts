import {
  BookOpenText,
  Columns3,
  Grid2X2,
  List,
  ListOrdered,
  ListTree,
  type LucideIcon,
  Newspaper,
  Rows3,
} from 'lucide-react'

export type ViewMode =
  | 'list'
  | 'grid'
  | 'magazine'
  | 'compact'
  | 'timeline'
  | 'editorial'
  | 'index'
  | 'columns'

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
  'timeline',
  'editorial',
  'index',
  'columns',
]

export const VIEW_MODES: Record<ViewMode, ViewModeConfig> = {
  list: {
    icon: List,
    label: 'Seznam',
    containerClass: 'posts-list',
    articleClassName: 'post post-list',
  },
  grid: {
    icon: Grid2X2,
    label: 'Mřížka',
    containerClass: 'posts-grid',
    articleClassName: 'post post-grid',
  },
  magazine: {
    icon: Newspaper,
    label: 'Magazín',
    containerClass: 'posts-magazine',
    articleClassName: 'post post-magazine',
  },
  compact: {
    icon: Rows3,
    label: 'Kompaktní',
    containerClass: 'posts-compact',
    articleClassName: 'post post-compact',
  },
  timeline: {
    icon: ListTree,
    label: 'Timeline',
    containerClass: 'posts-timeline',
    articleClassName: 'post post-timeline',
  },
  editorial: {
    icon: Columns3,
    label: 'Editorial',
    containerClass: 'posts-editorial',
    articleClassName: 'post post-editorial',
  },
  index: {
    icon: ListOrdered,
    label: 'Index',
    containerClass: 'posts-index',
    articleClassName: 'post post-index',
  },
  columns: {
    icon: BookOpenText,
    label: 'Dvě kolony',
    containerClass: 'posts-columns',
    articleClassName: 'post post-columns',
  },
}
