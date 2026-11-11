import { describe, expect, it, vi } from 'vitest'
import { createRadioBrowserAdapter } from './radioBrowserAdapter.server'

describe('Radio Browser server adapter', () => {
  it('discovers an HTTPS mirror, identifies itself and bounds results', async () => {
    const fetcher = vi.fn(async (input: string | URL | Request, _init?: RequestInit) => {
      const url = String(input)
      if (url.includes('/json/servers')) return Response.json([{ name: 'de1.api.radio-browser.info' }])
      return Response.json([
        { stationuuid: 'one', name: 'One', url_resolved: 'https://radio.test/one' },
        { stationuuid: 'two', name: 'Two', url_resolved: 'https://radio.test/two' },
      ])
    })
    const adapter = createRadioBrowserAdapter({ userAgent: 'radio-roam/0.1 contact@example.invalid', fetcher })
    const result = await adapter.search(' jazz ', 1)
    expect(result).toMatchObject({ mirror: 'https://de1.api.radio-browser.info', cached: false })
    expect(result.stations).toHaveLength(1)
    expect(String(fetcher.mock.calls[1][0])).toContain('name=jazz')
    expect(fetcher.mock.calls[0][1]?.headers).toMatchObject({ 'User-Agent': 'radio-roam/0.1 contact@example.invalid' })
  })

  it('reuses a fresh bounded result without another request', async () => {
    let now = 1_000
    const fetcher = vi.fn(async (input: string | URL | Request, _init?: RequestInit) => String(input).includes('/json/servers')
      ? Response.json([{ name: 'de1.api.radio-browser.info' }])
      : Response.json([{ stationuuid: 'one', name: 'One', url_resolved: 'https://radio.test/one' }]))
    const adapter = createRadioBrowserAdapter({ userAgent: 'radio-roam/0.1', fetcher, now: () => now, ttlMs: 5_000 })
    await adapter.search('jazz')
    now += 1_000
    expect(await adapter.search('jazz')).toMatchObject({ cached: true, fetchedAt: 1_000 })
    expect(fetcher).toHaveBeenCalledTimes(2)
  })

  it('rejects anonymous clients and malformed discovery', async () => {
    expect(() => createRadioBrowserAdapter({ userAgent: 'radio-roam' })).toThrow('application/version')
    const adapter = createRadioBrowserAdapter({ userAgent: 'radio-roam/0.1', fetcher: async () => Response.json([]) })
    await expect(adapter.search('')).rejects.toThrow('no usable HTTPS mirror')
  })
})
