import { TradingApi } from '@universe/api'
import { FeatureFlags, getFeatureFlag } from '@universe/gating'
import { createGetSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { createGetV4SwapEnabled } from 'lx/src/features/transactions/swap/hooks/useV4SwapEnabled'
import {
  createGetProtocolsForChain,
  createGetDEXPriorityOrderFlag,
  createProtocolFilter,
  FrontendSupportedProtocol,
} from 'lx/src/features/transactions/swap/utils/protocols'
import type { Mock } from 'vitest'

vi.mock('@universe/gating', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@universe/gating')>()
  return {
    ...actual,
    useFeatureFlag: vi.fn(),
    getFeatureFlag: vi.fn(),
  }
})

vi.mock('lx/src/features/transactions/swap/hooks/useV4SwapEnabled', () => ({
  useV4SwapEnabled: vi.fn(),
  createGetV4SwapEnabled: vi.fn(),
}))

vi.mock('lx/src/contexts/LuxContext', () => ({
  useLuxContextSelector: vi.fn(),
}))

vi.mock('lx/src/features/chains/hooks/useSupportedChainId', () => ({
  createGetSupportedChainId: vi.fn(),
}))

vi.mock('lx/src/features/chains/hooks/useEnabledChains', () => ({
  useEnabledChains: vi.fn(),
}))

const mockGetFeatureFlag = getFeatureFlag as Mock
const mockCreateGetV4SwapEnabled = createGetV4SwapEnabled as Mock
const mockCreateGetSupportedChainId = createGetSupportedChainId as Mock

