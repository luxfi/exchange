import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { _resetRuntimeConfigForTests, getRuntimeConfig, loadRuntimeConfig } from './runtime'

const originalFetch = globalThis.fetch

function mockFetchJson(body: unknown, ok = true, status = 200): void {
  globalThis.fetch = vi.fn(async () => ({
    ok,
    status,
    json: async () => body,
  })) as unknown as typeof fetch
}

function mockFetchReject(): void {
  globalThis.fetch = vi.fn(async () => {
    throw new Error('network down')
  }) as unknown as typeof fetch
}

describe('runtime config', () => {
  beforeEach(() => {
    _resetRuntimeConfigForTests()
  })

  afterEach(() => {
    globalThis.fetch = originalFetch
  })

  it('returns empty object when /config.json is absent', async () => {
    mockFetchJson({}, false, 404)
    const cfg = await loadRuntimeConfig()
    expect(cfg).toEqual({})
  })

  it('returns empty object when /config.json fetch throws', async () => {
    mockFetchReject()
    const cfg = await loadRuntimeConfig()
    expect(cfg).toEqual({})
  })

  it('picks up idHost and strips trailing slashes', async () => {
    mockFetchJson({ idHost: 'https://id.dev.example.com/' })
    const cfg = await loadRuntimeConfig()
    expect(cfg.idHost).toBe('https://id.dev.example.com')
    expect(cfg.onboardingUrl).toBeUndefined()
  })

  it('picks up onboardingUrl verbatim', async () => {
    mockFetchJson({ onboardingUrl: 'https://foo.example/start?x=1' })
    const cfg = await loadRuntimeConfig()
    expect(cfg.onboardingUrl).toBe('https://foo.example/start?x=1')
    expect(cfg.idHost).toBeUndefined()
  })

  it('ignores non-string idHost / onboardingUrl', async () => {
    mockFetchJson({ idHost: 123, onboardingUrl: null })
    const cfg = await loadRuntimeConfig()
    expect(cfg).toEqual({})
  })

  it('caches after first load', async () => {
    mockFetchJson({ idHost: 'https://id.test' })
    await loadRuntimeConfig()
    // Second call: swap fetch; cache should short-circuit it.
    globalThis.fetch = vi.fn(async () => {
      throw new Error('should not be called')
    }) as unknown as typeof fetch
    const cfg = await loadRuntimeConfig()
    expect(cfg.idHost).toBe('https://id.test')
  })

  it('getRuntimeConfig returns {} before loadRuntimeConfig resolves', () => {
    expect(getRuntimeConfig()).toEqual({})
  })

  it('getRuntimeConfig returns cached value after load', async () => {
    mockFetchJson({ idHost: 'https://id.example' })
    await loadRuntimeConfig()
    expect(getRuntimeConfig()).toEqual({ idHost: 'https://id.example' })
  })
})
