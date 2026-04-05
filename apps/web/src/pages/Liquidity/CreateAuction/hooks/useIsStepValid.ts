import { getMinStartTime } from '~/pages/Liquidity/CreateAuction/components/DurationSection'
import { isValidPoolOwner } from '~/pages/Liquidity/CreateAuction/components/PoolOwnerSection'
import { useCreateAuctionStore } from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { CreateAuctionStep, TokenMode } from '~/pages/Liquidity/CreateAuction/types'

export function useIsStepValid(step: CreateAuctionStep): boolean {
  return useCreateAuctionStore((state) => {
    const { tokenForm, configureAuction, customizePool } = state

    switch (step) {
      case CreateAuctionStep.ADD_TOKEN_INFO:
        if (tokenForm.mode === TokenMode.CREATE_NEW) {
          return (
            tokenForm.name.trim().length > 0 &&
            tokenForm.symbol.trim().length > 0 &&
            tokenForm.description.trim().length > 0
          )
        }
        return (
          tokenForm.existingTokenCurrencyInfo !== undefined &&
          tokenForm.description.trim().length > 0 &&
          tokenForm.totalSupply !== undefined
        )

      case CreateAuctionStep.CONFIGURE_AUCTION: {
        const { committed, startTime, floorPrice } = configureAuction
        if (!committed) {
          return false
        }
        const isStartTimeValid = !!startTime && startTime.getTime() >= getMinStartTime().getTime()
        return isStartTimeValid && !committed.auctionSupplyAmount.equalTo(0) && !!floorPrice
      }

      case CreateAuctionStep.CUSTOMIZE_POOL:
        if (!configureAuction.committed || !configureAuction.startTime) {
          return false
        }
        return isValidPoolOwner(customizePool.poolOwner)

      case CreateAuctionStep.REVIEW_LAUNCH:
        return true

      default:
        return false
    }
  })
}
