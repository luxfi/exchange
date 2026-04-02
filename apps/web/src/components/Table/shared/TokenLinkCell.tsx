import { GraphQLApi } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Flex, styled } from '@luxfi/ui/src/index'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { fromGraphQLChain } from 'lx/src/features/chains/utils'
import { getTokenDetailsURL, unwrapToken } from '~/appGraphql/data/util'
import { PortfolioLogo } from '~/components/AccountDrawer/MiniPortfolio/PortfolioLogo'
import { EllipsisText } from '~/components/Table/shared/TableText'
import { NATIVE_CHAIN_ID } from '~/constants/tokens'
import { useCurrency } from '~/hooks/Tokens'
import { ClickableGuiStyle } from '~/theme/components/styles'

const StyledInternalLink = styled(Link, {
  ...ClickableGuiStyle,
  color: '$neutral1',
  '$platform-web': {
    textDecoration: 'none',
  },
})

/**
 * Given a token displays the Token's Logo and Symbol with a link to its TDP
 * @param token
 * @returns JSX.Element showing the Token's Logo, Chain logo if non-mainnet, and Token Symbol
 */
export const TokenLinkCell = ({ token, hideLogo }: { token: GraphQLApi.Token; hideLogo?: boolean }) => {
  const { t } = useTranslation()
  const { defaultChainId } = useEnabledChains()
  const chainId = fromGraphQLChain(token.chain) ?? defaultChainId
  const unwrappedToken = unwrapToken(chainId, token)
  const isNative = unwrappedToken.address === NATIVE_CHAIN_ID
  const nativeCurrency = useCurrency({
    address: NATIVE_CHAIN_ID,
    chainId,
  })
  return (
    <StyledInternalLink
      to={getTokenDetailsURL({
        address: unwrappedToken.address,
        chain: token.chain,
      })}
    >
      <Flex row gap="$gap8" maxWidth="100px" alignItems="center">
        <EllipsisText>{unwrappedToken.symbol ?? t('common.unknown').toUpperCase()}</EllipsisText>
        {!hideLogo && (
          <PortfolioLogo
            chainId={chainId}
            size={22}
            images={isNative ? undefined : [token.project?.logo?.url]}
            fallbackSymbols={[token.symbol]}
            currencies={isNative ? [nativeCurrency] : undefined}
          />
        )}
      </Flex>
    </StyledInternalLink>
  )
}
