import { memo, useMemo } from 'react'
import { useAuctionTokenColor } from '~/components/Toucan/Auction/hooks/useAuctionTokenColor'
import { useBidTokenInfo } from '~/components/Toucan/Auction/hooks/useBidTokenInfo'
import { useAuctionStore } from '~/components/Toucan/Auction/store/useAuctionStore'
import { getClearingPrice } from '~/components/Toucan/Auction/utils/clearingPrice'
import { ValuationSlider } from '~/components/Toucan/Shared/ValuationSlider'

interface BidMaxValuationSliderProps {
  value: string
  onChange: (amount: string) => void
  bidTokenDecimals?: number
  bidTokenSymbol: string
  tokenColor?: string
  disabled?: boolean
  onInteractionStart?: () => void
}

function BidMaxValuationSliderComponent({
  value,
  onChange,
  bidTokenDecimals,
  bidTokenSymbol,
  tokenColor,
  disabled,
  onInteractionStart,
}: BidMaxValuationSliderProps): JSX.Element | null {
  const { t } = useTranslation()
  const { convertFiatAmountFormatted } = useLocalizationContext()
