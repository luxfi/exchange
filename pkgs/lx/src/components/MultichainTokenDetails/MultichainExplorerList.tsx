import { useCallback } from 'react'
import { Flex, Text } from '@l.x/ui/src'
import { ExternalLink } from '@l.x/ui/src/components/icons/ExternalLink'
import { iconSizes } from '@l.x/ui/src/theme'
import { MultichainOptionRow } from '@l.x/lx/src/components/MultichainTokenDetails/MultichainOptionRow'
import { MultichainScrollableList } from '@l.x/lx/src/components/MultichainTokenDetails/MultichainScrollableList'
import type { MultichainTokenEntry } from '@l.x/lx/src/components/MultichainTokenDetails/useOrderedMultichainEntries'
import { getChainInfo } from '@l.x/lx/src/features/chains/chainInfo'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { ExplorerDataType, getExplorerLink } from '@l.x/lx/src/utils/linking'

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
