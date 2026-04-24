import { useTranslation } from 'react-i18next'
import { Flex } from '@l.x/ui/src'
import { Swap } from '@l.x/ui/src/components/icons/Swap' // TODO: update to LP icon
import { StepRowProps, StepRowSkeleton } from '@l.x/lx/src/components/ConfirmSwapModal/steps/StepRowSkeleton'
import { StepStatus } from '@l.x/lx/src/components/ConfirmSwapModal/types'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { CollectFeesSteps } from '@l.x/lx/src/features/transactions/liquidity/steps/collectFeesSteps'
import { DecreasePositionTransactionStep } from '@l.x/lx/src/features/transactions/liquidity/steps/decreasePosition'
import {
  IncreasePositionTransactionStep,
  IncreasePositionTransactionStepAsync,
} from '@l.x/lx/src/features/transactions/liquidity/steps/increasePosition'
import {
  MigratePositionTransactionStep,
  MigratePositionTransactionStepAsync,
} from '@l.x/lx/src/features/transactions/liquidity/steps/migrate'

const LPIcon = (): JSX.Element => (
  <Flex centered width="$spacing24" height="$spacing24" borderRadius="$roundedFull" backgroundColor="$DEP_blue400">
    <Swap color="$neutral1" size="$icon.12" />
  </Flex>
)

type LPSteps =
  | IncreasePositionTransactionStep
  | IncreasePositionTransactionStepAsync
  | DecreasePositionTransactionStep
  | MigratePositionTransactionStep
  | MigratePositionTransactionStepAsync
  | CollectFeesSteps
export function LPTransactionStepRow({
  status,
  currentStepIndex,
  totalStepsCount,
}: StepRowProps<LPSteps>): JSX.Element {
  const { t } = useTranslation()

  const title = {
    [StepStatus.Preview]: t('common.confirmWallet'),
    [StepStatus.Failed]: t('common.failed'),
    [StepStatus.Replaced]: t('common.failed'),
    [StepStatus.Active]: t('common.confirmWallet'),
    [StepStatus.InProgress]: t('common.transactionPending'),
    [StepStatus.Complete]: t('common.confirmWallet'),
  }[status]

  return (
    <StepRowSkeleton
      title={title}
      icon={<LPIcon />}
      learnMore={{
        url: lxUrls.helpArticleUrls.providingLiquidityVersions,
        text: t('common.learnMoreLiquidity'),
      }}
      status={status}
      currentStepIndex={currentStepIndex}
      totalStepsCount={totalStepsCount}
    />
  )
}
