import { memo } from 'react'
import { Flex, useIsTouchDevice } from '@l.x/ui/src'
import { ContextMenuTriggerButton } from '@l.x/lx/src/components/menus/ContextMenuTriggerButton'
import { ContextMenuTriggerMode } from '@l.x/lx/src/components/menus/types'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
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
