import { FeatureFlags, useFeatureFlag } from '@l.x/gating'
import { useTranslation } from 'react-i18next'
import { Flex, useIsTouchDevice, useMedia } from 'ui/src'
import { UniverseChainId } from 'uniswap/src/features/chains/types'
import { fromGraphQLChain, getChainLabel } from 'uniswap/src/features/chains/utils'
import { InterfacePageName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { useCurrencyInfo } from 'uniswap/src/features/tokens/useCurrencyInfo'
import { buildCurrencyId } from 'uniswap/src/utils/currencyId'
import { DetailsHeaderContainer } from '~/components/Explore/stickyHeader/DetailsHeaderContainer'
import { MobileBottomBar, TDPActionTabs } from '~/components/NavBar/MobileBottomBar'
import { ScrollDirection, useScroll } from '~/hooks/useScroll'
import { ActivitySection } from '~/pages/TokenDetails/components/activity/ActivitySection'
import { BalanceSummary, PageChainBalanceSummary } from '~/pages/TokenDetails/components/balances/BalanceSummary'
import { ChartSection } from '~/pages/TokenDetails/components/chart/ChartSection'
import { TDPBreadcrumb } from '~/pages/TokenDetails/components/header/TDPBreadcrumb'
import { TokenDetailsHeader } from '~/pages/TokenDetails/components/header/TokenDetailsHeader'
import { BridgedAssetSection } from '~/pages/TokenDetails/components/info/BridgedAssetSection'
import { StatsSection } from '~/pages/TokenDetails/components/info/StatsSection'
import { TokenDescription } from '~/pages/TokenDetails/components/info/TokenDescription'

          <TokenPerformance />
        </RightPanel>

        <MobileBottomBar hide={isTouchDevice && scrollDirection === ScrollDirection.DOWN}>
          <Flex data-testid="tdp-mobile-bottom-bar">
            <TDPActionTabs />
          </Flex>
        </MobileBottomBar>
      </TokenDetailsLayout>
    </Trace>
  )
}
