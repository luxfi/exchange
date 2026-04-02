import { GraphQLApi } from '@luxexchange/api'
import { useMemo, useState } from 'react'
import { getNativeAddress } from '@luxexchange/lx/src/constants/addresses'
import { useCrossChainBalances } from '@luxexchange/lx/src/data/balances/hooks/useCrossChainBalances'
import { useTokenBasicProjectPartsFragment } from '@luxexchange/lx/src/data/graphql/lux-data-api/fragments'
import { UniverseChainId } from '@luxexchange/lx/src/features/chains/types'
import { fromGraphQLChain } from '@luxexchange/lx/src/features/chains/utils'
import { PortfolioBalance } from '@luxexchange/lx/src/features/dataApi/types'
import { CurrencyField } from '@luxexchange/lx/src/types/currency'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { useWalletNavigation } from '@luxfi/wallet/src/contexts/WalletNavigationContext'
import { useActiveAccountAddressWithThrow } from '@luxfi/wallet/src/features/wallet/hooks'

type NetworkSheetAction = 'sell' | 'send'

interface UseNetworkBalanceSheetParams {
  currencyId: string
  chainId: UniverseChainId
}

interface UseNetworkBalanceSheetResult {
  allChainBalances: PortfolioBalance[]
  hasMultiChainBalances: boolean
  isNetworkSheetOpen: boolean
  openSellSheet: () => void
  openSendSheet: () => void
  onCloseNetworkSheet: () => void
  onSelectNetwork: (balance: PortfolioBalance) => void
}

export function useNetworkBalanceSheet({
  currencyId,
  chainId,
}: UseNetworkBalanceSheetParams): UseNetworkBalanceSheetResult {
  const activeAddress = useActiveAccountAddressWithThrow()
  const { navigateToSwapFlow, navigateToSend } = useWalletNavigation()

  // Cross-chain balances (Apollo-cached, no extra network requests)
  const projectTokens = useTokenBasicProjectPartsFragment({ currencyId }).data.project?.tokens
  const crossChainTokens = useMemo(() => {
    const result: Array<{ address: string | null; chain: GraphQLApi.Chain }> = []
    for (const projectToken of projectTokens ?? []) {
      if (projectToken?.chain && projectToken.address !== undefined) {
        const chainIdForToken = fromGraphQLChain(projectToken.chain)
        if (chainIdForToken && chainIdForToken !== chainId) {
          result.push({ address: projectToken.address, chain: projectToken.chain })
        }
      }
    }
    return result
  }, [projectTokens, chainId])

  const { currentChainBalance: crossChainCurrentBalance, otherChainBalances } = useCrossChainBalances({
    evmAddress: activeAddress,
    currencyId,
    crossChainTokens,
  })

  const allChainBalances = useMemo(() => {
    const others = otherChainBalances ?? []
    return crossChainCurrentBalance ? [crossChainCurrentBalance, ...others] : others
  }, [crossChainCurrentBalance, otherChainBalances])

  const hasMultiChainBalances = allChainBalances.length > 1

  // Sheet state
  const [networkSheetAction, setNetworkSheetAction] = useState<NetworkSheetAction | null>(null)
  const isNetworkSheetOpen = networkSheetAction !== null

  const openSellSheet = useEvent(() => setNetworkSheetAction('sell'))
  const openSendSheet = useEvent(() => setNetworkSheetAction('send'))
  const onCloseNetworkSheet = useEvent(() => setNetworkSheetAction(null))

  const onSelectNetwork = useEvent((balance: PortfolioBalance) => {
    const action = networkSheetAction
    setNetworkSheetAction(null)
    const { currency } = balance.currencyInfo
    const currencyAddress = currency.isToken ? currency.address : getNativeAddress(currency.chainId)

    if (action === 'send') {
      navigateToSend({ currencyAddress, chainId: currency.chainId })
    } else {
      navigateToSwapFlow({
        currencyField: CurrencyField.INPUT,
        currencyAddress,
        currencyChainId: currency.chainId,
      })
    }
  })

  return {
    allChainBalances,
    hasMultiChainBalances,
    isNetworkSheetOpen,
    openSellSheet,
    openSendSheet,
    onCloseNetworkSheet,
    onSelectNetwork,
  }
}
