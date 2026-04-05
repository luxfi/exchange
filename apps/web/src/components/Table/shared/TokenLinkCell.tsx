<<<<<<< HEAD
import { GraphQLApi } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Flex, styled } from '@l.x/ui/src/index'
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
=======
import { GraphQLApi } from '@universe/api'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { Flex, styled } from 'ui/src/index'
import { TokenLogo } from 'uniswap/src/components/CurrencyLogo/TokenLogo'
import { useEnabledChains } from 'uniswap/src/features/chains/hooks/useEnabledChains'
import { fromGraphQLChain } from 'uniswap/src/features/chains/utils'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { currencyId as toCurrencyId } from 'uniswap/src/utils/currencyId'
import { getTokenDetailsURL, gqlToCurrency, unwrapToken } from '~/appGraphql/data/util'
import { EllipsisText } from '~/components/Table/shared/TableText'
import { ClickableTamaguiStyle } from '~/theme/components/styles'

const StyledInternalLink = styled(Link, {
  ...ClickableTamaguiStyle,
>>>>>>> upstream/main
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
<<<<<<< HEAD
export const TokenLinkCell = ({ token, hideLogo }: { token: GraphQLApi.Token; hideLogo?: boolean }) => {
=======
export const TokenLinkCell = ({
  token,
  hideLogo,
  showMainnetNetworkLogo,
}: {
  token: GraphQLApi.Token
  hideLogo?: boolean
  showMainnetNetworkLogo?: boolean
}) => {
>>>>>>> upstream/main
  const { t } = useTranslation()
  const { defaultChainId } = useEnabledChains()
  const chainId = fromGraphQLChain(token.chain) ?? defaultChainId
  const unwrappedToken = unwrapToken(chainId, token)
<<<<<<< HEAD
  const isNative = unwrappedToken.address === NATIVE_CHAIN_ID
  const nativeCurrency = useCurrency({
    address: NATIVE_CHAIN_ID,
    chainId,
  })
=======
  const currency = gqlToCurrency(unwrappedToken)
  const currencyInfo = useCurrencyInfo(currency ? toCurrencyId(currency) : undefined)

>>>>>>> upstream/main
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
<<<<<<< HEAD
          <PortfolioLogo
            chainId={chainId}
            size={22}
            images={isNative ? undefined : [token.project?.logo?.url]}
            fallbackSymbols={[token.symbol]}
            currencies={isNative ? [nativeCurrency] : undefined}
=======
          <TokenLogo
            chainId={chainId}
            size={22}
            url={currencyInfo?.logoUrl ?? token.project?.logo?.url}
            symbol={currencyInfo?.currency.symbol ?? token.symbol}
            name={currencyInfo?.currency.name}
            showMainnetNetworkLogo={showMainnetNetworkLogo}
>>>>>>> upstream/main
          />
        )}
      </Flex>
    </StyledInternalLink>
  )
}
