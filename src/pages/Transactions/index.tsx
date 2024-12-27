import { Trans } from '@lingui/macro'
import { Trace } from '@uniswap/analytics'
import { MAX_WIDTH_MEDIA_BREAKPOINT, MEDIUM_MEDIA_BREAKPOINT } from 'components/Tokens/constants'
import { filterStringAtom } from 'components/Tokens/state'
import NetworkFilter from 'components/Transactions/NetworkFilter'
import TransactionsTable from 'components/Transactions/TransactionTable'

import { MouseoverTooltip } from 'components/Tooltip'
import { useResetAtom } from 'jotai/utils'
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'

const ExploreContainer = styled.div`
  width: 100%;
  min-width: 320px;
  padding: 68px 12px 0px;

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    padding-top: 48px;
  }

  @media only screen and (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    padding-top: 20px;
  }
`
const TitleContainer = styled.div`
  margin-bottom: 32px;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin-left: auto;
  margin-right: auto;
  display: flex;
`
const FiltersContainer = styled.div`
  display: flex;
  gap: 8px;
  height: 40px;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    order: 2;
  }
`
const SearchContainer = styled(FiltersContainer)`
  margin-left: 8px;
  width: 100%;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    margin: 0px;
    order: 1;
  }
`
const FiltersWrapper = styled.div`
  display: flex;
  max-width: ${MAX_WIDTH_MEDIA_BREAKPOINT};
  margin: 0 auto;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.textTertiary};
  flex-direction: row;

  @media only screen and (max-width: ${MEDIUM_MEDIA_BREAKPOINT}) {
    flex-direction: column;
    gap: 8px;
  }
`

export declare enum InterfacePageName {
  ABOUT_PAGE = "about-page",
  LANDING_PAGE = "landing-page",
  NFT_COLLECTION_PAGE = "nft-collection-page",
  NFT_DETAILS_PAGE = "nft-details-page",
  NFT_EXPLORE_PAGE = "nft-explore-page",
  NFT_PROFILE_PAGE = "nft-profile-page",
  NOT_FOUND = "not-found",
  POOL_PAGE = "pool-page",
  POOLS_PAGE = "pools-page",
  SWAP_PAGE = "swap-page",
  TOKENS_PAGE = "tokens-page",
  TRANSACTIONS_PAGE = "transactions-page",
  TOKEN_DETAILS_PAGE = "token-details",
  VOTE_PAGE = "vote-page"
}

const Transactions = () => {
  const resetFilterString = useResetAtom(filterStringAtom)
  const location = useLocation()

  useEffect(() => {
    resetFilterString()
  }, [location, resetFilterString])

  return (
    <Trace page={InterfacePageName.TRANSACTIONS_PAGE} shouldLogImpression>
      <ExploreContainer>
        <TitleContainer>
          <MouseoverTooltip
            text={<Trans>This table contains the latest transactions by date</Trans>}
            placement="bottom"
            >
            <ThemedText.LargeHeader>
              <Trans>Latest Transactions</Trans>
            </ThemedText.LargeHeader>
          </MouseoverTooltip>
        </TitleContainer>
        <FiltersWrapper>
          <FiltersContainer>
            <NetworkFilter />
          </FiltersContainer>
        </FiltersWrapper>
        <TransactionsTable />
      </ExploreContainer>
    </Trace>
  )
}

export default Transactions