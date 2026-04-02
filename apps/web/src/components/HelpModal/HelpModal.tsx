import { useState } from 'react'
import { Flex, Popover, Theme, TouchableArea, useMedia, useSporeColors } from '@luxfi/ui/src'
import { QuestionInCircleFilled } from '@luxfi/ui/src/components/icons/QuestionInCircleFilled'
import { zIndexes } from '@luxfi/ui/src/theme'
import { useSelectedColorScheme } from 'lx/src/features/appearance/hooks'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { HelpContent } from '~/components/HelpModal/HelpContent'
import { ClickableGuiStyle } from '~/theme/components/styles'

export function HelpModal({ showOnXL = false }: { showOnXL?: boolean }) {
  const [isOpen, setIsOpen] = useState(false)
  const media = useMedia()
  const colors = useSporeColors()
  const colorScheme = useSelectedColorScheme()
  const isTabletWidth = media.xl && !media.sm

  return (
    <Flex
      $platform-web={{
        position: 'fixed',
      }}
      bottom="$spacing20"
      left="$spacing20"
      $xl={
        showOnXL
          ? {
              position: 'relative',
              bottom: 0,
              left: 0,
            }
          : {
              display: 'none',
            }
      }
      zIndex="$modal"
    >
      <Popover
        placement={isTabletWidth ? 'bottom' : 'top'}
        stayInFrame
        allowFlip
        open={isOpen}
        onOpenChange={(open) => setIsOpen(open)}
      >
        <Popover.Trigger>
          <TouchableArea hoverable {...ClickableGuiStyle}>
            <QuestionInCircleFilled size={20} color={colors.neutral1.get()} data-testid={TestID.HelpIcon} />
          </TouchableArea>
        </Popover.Trigger>
        <Popover.Content
          zIndex={zIndexes.popover}
          enterStyle={{ scale: 0.95, opacity: 0 }}
          exitStyle={{ scale: 0.95, opacity: 0 }}
          animation="quick"
          ml="$spacing12"
          backgroundColor="$transparent"
          $xl={{ ml: 0, mt: '$spacing20' }}
          $sm={{ ml: '$spacing12' }}
        >
          <Theme name={colorScheme}>
            <HelpContent onClose={() => setIsOpen(false)} />
          </Theme>
        </Popover.Content>
      </Popover>
    </Flex>
  )
}
