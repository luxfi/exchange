import { Trans } from '@lingui/macro'
import { SupportedChainId } from 'constants/chains'
import { getChainInfo } from 'constants/chainInfo'
import { darken } from 'polished'
import { useState } from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { textFadeIn } from 'theme/styles'

import Resource from './Resource'

const NoInfoAvailable = styled.span`
  color: ${({ theme }) => theme.textTertiary};
  font-weight: 400;
  font-size: 16px;
`
const TokenDescriptionContainer = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
  max-height: fit-content;
  padding-top: 16px;
  line-height: 24px;
  white-space: pre-wrap;
`

const TruncateDescriptionButton = styled.div`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 400;
  font-size: 0.85em;
  padding-top: 0.5em;

  &:hover,
  &:focus {
    color: ${({ theme }) => darken(0.1, theme.textSecondary)};
    cursor: pointer;
  }
`

const truncateDescription = (desc: string) => {
  //trim the string to the maximum length
  let tokenDescriptionTruncated = desc.slice(0, TRUNCATE_CHARACTER_COUNT)
  //re-trim if we are in the middle of a word
  tokenDescriptionTruncated = `${tokenDescriptionTruncated.slice(
    0,
    Math.min(tokenDescriptionTruncated.length, tokenDescriptionTruncated.lastIndexOf(' '))
  )}...`
  return tokenDescriptionTruncated
}

const TRUNCATE_CHARACTER_COUNT = 400

export const AboutContainer = styled.div`
  gap: 16px;
  padding: 24px 0px;
  ${textFadeIn}
`
export const AboutHeader = styled(ThemedText.MediumHeader)`
  font-size: 28px !important;
`

const ResourcesContainer = styled.div`
  display: flex;
  padding-top: 12px;
  gap: 14px;
`

type AboutSectionProps = {
  address: string
  chainId: SupportedChainId
  description?: string | null | undefined
  homepageUrl?: string | null | undefined
  twitterName?: string | null | undefined
}

export function AboutSection({ address, chainId, description, homepageUrl, twitterName }: AboutSectionProps) {
  const [isDescriptionTruncated, setIsDescriptionTruncated] = useState(true)
  const shouldTruncate = !!description && description.length > TRUNCATE_CHARACTER_COUNT

  const tokenDescription = shouldTruncate && isDescriptionTruncated ? truncateDescription(description) : description

  //must remove
  let displayTokenDescription = tokenDescription;
  if (tokenDescription?.includes("Wrapped LUX")) {
    displayTokenDescription = 'Lux Coin for LUX'
  } else if (chainId == 96369) {
    displayTokenDescription = displayTokenDescription?.replace(/Lux/g, 'Liquid')
    displayTokenDescription = displayTokenDescription?.replace(/Solana/g, 'SOL')
    displayTokenDescription = displayTokenDescription?.replace(/Dollar/g, 'USD')
  }

  if (chainId == 200200 && displayTokenDescription == 'Lux Coin for LUX') {
    displayTokenDescription = displayTokenDescription?.replace(/LUX/g, 'ZOO')
    displayTokenDescription = displayTokenDescription?.replace(/Lux/g, 'Zoo')
  }

  let displayHomePageUrl = homepageUrl;
  if (chainId == 96369) {
    displayHomePageUrl = 'https://lux.network';
  } else if (chainId == 200200) {
    displayHomePageUrl = 'https://zoo.network';
  }

  let displayTwitterName = twitterName;
  if (chainId == 96369) {
    displayTwitterName = 'luxdefi';
  } else if (chainId == 200200) {
    displayTwitterName = 'zoo_labs';
  }

  const baseExplorerUrl = getChainInfo(chainId).explorer

  return (
    <AboutContainer data-testid="token-details-about-section">
      <AboutHeader>
        <Trans>About</Trans>
      </AboutHeader>
      <TokenDescriptionContainer>
        {!description && (
          <NoInfoAvailable>
            <Trans>No token information available</Trans>
          </NoInfoAvailable>
        )}
        {displayTokenDescription}
        {shouldTruncate && (
          <TruncateDescriptionButton onClick={() => setIsDescriptionTruncated(!isDescriptionTruncated)}>
            {isDescriptionTruncated ? <Trans>Show more</Trans> : <Trans>Hide</Trans>}
          </TruncateDescriptionButton>
        )}
      </TokenDescriptionContainer>
      <br />
      <ThemedText.SubHeaderSmall>
        <Trans>Links</Trans>
      </ThemedText.SubHeaderSmall>
      <ResourcesContainer data-cy="resources-container">
        <Resource
          name={chainId === SupportedChainId.MAINNET ? 'Etherscan' : 'Block Explorer'}
          link={`${baseExplorerUrl}${address === 'NATIVE' ? '' : '/address/' + address}`}
        />
        {displayHomePageUrl && <Resource name="Website" link={displayHomePageUrl} />}
        {displayTwitterName && <Resource name="Twitter" link={`https://twitter.com/${displayTwitterName}`} />}
      </ResourcesContainer>
    </AboutContainer>
  )
}