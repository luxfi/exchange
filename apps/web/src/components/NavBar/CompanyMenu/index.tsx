import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Flex, Popover, styled, Text, useMedia } from 'ui/src'
import { Hamburger } from 'ui/src/components/icons/Hamburger'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { ArrowChangeDown } from '~/components/Icons/ArrowChangeDown'
import { NavIcon } from '~/components/Logo/NavIcon'
import { MenuDropdown } from '~/components/NavBar/CompanyMenu/MenuDropdown'
import { MobileMenuDrawer } from '~/components/NavBar/CompanyMenu/MobileMenuDrawer'
import { useIsMobileDrawer } from '~/components/NavBar/ScreenSizes'

const ArrowDownWrapper = styled(Text, {
  color: '$neutral2',
  '$group-hover': { color: '$neutral1' },
  variants: {
    open: {
      true: { color: '$neutral1' },
    },
  },
})

export function CompanyMenu() {
  const popoverRef = useRef<Popover>(null)
  const media = useMedia()
  const isMobileDrawer = useIsMobileDrawer()
  const isLargeScreen = !media.xxl
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // oxlint-disable-next-line react/exhaustive-deps -- +popoverRef
  const closeMenu = useCallback(() => {
    popoverRef.current?.close()
  }, [popoverRef])
  // oxlint-disable-next-line react/exhaustive-deps -- location dependency is sufficient for this effect
  useEffect(() => {
    // Immediately reset state to prevent flash during transitions
    setIsOpen(false)
    closeMenu()
  }, [location, closeMenu])

  return (
    <Popover ref={popoverRef} placement="bottom" hoverable={!media.xl} stayInFrame allowFlip onOpenChange={setIsOpen}>
      <Popover.Trigger data-testid={TestID.NavCompanyMenu}>
        <Flex
          row
          alignItems="center"
          gap="$gap4"
          p="$spacing8"
          cursor="pointer"
          group
          $platform-web={{ containerType: 'normal' }}
        >
          <Trace logPress element={ElementName.NavbarCompanyMenuLogo}>
            <Link to="/?intro=true" style={{ textDecoration: 'none' }}>
              <Flex row alignItems="center" gap="$gap4" data-testid={TestID.NavLuxLogo}>
                <NavIcon />
                {isLargeScreen && (
                  <Text variant="subheading1" color="$accent1" userSelect="none">
                    {brand.name.replace(/\s*exchange\s*/i, '')}
