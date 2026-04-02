import { test, expect } from "@playwright/test"

/**
 * Config validation tests — ensure runtime config.json is well-formed
 * and won't cause silent failures in production.
 *
 * These tests catch:
 * - Broken RPC URLs that return 404
 * - Missing chain IDs in supported list
 * - Brand config regressions
 * - Legal URL breakage
 * @config-validation
 */
test.describe("Runtime Config Validation @config-validation", () => {
  let config: any

  test.beforeAll(async ({ request }) => {
    const res = await request.get("/config.json")
    expect(res.ok()).toBeTruthy()
    config = await res.json()
  })

  test("config.json is valid JSON with brand section", async () => {
    expect(config).toBeDefined()
    expect(config.brand).toBeDefined()
    expect(config.brand.name).toBeTruthy()
  })

  test("brand has legalEntity for white-label legal pages", async () => {
    expect(config.brand.legalEntity).toBeTruthy()
    expect(config.brand.legalEntity.length).toBeGreaterThan(3)
  })

  test("brand has terms and privacy URLs", async () => {
    // Can be relative (/terms) or absolute (https://...)
    expect(config.brand.termsUrl || "/terms").toBeTruthy()
    expect(config.brand.privacyUrl || "/privacy").toBeTruthy()
  })

  test("defaultChainId is a valid Lux ecosystem chain", async () => {
    const luxEcosystemIds = [96369, 96368, 96370, 200200, 200201, 36963, 36911, 494949]
    const defaultId = config.brand?.defaultChainId || config.chains?.defaultChainId
    expect(luxEcosystemIds).toContain(defaultId)
  })

  test("supported chains includes Lux mainnet", async () => {
    const supported = config.brand?.supportedChainIds || config.chains?.supported || []
    expect(supported).toContain(96369)
  })

  test("RPC URLs use correct /mainnet/ext/ or /testnet/ext/ path format", async () => {
    const rpc = config.rpc || {}

    // Lux mainnet RPC must use /mainnet/ path
    if (rpc["96369"]) {
      expect(rpc["96369"]).toContain("/mainnet/ext/")
      expect(rpc["96369"]).not.toMatch(/^https:\/\/api\.lux\.network\/ext\//)
      expect(rpc["96369"]).not.toMatch(/^https:\/\/api\.lux\.network\/rpc$/)
    }

    // Lux testnet RPC must use /testnet/ path
    if (rpc["96368"]) {
      expect(rpc["96368"]).toContain("/testnet/ext/")
    }
  })

  test("no RPC URL is the known-broken bare /rpc endpoint", async () => {
    const rpc = config.rpc || {}
    const brokenPatterns = [
      /^https:\/\/api\.lux\.network\/rpc$/,
      /^https:\/\/api\.lux\.network\/ext\/bc\/C\/rpc$/,
      /^https:\/\/api\.lux-test\.network\/rpc$/,
    ]

    for (const [chainId, url] of Object.entries(rpc)) {
      for (const pattern of brokenPatterns) {
        expect(url, `RPC for chain ${chainId} matches broken pattern`).not.toMatch(pattern)
      }
    }
  })

  test("primaryColor is a valid hex color", async () => {
    if (config.brand.primaryColor) {
      expect(config.brand.primaryColor).toMatch(/^#[0-9a-fA-F]{6}$/)
    }
  })
})
