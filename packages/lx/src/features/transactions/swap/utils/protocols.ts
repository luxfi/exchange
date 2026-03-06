import { TradingApi } from '@luxfi/api'
import { FeatureFlags, getFeatureFlag, useFeatureFlag } from '@luxfi/gating'
import { useMemo } from 'react'
import { useLuxContextSelector } from 'lx/src/contexts/LuxContext'
import { createGetSupportedChainId } from 'lx/src/features/chains/hooks/useSupportedChainId'
import { UniverseChainId } from 'lx/src/features/chains/types'
import { createGetV4SwapEnabled, useV4SwapEnabled } from 'lx/src/features/transactions/swap/hooks/useV4SwapEnabled'

export const DEFAULT_PROTOCOL_OPTIONS = [
  // `as const` allows us to derive a type narrower than ProtocolItems, and the `...` spread removes readonly, allowing DEFAULT_PROTOCOL_OPTIONS to be passed around as an argument without `readonly`
  ...([
    TradingApi.ProtocolItems.LUXX_V2,
    TradingApi.ProtocolItems.V4,
    TradingApi.ProtocolItems.V3,
    TradingApi.ProtocolItems.V2,
  ] as const),
]
export type FrontendSupportedProtocol = (typeof DEFAULT_PROTOCOL_OPTIONS)[number]

const LAUNCHED_LUXX_CHAINS = [UniverseChainId.Mainnet]

/** Given a list of `userSelectedProtocols`, returns protocol items that are allowed for the given chain. */
export function useProtocolsForChain(
  userSelectedProtocols: FrontendSupportedProtocol[],
  chainId?: UniverseChainId,
): TradingApi.ProtocolItems[] {
  const getIsDEXSupported = useLuxContextSelector((state) => state.getIsDEXSupported)
  const dexEnabled = useFeatureFlag(FeatureFlags.DEX)
  const priorityOrdersAllowed = useDEXPriorityOrderFlag(chainId)
  const isDutchV3Enabled = useFeatureFlag(FeatureFlags.ArbitrumDutchV3)
  const v4SwapAllowed = useV4SwapEnabled(chainId)

  const protocolFilter = useMemo(
    () =>
      createProtocolFilter({
        getDEXEnabled: () => dexEnabled,
        getIsDEXSupported,
        getPriorityOrderFlag: () => priorityOrdersAllowed,
        getV4Enabled: () => v4SwapAllowed,
        getArbitrumDutchV3Enabled: () => isDutchV3Enabled,
      }),
    [dexEnabled, priorityOrdersAllowed, isDutchV3Enabled, v4SwapAllowed, getIsDEXSupported],
  )

  return useMemo(() => {
    return protocolFilter(userSelectedProtocols, chainId)
  }, [protocolFilter, userSelectedProtocols, chainId])
}

export function createProtocolFilter(ctx: {
  getDEXEnabled: () => boolean
  getIsDEXSupported?: (chainId?: UniverseChainId) => boolean
  getPriorityOrderFlag: (chainId?: UniverseChainId) => boolean
  getV4Enabled: (chainId?: UniverseChainId) => boolean
  getArbitrumDutchV3Enabled: () => boolean
}) {
  return function filterProtocols(
    protocols: FrontendSupportedProtocol[],
    chainId?: UniverseChainId,
  ): TradingApi.ProtocolItems[] {
    const dexEnabled = ctx.getDEXEnabled()
    const dexSupportedForChain = ctx.getIsDEXSupported ? ctx.getIsDEXSupported(chainId) : true
    const combinedDEXEnabled = dexEnabled && dexSupportedForChain

    const priorityOrdersAllowed = ctx.getPriorityOrderFlag(chainId)
    const arbDutchV3Enabled = chainId === UniverseChainId.ArbitrumOne && ctx.getArbitrumDutchV3Enabled()
    const v4Enabled = ctx.getV4Enabled(chainId)

    const dexAllowedForChain =
      (chainId && LAUNCHED_LUXX_CHAINS.includes(chainId)) || priorityOrdersAllowed || arbDutchV3Enabled

    let filteredProtocols: TradingApi.ProtocolItems[] = [...protocols]

    // Remove DEX from the options we send to TradingAPI if DEX hasn't been launched or isn't in experiment on that chain
    if (!dexAllowedForChain || !combinedDEXEnabled) {
      filteredProtocols = filteredProtocols.filter((protocol) => protocol !== TradingApi.ProtocolItems.LUXX_V2)
    }

    // Replace DEXV2 with V3 if V3 experiment is enabled on arbitrum
    if (arbDutchV3Enabled) {
      filteredProtocols = filteredProtocols.map((protocol) =>
        protocol === TradingApi.ProtocolItems.LUXX_V2 ? TradingApi.ProtocolItems.LUXX_V3 : protocol,
      )
    }

    if (!v4Enabled) {
      filteredProtocols = filteredProtocols.filter((protocol) => protocol !== TradingApi.ProtocolItems.V4)
    }

    return filteredProtocols
  }
}

export function useDEXPriorityOrderFlag(chainId?: UniverseChainId): boolean {
  if (!chainId) {
    return false
  }

  return getDEXPriorityOrderFlag(chainId)
}

export function createGetProtocolsForChain(ctx: {
  // these need to come from react unfortunately
  getIsDEXSupported?: (chainId?: UniverseChainId) => boolean
  getEnabledChains: () => UniverseChainId[]
}): (userSelectedProtocols: FrontendSupportedProtocol[], chainId?: UniverseChainId) => TradingApi.ProtocolItems[] {
  const dexEnabled = getFeatureFlag(FeatureFlags.DEX)
  const isDutchV3Enabled = getFeatureFlag(FeatureFlags.ArbitrumDutchV3)

  const getV4SwapAllowed = createGetV4SwapEnabled({
    getSupportedChainId: createGetSupportedChainId({
      getChains: () => ctx.getEnabledChains(),
    }).getSupportedChainId,
  })

  const getProtocolsForChain = createProtocolFilter({
    getDEXEnabled: () => dexEnabled,
    getIsDEXSupported: ctx.getIsDEXSupported,
    getPriorityOrderFlag: getDEXPriorityOrderFlag,
    getV4Enabled: getV4SwapAllowed,
    getArbitrumDutchV3Enabled: () => isDutchV3Enabled,
  })

  return getProtocolsForChain
}

export function createGetDEXPriorityOrderFlag(ctx: {
  getFeatureFlag: (flagName: FeatureFlags) => boolean
}): (chainId?: UniverseChainId) => boolean {
  return (chainId?: UniverseChainId) => {
    if (!chainId) {
      return false
    }

    switch (chainId) {
      case UniverseChainId.Base:
        return ctx.getFeatureFlag(FeatureFlags.DEXPriorityOrdersBase)
      case UniverseChainId.Optimism:
        return ctx.getFeatureFlag(FeatureFlags.DEXPriorityOrdersOptimism)
      case UniverseChainId.Unichain:
        return ctx.getFeatureFlag(FeatureFlags.DEXPriorityOrdersUnichain)
      default:
        return false
    }
  }
}

export const getDEXPriorityOrderFlag = createGetDEXPriorityOrderFlag({
  getFeatureFlag,
})
