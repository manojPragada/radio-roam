import { describe, expect, it } from 'vitest'
import { parseFavorites, serializeFavorites } from './favorites'

describe('synthetic station favorites', () => {
  const ids = ['demo-a', 'demo-b']
  it('restores only current synthetic IDs', () => {
    expect([...parseFavorites('["demo-a","live-id",3]', ids)]).toEqual(['demo-a'])
    expect([...parseFavorites('{broken', ids)]).toEqual([])
  })
  it('serializes deterministically', () => {
    expect(serializeFavorites(new Set(['demo-b', 'demo-a']))).toBe('["demo-a","demo-b"]')
  })
})
