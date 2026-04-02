import { styled } from '@luxfi/ui/src'
import { Flex } from '@luxfi/ui/src/components/layout'

export const NavDropdownDefaultWrapper = styled(Flex, {
  width: '100%',
  alignItems: 'center',
  gap: '$spacing2',

  $sm: {
    width: '100%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
})

export const NavDropdownTabWrapper = styled(Flex, {
  minWidth: 180,
  p: '$spacing4',
  gap: '$gap4',
  position: 'relative',
})
