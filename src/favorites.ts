export const favoritesKey = 'radio-roam:favorites'

export function parseFavorites(raw: string | null, validIds: readonly string[]) {
  if (!raw) return new Set<string>()
  try {
    const value: unknown = JSON.parse(raw)
    if (!Array.isArray(value)) return new Set<string>()
    const allowed = new Set(validIds)
    return new Set(value.filter((id): id is string => typeof id === 'string' && allowed.has(id)))
  } catch { return new Set<string>() }
}

export const serializeFavorites = (favorites: ReadonlySet<string>) => JSON.stringify([...favorites].sort())
