import { BottomSheetScrollView } from '@gorhom/bottom-sheet'
import { GraphQLApi } from '@l.x/api'
import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useWindowDimensions } from 'react-native'
import { FlatList } from 'react-native-gesture-handler'
import { LinkButton, type LinkButtonProps, LinkButtonType } from 'src/components/TokenDetails/LinkButton'
import { useTokenDetailsContext } from 'src/components/TokenDetails/TokenDetailsContext'
import { Flex, Text } from '@luxfi/ui/src'
import { BlockExplorer, GlobeFilled, Page, XTwitter } from '@luxfi/ui/src/components/icons'
import { spacing } from '@luxfi/ui/src/theme'
import { getBlockExplorerIcon } from '@l.x/lx/src/components/chains/BlockExplorerIcon'
import { MultichainAddressList } from '@l.x/lx/src/components/MultichainTokenDetails/MultichainAddressList'
import { MultichainExplorerList } from '@l.x/lx/src/components/MultichainTokenDetails/MultichainExplorerList'
import type { MultichainTokenEntry } from '@l.x/lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { useOrderedMultichainEntries } from '@l.x/lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { Modal } from '@l.x/lx/src/components/modals/Modal'
import { useTokenProjectUrlsPartsFragment } from '@l.x/lx/src/data/graphql/lux-data-api/fragments'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { fromGraphQLChain } from '@l.x/lx/src/features/chains/utils'
import { currencyIdToContractInput } from '@l.x/lx/src/features/dataApi/utils/currencyIdToContractInput'
import { chainIdToPlatform } from '@l.x/lx/src/features/platforms/utils/chains'
import { ElementName, ModalName } from '@l.x/lx/src/features/telemetry/constants'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { isDefaultNativeAddress, isNativeCurrencyAddress } from '@l.x/lx/src/utils/currencyId'
import { ExplorerDataType, getExplorerLink, getTwitterLink, openUri } from '@l.x/lx/src/utils/linking'

const MIN_SHEET_HEIGHT = 520
const INITIAL_SNAP_PERCENT = 0.65

const SCROLL_CONTENT_STYLE = { paddingHorizontal: spacing.spacing24 }

const ListHeaderSpacer = (): JSX.Element => <Flex width="$spacing16" />
const ItemSeparatorComponent = (): JSX.Element => <Flex width="$spacing8" />

const renderItem = ({ item }: { item: LinkButtonProps }): JSX.Element => <LinkButton {...item} />

const keyExtractor = (item: LinkButtonProps): string => item.testID ?? item.label

/** Fetches cross-chain token data and returns entries ordered by network selector order. */
function useMultichainTokenEntries(currencyId: string): MultichainTokenEntry[] {
  const contractInput = useMemo(() => currencyIdToContractInput(currencyId), [currencyId])
  const { data } = GraphQLApi.useTokenProjectsQuery({
    variables: { contracts: [contractInput] },
  })

  const entries = useMemo(() => {
    const tokens = data?.tokenProjects?.[0]?.tokens
    if (!tokens) {
      return []
    }
    const result: MultichainTokenEntry[] = []
    for (const token of tokens) {
      const chainId = fromGraphQLChain(token.chain)
      if (chainId && token.address) {
        result.push({ chainId, address: token.address })
      }
    }
    return result
  }, [data])

  return useOrderedMultichainEntries(entries)
}

