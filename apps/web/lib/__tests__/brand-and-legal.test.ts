import { describe, it, expect, vi, beforeEach } from 'vitest'
import { brand } from '@l.x/config'
import type { BrandConfig } from '@l.x/config'
import { loadBrandConfig } from '@l.x/config/brand'
import {
  LEGAL_UPDATED,
  LEGAL_URLS,
  FOOTER_DISCLAIMER,
  REGULATORY_NOTICE,
  COOKIE_NOTICE,
  NON_CUSTODIAL_NOTICE,
  getLegalUrls,
} from '@l.x/config/legal'

// ---------------------------------------------------------------------------
// 1. BrandConfig interface completeness
// ---------------------------------------------------------------------------
describe('BrandConfig interface completeness', () => {
  const requiredFields: (keyof BrandConfig)[] = [
    'name',
    'title',
    'description',
    'legalEntity',
    'appDomain',
    'docsDomain',
    'infoDomain',
    'gatewayDomain',
    'wsDomain',
    'helpUrl',
    'termsUrl',
    'privacyUrl',
    'downloadUrl',
    'complianceEmail',
    'supportEmail',
    'twitter',
    'github',
    'discord',
    'logoUrl',
    'faviconUrl',
    'primaryColor',
    'defaultChainId',
    'supportedChainIds',
    'walletConnectProjectId',
    'insightsHost',
    'insightsApiKey',
  ]

  it.each(requiredFields)('brand object has field "%s"', (field) => {
    expect(brand).toHaveProperty(field)
  })

  it('has exactly the expected number of fields', () => {
    expect(Object.keys(brand).length).toBe(requiredFields.length)
  })
})

