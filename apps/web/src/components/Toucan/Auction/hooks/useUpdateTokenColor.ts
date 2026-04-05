import { useLayoutEffect } from 'react'
<<<<<<< HEAD
import { useSporeColors } from '@l.x/ui/src'
=======
import { useSporeColors } from 'ui/src'
>>>>>>> upstream/main
import { useAuctionStore, useAuctionStoreActions } from '~/components/Toucan/Auction/store/useAuctionStore'
import { useSrcColor } from '~/hooks/useColor'

/**
 * Custom hook to extract and update token color in auction store
 * Uses the token's logo URL to derive a dominant color for theming
 */
export function useUpdateTokenColor(): void {
  const colors = useSporeColors()

  const { setTokenColor, setTokenColorLoading } = useAuctionStoreActions()
  const { token, logoUrl, tokenName } = useAuctionStore((state) => ({
    token: state.auctionDetails?.token,
    logoUrl: state.auctionDetails?.token?.logoUrl ?? undefined,
    tokenName: state.auctionDetails?.token?.currency.name ?? undefined,
  }))

  const { tokenColor, tokenColorLoading } = useSrcColor({
    src: logoUrl,
    currencyName: tokenName,
<<<<<<< HEAD
    backgroundColor: colors.surface3.val,
=======
    backgroundColor: colors.surface2.val,
>>>>>>> upstream/main
  })

  useLayoutEffect(() => {
    // Wait for token to be available before updating store
    if (!token) {
      return
    }

    // Always mark loading as complete when extraction finishes, regardless of whether we got a color
    if (!tokenColorLoading) {
      setTokenColorLoading(false)
      if (tokenColor) {
        setTokenColor(tokenColor)
      }
    }
  }, [token, tokenColor, tokenColorLoading, setTokenColor, setTokenColorLoading])
}
