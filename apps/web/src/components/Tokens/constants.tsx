<<<<<<< HEAD
import { ReactNode } from 'react'
import { Trans } from 'react-i18next'
=======
import type { TFunction } from 'i18next'
import { ReactNode } from 'react'
>>>>>>> upstream/main

export enum TokenSortMethod {
  FULLY_DILUTED_VALUATION = 'FDV',
  PRICE = 'Price',
  VOLUME = 'Volume',
  HOUR_CHANGE = '1 hour',
  DAY_CHANGE = '1 day',
}

<<<<<<< HEAD
export const HEADER_DESCRIPTIONS: Record<TokenSortMethod, ReactNode | undefined> = {
  [TokenSortMethod.PRICE]: undefined,
  [TokenSortMethod.DAY_CHANGE]: undefined,
  [TokenSortMethod.HOUR_CHANGE]: undefined,
  [TokenSortMethod.FULLY_DILUTED_VALUATION]: <Trans i18nKey="stats.fdv.description" />,
  [TokenSortMethod.VOLUME]: <Trans i18nKey="stats.volume.description" />,
=======
export function getHeaderDescription({
  t,
  category,
  networkName,
}: {
  t: TFunction
  category: TokenSortMethod
  networkName?: string
}): ReactNode | undefined {
  switch (category) {
    case TokenSortMethod.PRICE:
      return networkName
        ? t('explore.tokens.table.column.price.network.tooltip', { network: networkName })
        : t('explore.tokens.table.column.price.allNetworks.tooltip')
    case TokenSortMethod.DAY_CHANGE:
    case TokenSortMethod.HOUR_CHANGE:
      return undefined
    case TokenSortMethod.FULLY_DILUTED_VALUATION:
      return t('stats.fdv.description')
    case TokenSortMethod.VOLUME:
      return t('stats.volume.description')
    default:
      return undefined
  }
>>>>>>> upstream/main
}
