import { memo } from 'react'
import { Flex } from 'ui/src'
import { zIndexes } from 'ui/src/theme'
import Navbar from '~/components/NavBar/index'
import {
  MobileAppPromoBanner,
  useMobileAppPromoBannerEligible,
} from '~/components/TopLevelBanners/MobileAppPromoBanner'
import { UkBanner, useRenderUkBanner } from '~/components/TopLevelBanners/UkBanner'
import { useRenderLuxWrapped2025Banner } from '~/components/TopLevelBanners/LuxWrapped2025Banner'
import { PageType, useIsPage } from '~/hooks/useIsPage'
import { useScroll } from '~/hooks/useScroll'
import { GRID_AREAS } from '~/pages/App/utils/shared'

export const Header = memo(function Header() {
  const { isScrolledDown } = useScroll()
  const isPortfolioPage = useIsPage(PageType.PORTFOLIO)
  const isExplorePage = useIsPage(PageType.EXPLORE)
  const isHeaderTransparent = !isScrolledDown && !isPortfolioPage && !isExplorePage
  const navHasBottomBorder = isScrolledDown
  const renderUkBanner = useRenderUkBanner()
  const extensionEligible = useMobileAppPromoBannerEligible()
  const renderLuxWrapped2025Banner = useRenderLuxWrapped2025Banner()

  return (
    <Flex
      id="AppHeader"
      $platform-web={{
        gridArea: GRID_AREAS.HEADER,
        position: 'sticky',
      }}
      className="webkitSticky"
      width="100vw"
      top={0}
      zIndex={zIndexes.header}
      pointerEvents="none"
    >
      <style>
        {`
          .webkitSticky {
            position: -webkit-sticky;
          }
        `}
      </style>
      <Flex position="relative" zIndex={zIndexes.sticky} pointerEvents="auto">
        {extensionEligible && <MobileAppPromoBanner />}
        {renderUkBanner && <UkBanner />}
        {renderLuxWrapped2025Banner}
      </Flex>
      <Flex
        width="100%"
        backgroundColor={isHeaderTransparent ? 'transparent' : 'rgba(0, 0, 0, 0.95)'}
        borderBottomColor={navHasBottomBorder ? 'rgba(255, 255, 255, 0.1)' : 'transparent'}
        borderBottomWidth={1}
        pointerEvents="auto"
        transition="background-color 0.2s ease-in-out, border-bottom-color 0.2s ease-in-out"
      >
        <Navbar />
      </Flex>
    </Flex>
  )
})
