import { GraphQLApi } from '@l.x/api'
import { NUM_FIRST_NFTS } from 'lx/src/components/nfts/constants'
import { useEnabledChains } from 'lx/src/features/chains/hooks/useEnabledChains'
import { formatNftItems } from 'lx/src/features/nfts/utils'
import { selectPhotoFromLibrary } from '@luxfi/wallet/src/features/unitags/photoSelection'

export function useAvatarSelectionHandler({
  address,
  avatarImageUri,
  setAvatarImageUri,
  showModal,
}: {
  address: string
  avatarImageUri: string | undefined
  setAvatarImageUri: (uri: string) => void
  showModal: () => void
}): { avatarSelectionHandler: () => Promise<void>; hasNFTs: boolean } {
  const { gqlChains } = useEnabledChains()

  const { data: nftsData } = GraphQLApi.useNftsTabQuery({
    variables: {
      ownerAddress: address,
      first: NUM_FIRST_NFTS,
      filter: { filterSpam: false },
      chains: gqlChains,
    },
  })
  const nftItems = formatNftItems(nftsData)

  const hasNFTs = nftItems !== undefined && nftItems.length > 0
  const hasAvatarImage = avatarImageUri && avatarImageUri !== ''

  if (hasNFTs || hasAvatarImage) {
    return { avatarSelectionHandler: async () => showModal(), hasNFTs }
  } else {
    return {
      avatarSelectionHandler: async (): Promise<void> => {
        const selectedPhoto = await selectPhotoFromLibrary()
        if (selectedPhoto) {
          setAvatarImageUri(selectedPhoto)
        }
      },
      hasNFTs,
    }
  }
}
