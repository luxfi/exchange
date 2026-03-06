import DEXRouterLabel from '~/components/RouterLabel/DEXRouterLabel'
import type { DefaultTheme } from '~/lib/deprecated-styled'
import { QuoteMethod, SubmittableTrade } from '~/state/routing/types'
import { isDEXTrade } from '~/state/routing/utils'
import { ThemedText } from '~/theme/components'

export default function RouterLabel({ trade, color }: { trade: SubmittableTrade; color?: keyof DefaultTheme }) {
  if (isDEXTrade(trade)) {
    return (
      <DEXRouterLabel>
        <ThemedText.BodySmall>Lux X</ThemedText.BodySmall>
      </DEXRouterLabel>
    )
  }

  if (trade.quoteMethod === QuoteMethod.CLIENT_SIDE_FALLBACK) {
    return <ThemedText.BodySmall color={color}>Lux Client</ThemedText.BodySmall>
  }

  return <ThemedText.BodySmall color={color}>Lux API</ThemedText.BodySmall>
}
