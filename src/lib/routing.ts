export type AppRoute =
  | { kind: 'home' }
  | { kind: 'post'; slug: string }

function basePath() {
  return import.meta.env.BASE_URL.replace(/\/$/, '')
}

export function readRoute(): AppRoute {
  const pathname = window.location.pathname
  const base = basePath()
  const isInsideBase = !base || pathname === base || pathname.startsWith(base + '/')
  const relative = isInsideBase && base
    ? pathname.slice(base.length)
    : pathname.replace(/^\/+/, '')
  const clean = relative.replace(/^\/+|\/+$/g, '')
  const match = clean.match(/^post\/([^/]+)$/)

  if (match?.[1]) {
    try {
      return { kind: 'post', slug: decodeURIComponent(match[1]) }
    } catch {
      return { kind: 'home' }
    }
  }

  const legacyId = new URLSearchParams(window.location.search).get('post')
  if (legacyId) {
    return { kind: 'post', slug: '__legacy_id__' + legacyId }
  }

  return { kind: 'home' }
}

export function hrefForRoute(route: AppRoute) {
  const base = import.meta.env.BASE_URL
  if (route.kind === 'home') return base
  return `${base}post/${encodeURIComponent(route.slug)}`
}

export function navigateRoute(route: AppRoute, replace = false) {
  const href = hrefForRoute(route)
  window.history[replace ? 'replaceState' : 'pushState']({}, '', href)
}

export function routeKey(route: AppRoute) {
  return route.kind === 'home' ? 'home' : `post:${route.slug}`
}
