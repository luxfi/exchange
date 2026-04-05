import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Bank } from '@l.x/ui/src/components/icons/Bank'
import { FlexProps } from '@l.x/ui/src/components/layout/Flex'
import { useLuxContext } from '@l.x/lx/src/contexts/LuxContext'
import { ElementName } from '@l.x/lx/src/features/telemetry/constants'
import Trace from '@l.x/lx/src/features/telemetry/Trace'
import { TestID } from '@l.x/lx/src/test/fixtures/testIDs'
import { useEvent } from '@l.x/utils/src/react/hooks'
=======
import { Bank } from 'ui/src/components/icons/Bank'
import { FlexProps } from 'ui/src/components/layout/Flex'
import { useUniswapContext } from 'uniswap/src/contexts/UniswapContext'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { useEvent } from 'utilities/src/react/hooks'
>>>>>>> upstream/main
import { ActionTileWithIconAnimation } from '~/components/ActionTiles/ActionTileWithIconAnimation'

export function BuyActionTile({ padding = '$spacing12' }: { padding?: FlexProps['p'] }) {
  const { t } = useTranslation()
<<<<<<< HEAD
  const { navigateToFiatOnRamp } = useLuxContext()
=======
  const { navigateToFiatOnRamp } = useUniswapContext()
>>>>>>> upstream/main

  const onPressBuy = useEvent(() => {
    navigateToFiatOnRamp({})
  })

  return (
    <Trace logPress element={ElementName.PortfolioActionBuy}>
      <ActionTileWithIconAnimation
        dataTestId={TestID.PortfolioActionTileBuy}
        Icon={Bank}
        name={t('common.button.buy')}
        onClick={onPressBuy}
        padding={padding}
      />
    </Trace>
  )
}
