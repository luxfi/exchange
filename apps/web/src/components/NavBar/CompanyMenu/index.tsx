<<<<<<< HEAD
import { brand } from '@l.x/config'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Flex, Popover, styled, Text, useIsTouchDevice, useMedia } from '@l.x/ui/src'
import { Hamburger } from '@l.x/ui/src/components/icons/Hamburger'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
=======
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { Flex, Popover, styled, Text, useMedia } from 'ui/src'
import { Hamburger } from 'ui/src/components/icons/Hamburger'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
>>>>>>> upstream/main
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

<<<<<<< HEAD
  // biome-ignore lint/correctness/useExhaustiveDependencies: +popoverRef
  const closeMenu = useCallback(() => {
    popoverRef.current?.close()
  }, [popoverRef])
  // biome-ignore lint/correctness/useExhaustiveDependencies: location dependency is sufficient for this effect
=======
  // oxlint-disable-next-line react/exhaustive-deps -- +popoverRef
  const closeMenu = useCallback(() => {
    popoverRef.current?.close()
  }, [popoverRef])
  // oxlint-disable-next-line react/exhaustive-deps -- location dependency is sufficient for this effect
>>>>>>> upstream/main
  useEffect(() => {
    // Immediately reset state to prevent flash during transitions
    setIsOpen(false)
    closeMenu()
  }, [location, closeMenu])

<<<<<<< HEAD
  const isTouchDevice = useIsTouchDevice()

=======
>>>>>>> upstream/main
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
<<<<<<< HEAD
              <Flex row alignItems="center" gap="$gap4" data-testid={TestID.NavLuxLogo}>
                <NavIcon />
                {isLargeScreen && (
                  <Text variant="subheading1" color="$accent1" userSelect="none">
                    {brand.name.replace(/\s*exchange\s*/i, '')}
=======
              <Flex row alignItems="center" gap="$gap4" data-testid={TestID.NavUniswapLogo}>
                <NavIcon />
                {isLargeScreen && (
                  <Text variant="subheading1" color="$accent1" userSelect="none">
                    Uniswap
>>>>>>> upstream/main
                  </Text>
                )}
              </Flex>
            </Link>
          </Trace>
<<<<<<< HEAD
          {(media.md || isTouchDevice) && <Hamburger size={22} color="$neutral2" cursor="pointer" ml="16px" />}
          {!media.md && !isTouchDevice && (
=======
          {media.md && <Hamburger size={22} color="$neutral2" cursor="pointer" ml="16px" />}
          {!media.md && (
>>>>>>> upstream/main
            <ArrowDownWrapper open={isOpen}>
              <ArrowChangeDown width="12px" height="12px" />
            </ArrowDownWrapper>
          )}
        </Flex>
      </Popover.Trigger>
      {isMobileDrawer ? <MobileMenuDrawer isOpen={isOpen} closeMenu={closeMenu} /> : <MenuDropdown close={closeMenu} />}
    </Popover>
  )
}
