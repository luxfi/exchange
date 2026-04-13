import type React from 'react'
import { Flex, Popover, Text, TouchableArea, useMedia } from 'ui/src'
import { AdaptiveWebPopoverContent } from 'ui/src/components/popover/AdaptiveWebPopoverContent'
import { Modal } from 'uniswap/src/components/modals/Modal'
import { ModalName } from 'uniswap/src/features/telemetry/constants'

const MULTICHAIN_SNAP_POINTS = ['65%', '100%']

export const tokenPillStyles = {
  row: true,
  alignItems: 'center' as const,
  gap: '$gap8' as const,
  backgroundColor: '$surface1' as const,
  borderRadius: '$rounded12' as const,
  borderWidth: 1,
  borderColor: '$surface3' as const,
  px: '$padding12' as const,
  py: '$padding8' as const,
  width: 'max-content',
}

export function TokenInfoButton({
  icon,
  name,
  onPress,
  testID,
}: {
  icon: JSX.Element
  name: string
  onPress?: () => void
  testID?: string
}) {
  return (
    <TouchableArea {...tokenPillStyles} testID={testID} onPress={onPress}>
      {icon}
      <Text variant="buttonLabel3" color="$neutral1">
        {name}
      </Text>
    </TouchableArea>
  )
}

export function MultichainPillDropdown({
  testID,
  icon,
  name,
  isOpen,
  onOpenChange,
  modalName,
  popoverContentProps,
  children,
}: {
  testID: string
  icon: JSX.Element
  name: string
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  modalName: (typeof ModalName)[keyof typeof ModalName]
  popoverContentProps: Record<string, unknown>
  children: React.ReactNode
}) {
  const media = useMedia()

  if (media.md) {
    return (
      <>
        <TokenInfoButton testID={testID} onPress={() => onOpenChange(true)} icon={icon} name={name} />
        {isOpen && (
          <Modal
            fullScreen
            name={modalName}
            snapPoints={MULTICHAIN_SNAP_POINTS}
            padding="$none"
            onClose={() => onOpenChange(false)}
          >
            <Flex grow maxHeight="100%" overflow="hidden" px="$spacing24">
              {children}
            </Flex>
          </Modal>
        )}
      </>
    )
  }

  return (
    <Popover hoverable placement="top-start" offset={8} stayInFrame allowFlip onOpenChange={onOpenChange}>
      <Popover.Trigger>
        <TokenInfoButton testID={testID} icon={icon} name={name} />
      </Popover.Trigger>
      <AdaptiveWebPopoverContent isOpen={isOpen} {...popoverContentProps}>
        {children}
      </AdaptiveWebPopoverContent>
    </Popover>
  )
}