export function TokenDetailsLinks(): JSX.Element {
  const { t } = useTranslation()

  const { address, chainId, currencyId, copyAddressToClipboard } = useTokenDetailsContext()

  const isMultichainTokenUx = useFeatureFlag(FeatureFlags.MultichainTokenUx)
  const multichainEntries = useMultichainTokenEntries(currencyId)
  const hasMultipleChains = multichainEntries.length > 1

  const { height: screenHeight } = useWindowDimensions()
  const multichainSnapPoints = useMemo(() => {
    const percentHeight = INITIAL_SNAP_PERCENT * screenHeight
    const initialSnap = Math.min(Math.max(percentHeight, MIN_SHEET_HEIGHT), screenHeight)
    return [initialSnap, '100%']
  }, [screenHeight])

  const { homepageUrl, twitterName } = useTokenProjectUrlsPartsFragment({ currencyId }).data.project ?? {}

  const explorerLink = getExplorerLink({ chainId, data: address, type: ExplorerDataType.TOKEN })
  const explorerName = getChainInfo(chainId).explorer.name

  const isNativeCurrency = isNativeCurrencyAddress(chainId, address)

  const [isExplorerSheetOpen, setIsExplorerSheetOpen] = useState(false)
  const [isAddressSheetOpen, setIsAddressSheetOpen] = useState(false)

  const handleExplorerPress = useCallback(async (url: string) => {
    await openUri({ uri: url })
    setIsExplorerSheetOpen(false)
  }, [])

  const handleCopyAddress = useCallback(
    async (addr: string) => {
      await copyAddressToClipboard(addr)
      setIsAddressSheetOpen(false)
    },
    [copyAddressToClipboard],
  )

  const links = useMemo((): LinkButtonProps[] => {
    const showMultichainDropdowns = isMultichainTokenUx && hasMultipleChains
    const isNativeAddress = isDefaultNativeAddress({ address, platform: chainIdToPlatform(chainId) })
    const items: LinkButtonProps[] = []

    if (!isNativeAddress) {
      if (showMultichainDropdowns) {
        items.push({
          Icon: Page,
          element: ElementName.MultichainAddress,
          label: t('common.address'),
          testID: TestID.MultichainAddressDropdown,
          onPress: () => setIsAddressSheetOpen(true),
        })
      } else {
        items.push({
          buttonType: LinkButtonType.Copy,
          element: ElementName.Copy,
          label: t('common.text.contract'),
          testID: TestID.TokenLinkCopy,
          value: address,
        })
      }
    }

    if (!isNativeCurrency) {
      if (showMultichainDropdowns) {
        items.push({
          Icon: BlockExplorer,
          element: ElementName.MultichainExplorer,
          label: t('common.explorer'),
          testID: TestID.MultichainExplorerDropdown,
          onPress: () => setIsExplorerSheetOpen(true),
        })
      } else {
        items.push({
          Icon: getBlockExplorerIcon(chainId),
          buttonType: LinkButtonType.Link,
          element: ElementName.TokenLinkEtherscan,
          label: explorerName,
          testID: TestID.TokenLinkEtherscan,
          value: explorerLink,
        })
      }
    }

    if (homepageUrl) {
      items.push({
        Icon: GlobeFilled,
        buttonType: LinkButtonType.Link,
        element: ElementName.TokenLinkWebsite,
        label: t('token.links.website'),
        testID: TestID.TokenLinkWebsite,
        value: homepageUrl,
      })
    }

    if (twitterName) {
      items.push({
        Icon: XTwitter,
        buttonType: LinkButtonType.Link,
        element: ElementName.TokenLinkTwitter,
        label: t('token.links.twitter'),
        testID: TestID.TokenLinkTwitter,
        value: getTwitterLink(twitterName),
      })
    }

    return items
  }, [
    chainId,
    address,
    isNativeCurrency,
    isMultichainTokenUx,
    hasMultipleChains,
    homepageUrl,
    twitterName,
    explorerName,
    explorerLink,
    t,
  ])

  return (
    <Flex gap="$spacing8">
      <Text color="$neutral2" mx="$spacing16" variant="subheading2">
        {t('token.links.title')}
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={links}
        ListHeaderComponent={ListHeaderSpacer}
        ListFooterComponent={ItemSeparatorComponent}
        ItemSeparatorComponent={ItemSeparatorComponent}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />

      {isExplorerSheetOpen && (
        <Modal
          fullScreen
          overrideInnerContainer
          name={ModalName.MultichainExplorerModal}
          snapPoints={multichainSnapPoints}
          onClose={() => setIsExplorerSheetOpen(false)}
        >
          <BottomSheetScrollView contentContainerStyle={SCROLL_CONTENT_STYLE} showsVerticalScrollIndicator={false}>
            <MultichainExplorerList renderedInModal chains={multichainEntries} onExplorerPress={handleExplorerPress} />
          </BottomSheetScrollView>
        </Modal>
      )}

      {isAddressSheetOpen && (
        <Modal
          fullScreen
          overrideInnerContainer
          name={ModalName.MultichainAddressModal}
          snapPoints={multichainSnapPoints}
          onClose={() => setIsAddressSheetOpen(false)}
        >
          <BottomSheetScrollView contentContainerStyle={SCROLL_CONTENT_STYLE} showsVerticalScrollIndicator={false}>
            <MultichainAddressList
              renderedInModal
              chains={multichainEntries}
              showInlineFeedback={false}
              onCopyAddress={handleCopyAddress}
            />
          </BottomSheetScrollView>
        </Modal>
      )}
    </Flex>
  )
}
