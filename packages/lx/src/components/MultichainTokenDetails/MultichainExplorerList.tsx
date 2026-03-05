import { useCallback } from 'react'
import { Flex, Text } from 'ui/src'
import { ExternalLink } from 'ui/src/components/icons/ExternalLink'
import { iconSizes } from 'ui/src/theme'
import { MultichainOptionRow } from 'lx/src/components/MultichainTokenDetails/MultichainOptionRow'
import { MultichainScrollableList } from 'lx/src/components/MultichainTokenDetails/MultichainScrollableList'
import type { MultichainTokenEntry } from 'lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { getChainInfo } from 'lx/src/features/chains/chainInfo'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { ExplorerDataType, getExplorerLink } from 'lx/src/utils/linking'

interface MultichainExplorerListProps {
  chains: MultichainTokenEntry[]
  isNativeToken?: boolean
  onExplorerPress?: (url: string) => void
  /** Pass true when rendered inside a Modal to enable BottomSheetScrollView on native. */
  renderedInModal?: boolean
}

/**
 * Scrollable list of per-chain block explorer links.
 * Each row shows chain logo, chain name, and a linked explorer name.
 */
export function MultichainExplorerList({
  chains,
  isNativeToken = false,
  onExplorerPress,
  renderedInModal,
}: MultichainExplorerListProps): JSX.Element {
  const renderExplorerRow = useCallback(
    (entry: MultichainTokenEntry) => {
      const explorerName = getChainInfo(entry.chainId).explorer.name
      const explorerUrl = getExplorerLink({
        chainId: entry.chainId,
        data: entry.address,
        type: isNativeToken ? ExplorerDataType.NATIVE : ExplorerDataType.TOKEN,
      })

      return (
        <MultichainOptionRow
          chainId={entry.chainId}
          href={explorerUrl}
          rel="noopener noreferrer"
          tag="a"
          target="_blank"
          testID={TestID.MultichainExplorerLink}
          rightContent={
            <Flex row alignItems="center" gap="$spacing8">
              <Text color="$neutral2" variant="buttonLabel3">
                {explorerName}
              </Text>
              <ExternalLink color="$neutral2" size={iconSizes.icon16} />
            </Flex>
          }
          onPress={onExplorerPress ? (): void => onExplorerPress(explorerUrl) : undefined}
        />
      )
    },
    [isNativeToken, onExplorerPress],
  )

  return <MultichainScrollableList data={chains} renderItem={renderExplorerRow} renderedInModal={renderedInModal} />
}
