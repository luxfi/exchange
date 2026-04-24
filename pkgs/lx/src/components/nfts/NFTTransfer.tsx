import { Flex, Text } from '@l.x/ui/src'
import { iconSizes } from '@l.x/ui/src/theme'
import { NFTViewer } from '@l.x/lx/src/components/nfts/NFTViewer'
import { type GQLNftAsset } from '@l.x/lx/src/features/nfts/types'

export function NFTTransfer({ asset, nftSize }: { asset: GQLNftAsset; nftSize?: number }): JSX.Element {
  return (
    <Flex centered gap="$spacing16">
      <Flex borderRadius="$rounded16" height={nftSize} overflow="hidden" width={nftSize}>
        <NFTViewer maxHeight={nftSize} uri={asset?.image?.url} />
      </Flex>
      <Flex centered row gap="$spacing8">
        <Flex borderRadius="$roundedFull" height={iconSizes.icon28} overflow="hidden" width={iconSizes.icon28}>
          <NFTViewer uri={asset?.collection?.image?.url} />
        </Flex>
        <Text variant="buttonLabel1">{asset?.name}</Text>
      </Flex>
    </Flex>
  )
}