// ---------------------------------------------------------------------------
// 2. Default brand values are defined (not undefined)
// ---------------------------------------------------------------------------
describe('default brand values are defined', () => {
  it('faviconUrl defaults to /favicon.ico', () => {
    expect(brand.faviconUrl).toBe('/favicon.ico')
  })

  it('primaryColor defaults to #FC72FF', () => {
    expect(brand.primaryColor).toBe('#FC72FF')
  })

  it('defaultChainId defaults to 1', () => {
    expect(brand.defaultChainId).toBe(1)
  })

  it('supportedChainIds is an array', () => {
    expect(Array.isArray(brand.supportedChainIds)).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// 3. legalEntity field exists
// ---------------------------------------------------------------------------
describe('legalEntity field', () => {
  it('exists on the brand object', () => {
    expect(brand).toHaveProperty('legalEntity')
  })

  it('is a string', () => {
    expect(typeof brand.legalEntity).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// 4. LEGAL_UPDATED is valid ISO date (YYYY-MM-DD)
// ---------------------------------------------------------------------------
describe('LEGAL_UPDATED', () => {
  it('matches YYYY-MM-DD format', () => {
    expect(LEGAL_UPDATED).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('parses to a valid date', () => {
    const date = new Date(LEGAL_UPDATED)
    expect(date.toString()).not.toBe('Invalid Date')
  })

  it('is not in the future beyond a reasonable window', () => {
    const date = new Date(LEGAL_UPDATED)
    const oneYearFromNow = new Date()
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
    expect(date.getTime()).toBeLessThanOrEqual(oneYearFromNow.getTime())
  })
})

// ---------------------------------------------------------------------------
// 5. LEGAL_URLS paths are relative or absolute
// ---------------------------------------------------------------------------
describe('LEGAL_URLS', () => {
  it('terms path starts with /', () => {
    expect(LEGAL_URLS.terms).toMatch(/^\//)
  })

  it('privacy path starts with /', () => {
    expect(LEGAL_URLS.privacy).toMatch(/^\//)
  })

  it('regulatory is a full URL', () => {
    expect(LEGAL_URLS.regulatory).toMatch(/^https?:\/\//)
  })

  it('email links use mailto:', () => {
    expect(LEGAL_URLS.compliance).toMatch(/^mailto:/)
    expect(LEGAL_URLS.legal).toMatch(/^mailto:/)
    expect(LEGAL_URLS.privacyEmail).toMatch(/^mailto:/)
    expect(LEGAL_URLS.security).toMatch(/^mailto:/)
  })

  it('LP document links are full URLs', () => {
    expect(LEGAL_URLS.lp3103).toMatch(/^https?:\/\//)
    expect(LEGAL_URLS.lp3104).toMatch(/^https?:\/\//)
  })
})

// ---------------------------------------------------------------------------
// 6. FOOTER_DISCLAIMER contains key phrases
// ---------------------------------------------------------------------------
describe('FOOTER_DISCLAIMER', () => {
  it('mentions "experimental"', () => {
    expect(FOOTER_DISCLAIMER.toLowerCase()).toContain('experimental')
  })

  it('mentions "not legal"', () => {
    expect(FOOTER_DISCLAIMER.toLowerCase()).toContain('not legal')
  })

  it('mentions "non-custodial"', () => {
    expect(FOOTER_DISCLAIMER.toLowerCase()).toContain('non-custodial')
  })

  it('mentions "at your own risk"', () => {
    expect(FOOTER_DISCLAIMER.toLowerCase()).toContain('at your own risk')
  })
})

// ---------------------------------------------------------------------------
// 7. NON_CUSTODIAL_NOTICE contains key phrases
// ---------------------------------------------------------------------------
describe('NON_CUSTODIAL_NOTICE', () => {
  it('mentions "never have access"', () => {
    expect(NON_CUSTODIAL_NOTICE.toLowerCase()).toContain('never have access')
  })

  it('mentions "private keys"', () => {
    expect(NON_CUSTODIAL_NOTICE.toLowerCase()).toContain('private keys')
  })

  it('mentions "irreversible"', () => {
    expect(NON_CUSTODIAL_NOTICE.toLowerCase()).toContain('irreversible')
  })
})

// ---------------------------------------------------------------------------
// 8. REGULATORY_NOTICE does NOT contain hardcoded brand name "Lux"
// ---------------------------------------------------------------------------
describe('REGULATORY_NOTICE', () => {
  it('does not contain the hardcoded brand name "Lux"', () => {
    expect(REGULATORY_NOTICE).not.toMatch(/\bLux\b/)
  })

  it('is brand-agnostic (no proper brand nouns)', () => {
    expect(REGULATORY_NOTICE).not.toMatch(/\bZoo\b/)
    expect(REGULATORY_NOTICE).not.toMatch(/\bPars\b/)
    expect(REGULATORY_NOTICE).not.toMatch(/\bHanzo\b/)
  })
})

// ---------------------------------------------------------------------------
// 9. COOKIE_NOTICE mentions no tracking
// ---------------------------------------------------------------------------
describe('COOKIE_NOTICE', () => {
  it('mentions "no tracking cookies"', () => {
    expect(COOKIE_NOTICE.toLowerCase()).toContain('no tracking cookies')
  })

  it('mentions "no behavioral profiling"', () => {
    expect(COOKIE_NOTICE.toLowerCase()).toContain('no behavioral profiling')
  })
})

// ---------------------------------------------------------------------------
// 10. getLegalUrls() generates correct URLs
// ---------------------------------------------------------------------------
describe('getLegalUrls()', () => {
  it('returns terms URL with the given domain', () => {
    const urls = getLegalUrls('lux.exchange')
    expect(urls.terms).toBe('https://lux.exchange/terms')
  })

  it('returns privacy URL with the given domain', () => {
    const urls = getLegalUrls('lux.exchange')
    expect(urls.privacy).toBe('https://lux.exchange/privacy')
  })

  it('returns regulatory URL from LEGAL_URLS constant', () => {
    const urls = getLegalUrls('lux.exchange')
    expect(urls.regulatory).toBe(LEGAL_URLS.regulatory)
  })

  it('works with arbitrary domains', () => {
    const urls = getLegalUrls('zoo.exchange')
    expect(urls.terms).toBe('https://zoo.exchange/terms')
    expect(urls.privacy).toBe('https://zoo.exchange/privacy')
  })

  it('handles subdomain domains', () => {
    const urls = getLegalUrls('app.pars.market')
    expect(urls.terms).toBe('https://app.pars.market/terms')
    expect(urls.privacy).toBe('https://app.pars.market/privacy')
  })
})

// ---------------------------------------------------------------------------
// 11. loadBrandConfig() handles missing config gracefully
// ---------------------------------------------------------------------------
describe('loadBrandConfig()', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns fallback config when fetch fails (network error)', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')))

    const config = await loadBrandConfig()

    expect(config).toBeDefined()
    expect(config.brand).toEqual({})
    expect(config.chains).toBeDefined()
    expect(config.rpc).toEqual({})
    expect(config.api).toBeDefined()
    expect(config.walletConnect).toBeDefined()
  })

  it('returns fallback config when fetch returns non-ok status', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    )

    const config = await loadBrandConfig()

    expect(config).toBeDefined()
    expect(config.brand).toEqual({})
    expect(config.rpc).toEqual({})
  })

  it('applies brand overrides from config.json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          brand: { name: 'Zoo Exchange', legalEntity: 'Zoo Labs Foundation' },
          chains: { defaultChainId: 200200, supported: [200200] },
          rpc: { '200200': 'https://api.zoo.network/rpc' },
          api: { graphql: '', gateway: '', insights: '' },
          walletConnect: { projectId: 'test-id' },
        }),
      }),
    )

    const config = await loadBrandConfig()

    expect(config.brand?.name).toBe('Zoo Exchange')
    expect(config.brand?.legalEntity).toBe('Zoo Labs Foundation')
    expect(brand.name).toBe('Zoo Exchange')
    expect(brand.legalEntity).toBe('Zoo Labs Foundation')
    expect(brand.defaultChainId).toBe(200200)
    expect(brand.walletConnectProjectId).toBe('test-id')
  })

  it('preserves default values for fields not in config.json', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          brand: { name: 'Partial Brand' },
          chains: { defaultChainId: 1, supported: [] },
          rpc: {},
          api: { graphql: '', gateway: '', insights: '' },
          walletConnect: { projectId: '' },
        }),
      }),
    )

    await loadBrandConfig()

    expect(brand.name).toBe('Partial Brand')
    expect(brand.faviconUrl).toBe('/favicon.ico')
    expect(brand.primaryColor).toBe('#FC72FF')
  })
})
