import { Flex, Text } from '@l.x/ui/src'
import { MouseoverTooltip } from '~/components/Tooltip'
import { useIs3643 } from '~/hooks/useIs3643'

type SecuritiesBadgeProps = {
  address?: string
  chainId?: number
  /** Optional override; otherwise the hook determines visibility. */
  forceVisible?: boolean
  size?: 'sm' | 'md'
}

/**
 * Renders a small "SECURITY" pill next to a token symbol when the token is
 * an ERC-3643 (T-REX) permissioned security. Hidden when the token is not 3643.
 */
export function SecuritiesBadge({
  address,
  chainId,
  forceVisible,
  size = 'sm',
}: SecuritiesBadgeProps): JSX.Element | null {
  const { is3643 } = useIs3643({ address, chainId })
  if (!forceVisible && !is3643) {
    return null
  }
  const paddingHorizontal = size === 'sm' ? 4 : 6
  const paddingVertical = size === 'sm' ? 0 : 2
  const fontSize = size === 'sm' ? 9 : 11
  return (
    <MouseoverTooltip
      placement="top"
      text="Permissioned security (ERC-3643). Transfers are subject to on-chain compliance checks."
    >
      <Flex
        marginLeft={4}
        paddingLeft={paddingHorizontal}
        paddingRight={paddingHorizontal}
        paddingTop={paddingVertical}
        paddingBottom={paddingVertical}
        borderRadius={4}
        backgroundColor="$accent2"
        borderWidth={1}
        borderColor="$accent1"
        alignItems="center"
        justifyContent="center"
      >
        <Text fontSize={fontSize} fontWeight="700" color="$accent1" letterSpacing={0.5}>
          SECURITY
        </Text>
      </Flex>
    </MouseoverTooltip>
  )
}
