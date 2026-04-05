import { ReactNode } from 'react'
<<<<<<< HEAD
import { Flex, styled, Text } from '@l.x/ui/src'
import { ChevronLeft } from '@l.x/ui/src/components/icons/ChevronLeft'
=======
import { Flex, styled, Text } from 'ui/src'
import { ChevronLeft } from 'ui/src/components/icons/ChevronLeft'
>>>>>>> upstream/main

const Header = styled(Flex, {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '$gap8',
  width: '100%',
  py: '$padding8',
  variants: {
    clickable: {
      true: { cursor: 'pointer' },
    },
  },
})

interface TPreferencesHeaderProps {
  children: ReactNode
  onExitMenu?: () => void
}

export function PreferencesHeader({ children, onExitMenu }: TPreferencesHeaderProps) {
  return (
    <Header clickable={!!onExitMenu} onPress={() => onExitMenu?.()} group>
      {onExitMenu && <ChevronLeft size="$icon.24" color="$neutral1" $group-hover={{ opacity: 0.6 }} />}
      <Text variant="subheading1" color="$neutral1" textAlign="left" width="100%">
        {children}
      </Text>
    </Header>
  )
}