describe('protocols', () => {
  const allProtocols: FrontendSupportedProtocol[] = [
    TradingApi.ProtocolItems.LUXX_V2,
    TradingApi.ProtocolItems.V4,
    TradingApi.ProtocolItems.V3,
    TradingApi.ProtocolItems.V2,
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createProtocolFilter', () => {
    it('returns all protocols when everything is enabled', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      const result = protocolFilter(allProtocols, UniverseChainId.Mainnet)
      expect(result).toEqual(allProtocols)
    })

    it('filters out DEX when dexEnabled is false', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => false,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      const result = protocolFilter(allProtocols, UniverseChainId.Mainnet)
      expect(result).toEqual([TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3, TradingApi.ProtocolItems.V2])
    })

    it('filters out DEX when chain is not in LAUNCHED_LUXX_CHAINS and no special conditions', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      // Polygon is not in LAUNCHED_LUXX_CHAINS
      const result = protocolFilter(allProtocols, UniverseChainId.Polygon)
      expect(result).toEqual([TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3, TradingApi.ProtocolItems.V2])
    })

    it('keeps DEX when priority orders are allowed', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => true,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      // Even though Base is not in LAUNCHED_LUXX_CHAINS, priority orders allow it
      const result = protocolFilter(allProtocols, UniverseChainId.Base)
      expect(result).toEqual(allProtocols)
    })

    it('keeps DEX and replaces V2 with V3 on Arbitrum when Dutch V3 is enabled', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => true,
      })

      const result = protocolFilter(allProtocols, UniverseChainId.ArbitrumOne)
      expect(result).toEqual([
        TradingApi.ProtocolItems.LUXX_V3, // V2 replaced with V3
        TradingApi.ProtocolItems.V4,
        TradingApi.ProtocolItems.V3,
        TradingApi.ProtocolItems.V2,
      ])
    })

    it('filters out V4 when not supported', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => false,
        getArbitrumDutchV3Enabled: () => false,
      })

      const result = protocolFilter(allProtocols, UniverseChainId.Mainnet)
      expect(result).toEqual([
        TradingApi.ProtocolItems.LUXX_V2,
        TradingApi.ProtocolItems.V3,
        TradingApi.ProtocolItems.V2,
      ])
    })

    it('handles empty protocol list', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      const result = protocolFilter([], UniverseChainId.Mainnet)
      expect(result).toEqual([])
    })

    it('handles undefined chainId', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => true,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      const result = protocolFilter(allProtocols, undefined)
      // When chainId is undefined, dexAllowedForChain is false
      expect(result).toEqual([TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3, TradingApi.ProtocolItems.V2])
    })

    it('verifies duplicate filtering logic does not cause issues', () => {
      const protocolFilter = createProtocolFilter({
        getDEXEnabled: () => false,
        getPriorityOrderFlag: () => false,
        getV4Enabled: () => true,
        getArbitrumDutchV3Enabled: () => false,
      })

      // Start with duplicate LUXX_V2 entries
      const protocolsWithDuplicates: FrontendSupportedProtocol[] = [
        TradingApi.ProtocolItems.LUXX_V2,
        TradingApi.ProtocolItems.LUXX_V2,
        TradingApi.ProtocolItems.V4,
        TradingApi.ProtocolItems.V3,
      ]

      const result = protocolFilter(protocolsWithDuplicates, UniverseChainId.Mainnet)
      // Both duplicates should be filtered out
      expect(result).toEqual([TradingApi.ProtocolItems.V4, TradingApi.ProtocolItems.V3])
    })
  })

  describe('createGetDEXPriorityOrderFlag', () => {
    it('returns true for Base with DEXPriorityOrdersBase flag enabled', () => {
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: (flag) => flag === FeatureFlags.DEXPriorityOrdersBase,
      })

      expect(getDEXPriorityOrderFlag(UniverseChainId.Base)).toBe(true)
    })

    it('returns true for Optimism with DEXPriorityOrdersOptimism flag enabled', () => {
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: (flag) => flag === FeatureFlags.DEXPriorityOrdersOptimism,
      })

      expect(getDEXPriorityOrderFlag(UniverseChainId.Optimism)).toBe(true)
    })

    it('returns true for Unichain with DEXPriorityOrdersUnichain flag enabled', () => {
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: (flag) => flag === FeatureFlags.DEXPriorityOrdersUnichain,
      })

      expect(getDEXPriorityOrderFlag(UniverseChainId.Unichain)).toBe(true)
    })

    it('returns false when chainId is undefined', () => {
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: () => true,
      })

      expect(getDEXPriorityOrderFlag(undefined)).toBe(false)
    })

    it('returns false for chains not in the priority orders map', () => {
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: () => true,
      })

      expect(getDEXPriorityOrderFlag(UniverseChainId.Mainnet)).toBe(false)
      expect(getDEXPriorityOrderFlag(UniverseChainId.Polygon)).toBe(false)
    })

    it('returns false when chainId is undefined without checking flags', () => {
      const mGetFeatureFlag = vi.fn(() => true)
      const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
        getFeatureFlag: mGetFeatureFlag,
      })

      expect(getDEXPriorityOrderFlag(undefined)).toBe(false)
      // Should not check any flags when chainId is undefined
      expect(mGetFeatureFlag).not.toHaveBeenCalled()
    })
  })

  describe('createGetProtocolsForChain', () => {
    beforeEach(() => {
      // Default mock implementations
      mockGetFeatureFlag.mockReturnValue(false)
      mockCreateGetV4SwapEnabled.mockReturnValue(() => true)
      mockCreateGetSupportedChainId.mockReturnValue({
        getSupportedChainId: (chainId?: number) => chainId as UniverseChainId | undefined,
      })
    })

    it('creates a working filter function', () => {
      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.Mainnet, UniverseChainId.Polygon],
      })

      expect(typeof getProtocolsFilter).toBe('function')

      const result = getProtocolsFilter(allProtocols, UniverseChainId.Mainnet)
      expect(Array.isArray(result)).toBe(true)
    })

    it('correctly combines feature flags', () => {
      mockGetFeatureFlag.mockImplementation((flag: FeatureFlags) => {
        if (flag === FeatureFlags.DEX) {
          return true
        }
        if (flag === FeatureFlags.ArbitrumDutchV3) {
          return true
        }
        return false
      })

      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.ArbitrumOne],
      })

      const result = getProtocolsFilter(allProtocols, UniverseChainId.ArbitrumOne)
      // Should have LUXX_V3 instead of V2 due to ArbitrumDutchV3 flag
      expect(result).toContain(TradingApi.ProtocolItems.LUXX_V3)
      expect(result).not.toContain(TradingApi.ProtocolItems.LUXX_V2)
    })

    it('handles missing getIsDEXSupported (uses feature flag only)', () => {
      mockGetFeatureFlag.mockImplementation((flag: FeatureFlags) => {
        return flag === FeatureFlags.DEX
      })

      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.Mainnet],
        // No getIsDEXSupported provided
      })

      const result = getProtocolsFilter(allProtocols, UniverseChainId.Mainnet)
      expect(result).toContain(TradingApi.ProtocolItems.LUXX_V2)
    })

    it('handles present getIsDEXSupported (combines with feature flag)', () => {
      mockGetFeatureFlag.mockImplementation((flag: FeatureFlags) => {
        return flag === FeatureFlags.DEX // Feature flag is enabled
      })

      const getIsDEXSupported = vi.fn(() => false) // But chain support says no

      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.Mainnet],
        getIsDEXSupported,
      })

      const result = getProtocolsFilter(allProtocols, UniverseChainId.Mainnet)
      // Should not contain DEX because chain support returned false
      expect(result).not.toContain(TradingApi.ProtocolItems.LUXX_V2)
      expect(getIsDEXSupported).toHaveBeenCalledWith(UniverseChainId.Mainnet)
    })

    it('correctly creates V4 swap enabled checker', () => {
      const mockGetV4SwapAllowed = vi.fn((chainId?: number) => chainId === UniverseChainId.Mainnet)
      mockCreateGetV4SwapEnabled.mockReturnValue(mockGetV4SwapAllowed)

      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.Mainnet, UniverseChainId.Polygon],
      })

      // Test Mainnet (V4 allowed)
      const mainnetResult = getProtocolsFilter(allProtocols, UniverseChainId.Mainnet)
      expect(mainnetResult).toContain(TradingApi.ProtocolItems.V4)

      // Test Polygon (V4 not allowed)
      const polygonResult = getProtocolsFilter(allProtocols, UniverseChainId.Polygon)
      expect(polygonResult).not.toContain(TradingApi.ProtocolItems.V4)
    })

    it('returns expected protocols for various chain/flag combinations', () => {
      // Setup: DEX enabled, no special flags
      mockGetFeatureFlag.mockImplementation((flag: FeatureFlags) => {
        return flag === FeatureFlags.DEX
      })
      mockCreateGetV4SwapEnabled.mockReturnValue(() => true)

      const getProtocolsFilter = createGetProtocolsForChain({
        getEnabledChains: () => [UniverseChainId.Mainnet, UniverseChainId.Base],
        getIsDEXSupported: () => true,
      })

      // Mainnet should have all protocols (it's in LAUNCHED_LUXX_CHAINS)
      const mainnetResult = getProtocolsFilter(allProtocols, UniverseChainId.Mainnet)
      expect(mainnetResult).toEqual(allProtocols)

      // Base should not have DEX (not in LAUNCHED_LUXX_CHAINS and no priority flag)
      mockGetFeatureFlag.mockImplementation((flag: FeatureFlags) => {
        if (flag === FeatureFlags.DEX) {
          return true
        }
        if (flag === FeatureFlags.DEXPriorityOrdersBase) {
          return false
        }
        return false
      })

      const baseResult = getProtocolsFilter(allProtocols, UniverseChainId.Base)
      expect(baseResult).toEqual([
        TradingApi.ProtocolItems.V4,
        TradingApi.ProtocolItems.V3,
        TradingApi.ProtocolItems.V2,
      ])
    })
  })
})
