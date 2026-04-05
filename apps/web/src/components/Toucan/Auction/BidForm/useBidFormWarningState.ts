<<<<<<< HEAD
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useMemo } from 'react'
import { getChainInfo, TOUCAN_AUCTION_SUPPORTED_CHAINS } from '@l.x/lx/src/features/chains/chainInfo'
import { UniverseChainId } from '@l.x/lx/src/features/chains/types'
import { areAddressesEqual } from '@l.x/lx/src/utils/addresses'
import { isNativeCurrencyAddress } from '@l.x/lx/src/utils/currencyId'
=======
import { FeatureFlags, useFeatureFlag } from '@universe/gating'
import { useMemo } from 'react'
import { getChainInfo, TOUCAN_AUCTION_SUPPORTED_CHAINS } from 'uniswap/src/features/chains/chainInfo'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { areAddressesEqual } from 'uniswap/src/utils/addresses'
import { isNativeCurrencyAddress } from 'uniswap/src/utils/currencyId'
>>>>>>> upstream/main
import { zeroAddress } from 'viem'
import { AuctionProgressState, UserBid } from '~/components/Toucan/Auction/store/types'

interface UseBidFormWarningStateParams {
  chainId?: UniverseChainId
  currency?: string
  auctionProgressState: AuctionProgressState
  userBids: UserBid[]
  validationHook?: string
  validationError?: boolean
}

interface BidFormWarningState {
  showDisabledState: boolean
  shouldShowWarningBanner: boolean
  shouldDisableBidForm: boolean
}

export function useBidFormWarningState({
  chainId,
  currency,
  auctionProgressState,
  userBids,
  validationHook,
  validationError,
}: UseBidFormWarningStateParams): BidFormWarningState {
  const isToucanAuctionKYCEnabled = useFeatureFlag(FeatureFlags.ToucanAuctionKYC)

  return useMemo(() => {
    const isAuctionEnded = auctionProgressState === AuctionProgressState.ENDED
    const hasNoBids = userBids.length === 0
    const showDisabledState = isAuctionEnded && hasNoBids

    const isSupportedChain = Boolean(chainId && TOUCAN_AUCTION_SUPPORTED_CHAINS.includes(chainId))
    const normalizedCurrency = currency?.toLowerCase()
    const isNativeBidToken = Boolean(
      chainId &&
<<<<<<< HEAD
        normalizedCurrency &&
        (normalizedCurrency === zeroAddress || isNativeCurrencyAddress(chainId, normalizedCurrency)),
=======
      normalizedCurrency &&
      (normalizedCurrency === zeroAddress || isNativeCurrencyAddress(chainId, normalizedCurrency)),
>>>>>>> upstream/main
    )
    const usdcAddress = chainId && isSupportedChain ? getChainInfo(chainId).tokens.USDC?.address : undefined
    const isUsdcBidToken = Boolean(
      chainId &&
<<<<<<< HEAD
        normalizedCurrency &&
        usdcAddress &&
        areAddressesEqual({
          addressInput1: { address: normalizedCurrency, chainId },
          addressInput2: { address: usdcAddress, chainId },
        }),
=======
      normalizedCurrency &&
      usdcAddress &&
      areAddressesEqual({
        addressInput1: { address: normalizedCurrency, chainId },
        addressInput2: { address: usdcAddress, chainId },
      }),
>>>>>>> upstream/main
    )
    const isValidationErrorWarning = isToucanAuctionKYCEnabled
      ? Boolean(validationError)
      : Boolean(validationHook && validationHook !== zeroAddress)
    const isUnsupportedChainWarning = Boolean(chainId && !isSupportedChain)
    const isUnsupportedBidTokenWarning = Boolean(
      isSupportedChain && normalizedCurrency && !isNativeBidToken && !isUsdcBidToken,
    )
    const shouldShowWarningBanner =
      isUnsupportedChainWarning || isUnsupportedBidTokenWarning || isValidationErrorWarning
    const shouldDisableBidForm = showDisabledState || shouldShowWarningBanner

    return {
      showDisabledState,
      shouldShowWarningBanner,
      shouldDisableBidForm,
    }
  }, [auctionProgressState, chainId, currency, userBids, validationError, validationHook, isToucanAuctionKYCEnabled])
}
