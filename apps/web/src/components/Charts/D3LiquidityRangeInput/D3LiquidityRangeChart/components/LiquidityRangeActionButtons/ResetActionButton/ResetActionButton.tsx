import { useTranslation } from 'react-i18next'
<<<<<<< HEAD
import { Button, Flex } from '@l.x/ui/src'
=======
import { Button, Flex } from 'ui/src'
>>>>>>> upstream/main
import { useChartPriceState } from '~/components/Charts/D3LiquidityRangeInput/D3LiquidityRangeChart/store/selectors/priceSelectors'
import { useLiquidityChartStoreActions } from '~/components/Charts/D3LiquidityRangeInput/D3LiquidityRangeChart/store/useLiquidityChartStore'

export function ResetActionButton() {
  const { t } = useTranslation()
  const { reset } = useLiquidityChartStoreActions()
  const { isFullRange } = useChartPriceState()

  return (
    <Flex>
      <Button isDisabled={isFullRange} size="xsmall" emphasis="tertiary" onPress={() => reset()}>
        {t('common.button.reset')}
      </Button>
    </Flex>
  )
}
