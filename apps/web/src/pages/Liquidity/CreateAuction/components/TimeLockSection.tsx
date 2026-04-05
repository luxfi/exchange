import { useTranslation } from 'react-i18next'
import { Flex, Switch, Text } from 'ui/src'
import { DatePickerCard } from '~/pages/Liquidity/CreateAuction/components/DatePickerCard'
import { StepperCard } from '~/pages/Liquidity/CreateAuction/components/StepperCard'

export const MIN_LOCK_DURATION_DAYS = 1

export function TimeLockSection({
  enabled,
  onEnabledChange,
  lockDurationDays,
  onLockDurationDecrement,
  onLockDurationIncrement,
  unlockDate,
  onUnlockDateChange,
  minUnlockDate,
}: {
  enabled: boolean
  onEnabledChange: (enabled: boolean) => void
  lockDurationDays: number
  onLockDurationDecrement: () => void
  onLockDurationIncrement: () => void
  unlockDate: Date | undefined
  onUnlockDateChange: (date: Date | undefined) => void
  minUnlockDate: Date
}) {
  const { t } = useTranslation()

  return (
    <Flex gap="$spacing12">
      <Flex row alignItems="flex-start" justifyContent="space-between" gap="$spacing12">
        <Flex flex={1}>
          <Text variant="subheading1" color="$neutral1">
            {t('toucan.createAuction.step.customizePool.timeLock')}
          </Text>
          <Text variant="body3" color="$neutral2">
            {t('toucan.createAuction.step.customizePool.timeLock.description')}
          </Text>
        </Flex>
        <Switch checked={enabled} variant="default" onCheckedChange={onEnabledChange} />
      </Flex>
      {enabled && (
        <Flex row gap="$spacing12">
          <StepperCard
            label={t('toucan.createAuction.step.customizePool.timeLock.lockDuration')}
            value={t('common.day.count', { count: lockDurationDays })}
            onDecrement={onLockDurationDecrement}
            onIncrement={onLockDurationIncrement}
          />
          <DatePickerCard
            label={t('toucan.createAuction.step.customizePool.timeLock.unlockDate')}
            date={unlockDate}
            minDate={minUnlockDate}
            placeholder={t('toucan.createAuction.dateTimePlaceholder')}
            onDateChange={onUnlockDateChange}
            ariaLabel={t('toucan.createAuction.step.customizePool.timeLock.unlockDate')}
            type="date"
          />
        </Flex>
      )}
    </Flex>
  )
}
