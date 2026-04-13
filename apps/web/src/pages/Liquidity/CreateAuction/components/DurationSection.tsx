import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'ui/src'
import { DatePickerCard } from '~/pages/Liquidity/CreateAuction/components/DatePickerCard'
import { StepperCard } from '~/pages/Liquidity/CreateAuction/components/StepperCard'

const MIN_START_TIME_OFFSET_MINUTES = 5

export function getMinStartTime(): Date {
  const min = new Date()
  min.setMinutes(min.getMinutes() + MIN_START_TIME_OFFSET_MINUTES)
  return min
}

export function DurationSection({
  maxDurationDays,
  startTime,
  onStartTimeChange,
  onDecrement,
  onIncrement,
}: {
  maxDurationDays: number
  startTime: Date | undefined
  onStartTimeChange: (date: Date | undefined) => void
  onDecrement: () => void
  onIncrement: () => void
}) {
  const { t } = useTranslation()
  const minStartTime = getMinStartTime()
  const isStartTimeInvalid = startTime !== undefined && startTime.getTime() < minStartTime.getTime()

  return (
    <Flex gap="$spacing12">
      <Flex gap="$spacing4">
        <Text variant="subheading1" color="$neutral1">
          {t('toucan.createAuction.step.configureAuction.duration')}
        </Text>
        <Text variant="body3" color="$neutral2">
          {t('toucan.createAuction.step.configureAuction.duration.description')}
        </Text>
      </Flex>
      <Flex row gap="$spacing12">
        <DatePickerCard
          label={t('toucan.createAuction.step.configureAuction.duration.startTime')}
          date={startTime}
          minDate={minStartTime}
          placeholder={t('toucan.createAuction.dateTimePlaceholder')}
          onDateChange={onStartTimeChange}
          ariaLabel={t('toucan.createAuction.step.configureAuction.duration.startTime')}
        />
        <StepperCard
          label={t('toucan.createAuction.step.configureAuction.duration.maxDuration')}
          value={t('common.day.count', { count: maxDurationDays })}
          onDecrement={onDecrement}
          onIncrement={onIncrement}
        />
      </Flex>
      {isStartTimeInvalid && (
        <Text variant="body4" color="$statusCritical" textAlign="center">
          {t('toucan.createAuction.step.configureAuction.duration.startTime.error')}
        </Text>
      )}
    </Flex>
  )
}
