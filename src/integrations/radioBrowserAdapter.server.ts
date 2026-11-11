import { normalizeRadioBrowserResults, type DirectoryStation, type RadioBrowserRecord } from './radioBrowser'

const discoveryUrl = 'https://all.api.radio-browser.info/json/servers'
const defaultTtlMs = 60_000
const maxResults = 50

type Fetcher = (input: string | URL | Request, init?: RequestInit) => Promise<Response>

export type DirectoryResult = {
  stations: DirectoryStation[]
  mirror: string
  fetchedAt: number
  cached: boolean
}

export type AdapterOptions = {
  userAgent: string
  fetcher?: Fetcher
  now?: () => number
  ttlMs?: number
}

function requireUserAgent(value: string) {
  const userAgent = value.trim()
  if (!userAgent || !userAgent.includes('/')) throw new Error('Use a descriptive application/version User-Agent')
  return userAgent
}

function mirrorOrigin(value: unknown) {
  if (!value || typeof value !== 'object') return null
  const name = (value as { name?: unknown }).name
  if (typeof name !== 'string' || !name.trim()) return null
  try {
    const origin = new URL(`https://${name.trim()}`)
    return origin.protocol === 'https:' && origin.hostname === name.trim() ? origin.origin : null
  } catch {
    return null
  }
}

export function createRadioBrowserAdapter(options: AdapterOptions) {
  const userAgent = requireUserAgent(options.userAgent)
  const fetcher = options.fetcher ?? fetch
  const now = options.now ?? Date.now
  const ttlMs = Math.max(1_000, options.ttlMs ?? defaultTtlMs)
  const cache = new Map<string, DirectoryResult>()

  const requestJson = async (url: string) => {
    const response = await fetcher(url, {
      headers: { Accept: 'application/json', 'User-Agent': userAgent },
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) throw new Error(`Radio Browser returned HTTP ${response.status}`)
    return response.json() as Promise<unknown>
  }

  const discoverMirror = async () => {
    const payload = await requestJson(discoveryUrl)
    if (!Array.isArray(payload)) throw new Error('Radio Browser mirror discovery was malformed')
    const mirror = payload.map(mirrorOrigin).find((origin): origin is string => origin !== null)
    if (!mirror) throw new Error('Radio Browser returned no usable HTTPS mirror')
    return mirror
  }

  const search = async (query: string, requestedLimit = 24): Promise<DirectoryResult> => {
    const normalizedQuery = query.trim().slice(0, 80)
    const limit = Math.min(maxResults, Math.max(1, Math.floor(requestedLimit)))
    const cacheKey = `${normalizedQuery.toLocaleLowerCase()}\n${limit}`
    const existing = cache.get(cacheKey)
    if (existing && now() - existing.fetchedAt < ttlMs) return { ...existing, cached: true }

    const mirror = await discoverMirror()
    const url = new URL('/json/stations/search', mirror)
    if (normalizedQuery) url.searchParams.set('name', normalizedQuery)
    url.searchParams.set('hidebroken', 'true')
    url.searchParams.set('limit', String(limit))
    const payload = await requestJson(url.toString())
    if (!Array.isArray(payload)) throw new Error('Radio Browser station search was malformed')
    const result: DirectoryResult = {
      stations: normalizeRadioBrowserResults(payload as RadioBrowserRecord[], limit),
      mirror,
      fetchedAt: now(),
      cached: false,
    }
    cache.set(cacheKey, result)
    return result
  }

  return { search }
}
