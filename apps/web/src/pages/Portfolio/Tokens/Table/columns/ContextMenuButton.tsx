import { memo } from 'react'
import { Flex, useIsTouchDevice } from '@luxfi/ui/src'
import { ContextMenuTriggerButton } from 'lx/src/components/menus/ContextMenuTriggerButton'
import { ContextMenuTriggerMode } from 'lx/src/components/menus/types'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { TokenData } from '~/pages/Portfolio/Tokens/hooks/useTransformTokenTableData'
import { TokensContextMenuWrapper } from '~/pages/Portfolio/Tokens/Table/TokensContextMenuWrapper'

interface ContextMenuButtonProps {
  tokenData: TokenData
}

export const ContextMenuButton = memo(function ContextMenuButton({ tokenData }: ContextMenuButtonProps) {
  const isTouchDevice = useIsTouchDevice()

  return (
    <TokensContextMenuWrapper tokenData={tokenData} triggerMode={ContextMenuTriggerMode.Primary}>
      <Flex
        aria-label="View transaction details"
        testID={TestID.TokenTableRowContextMenuButton}
        opacity={isTouchDevice ? 1 : 0}
        transition="opacity 0.2s ease"
        centered
        $group-hover={{ opacity: 1 }}
        $group-focus={{ opacity: 1 }}
        mr="$spacing8"
        ml="$spacing4"
      >
        <ContextMenuTriggerButton />
      </Flex>
    </TokensContextMenuWrapper>
  )
})
