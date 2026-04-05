import { useEffect, useMemo } from 'react'
import { useExtractedTokenColor, useSporeColors } from 'ui/src'
import {
  useCreateAuctionStore,
  useCreateAuctionStoreActions,
} from '~/pages/Liquidity/CreateAuction/CreateAuctionContext'
import { TokenMode } from '~/pages/Liquidity/CreateAuction/types'

/** Passed to color extraction as `defaultColor` so failures (no palette) stay distinguishable from real accent/extracted colors. */
const TOKEN_COLOR_EXTRACTION_SENTINEL = '#feedface'

export function useUpdateCreateAuctionTokenColor(): void {
  const colors = useSporeColors()
  const { setTokenColor } = useCreateAuctionStoreActions()
  const tokenForm = useCreateAuctionStore((state) => state.tokenForm)

  const imageUrl = useMemo(() => {
    if (tokenForm.mode === TokenMode.CREATE_NEW) {
      return tokenForm.imageUrl || undefined
    }
    return tokenForm.existingTokenCurrencyInfo?.logoUrl ?? undefined
  }, [tokenForm])

  const currencyName = useMemo(() => {
    if (tokenForm.mode === TokenMode.CREATE_NEW) {
      return tokenForm.name || undefined
    }
    return tokenForm.existingTokenCurrencyInfo?.currency.name ?? undefined
  }, [tokenForm])

  const { tokenColor, tokenColorLoading } = useExtractedTokenColor({
    imageUrl,
    tokenName: currencyName,
    backgroundColor: colors.surface3.val,
    defaultColor: TOKEN_COLOR_EXTRACTION_SENTINEL,
  })

  useEffect(() => {
    if (!imageUrl) {
      setTokenColor(undefined)
      return
    }
    if (tokenColorLoading) {
      setTokenColor(undefined)
      return
    }
    const extractionFailed = tokenColor?.toLowerCase() === TOKEN_COLOR_EXTRACTION_SENTINEL
    setTokenColor(extractionFailed ? undefined : (tokenColor ?? undefined))
  }, [imageUrl, tokenColor, tokenColorLoading, setTokenColor])
}
