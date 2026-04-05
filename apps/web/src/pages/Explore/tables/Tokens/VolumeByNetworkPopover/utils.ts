import type { MultichainToken } from '@uniswap/client-data-api/dist/data/v1/types_pb'
import type { TFunction } from 'i18next'
import { uniswapUrls } from 'uniswap/src/constants/urls'
import { getChainInfo } from 'uniswap/src/features/chains/chainInfo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { TimePeriod } from '~/appGraphql/data/util'
import {
  sortMultichainTokenByVolume,
  TIME_PERIOD_TO_VOLUME_KEY,
} from '~/state/explore/listTokens/utils/multichainVolume'

export function getVolumeLabelForTimePeriod(t: TFunction, timePeriod: TimePeriod): string {
  switch (timePeriod) {
    case TimePeriod.HOUR:
      return t('explore.volume.1hour')
    case TimePeriod.DAY:
      return t('explore.volume.1day')
    case TimePeriod.WEEK:
      return t('explore.volume.1week')
    case TimePeriod.MONTH:
      return t('explore.volume.1month')
    case TimePeriod.YEAR:
      return t('explore.volume.1year')
    case TimePeriod.MAX:
      return t('explore.volume.all')
    default:
      return timePeriod satisfies never
  }
}

export function getChainLogoUrl(chainId: UniverseChainId | undefined): string | undefined {
  if (chainId === undefined) {
    return undefined
  }
  const networkName = getChainInfo(chainId).assetRepoNetworkName
  if (!networkName) {
    return undefined
  }
  return `${uniswapUrls.uniswapAssetsBlockchainsBaseUrl}/${networkName}/info/logo.png`
}

export function getVolumeBreakdownForPeriod(
  mcToken: MultichainToken | undefined,
  timePeriod: TimePeriod,
): { chainId: UniverseChainId; volume: number }[] {
  if (!mcToken?.chainTokens.length) {
    return []
  }
  const volumeKey = TIME_PERIOD_TO_VOLUME_KEY[timePeriod]
  const sorted = sortMultichainTokenByVolume(mcToken, timePeriod)
  return sorted.chainTokens
    .filter((ct) => (ct.stats?.[volumeKey] ?? 0) > 0)
    .map((ct) => ({ chainId: ct.chainId as UniverseChainId, volume: ct.stats?.[volumeKey] ?? 0 }))
}

export function getPercentageDisplay(volume: number, totalVolume: number): string {
  if (totalVolume === 0) {
    return '0%'
  }
  const percentage = (volume / totalVolume) * 100
  return percentage === Math.round(percentage) ? `${Math.round(percentage)}%` : `${percentage.toFixed(1)}%`
}
