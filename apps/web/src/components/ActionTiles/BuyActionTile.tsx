import { useTranslation } from 'react-i18next'
import { Bank } from '@luxfi/ui/src/components/icons/Bank'
import { FlexProps } from '@luxfi/ui/src/components/layout/Flex'
import { useLuxContext } from '@luxexchange/lx/src/contexts/LuxContext'
import { ElementName } from '@luxexchange/lx/src/features/telemetry/constants'
import Trace from '@luxexchange/lx/src/features/telemetry/Trace'
import { TestID } from '@luxexchange/lx/src/test/fixtures/testIDs'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
import { ActionTileWithIconAnimation } from '~/components/ActionTiles/ActionTileWithIconAnimation'

export function BuyActionTile({ padding = '$spacing12' }: { padding?: FlexProps['p'] }) {
  const { t } = useTranslation()
  const { navigateToFiatOnRamp } = useLuxContext()

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
