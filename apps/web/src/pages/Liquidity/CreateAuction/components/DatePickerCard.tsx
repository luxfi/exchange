import type { CSSProperties } from 'react'
import { useCallback, useRef } from 'react'
import { Flex, Text } from 'ui/src'
import {
  FORMAT_DATE_MEDIUM,
  FORMAT_DATE_TIME_MEDIUM,
  useFormattedDate,
  useFormattedDateTime,
  useLocalizedDayjs,
} from 'uniswap/src/features/language/localizedDayjs'

const DATETIME_INPUT_CLASS = 'DatePickerCard-datetimeInput'

const DATETIME_INPUT_CSS = `
  .${DATETIME_INPUT_CLASS} {
    caret-color: transparent;
    outline: none;
  }
  .${DATETIME_INPUT_CLASS}::-webkit-calendar-picker-indicator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
    opacity: 0;
  }
  .${DATETIME_INPUT_CLASS}::-webkit-datetime-edit {
    display: none;
  }
`

const DATETIME_INPUT_OVERLAY_STYLE: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  background: 'transparent',
  border: 'none',
  color: 'transparent',
  cursor: 'pointer',
  padding: 0,
  margin: 0,
  zIndex: 1,
}

const pad = (n: number): string => String(n).padStart(2, '0')

/** Converts a Date to the string format expected by an <input type="date"> or <input type="datetime-local">. */
function toInputValue(date: Date | undefined, type: 'date' | 'datetime-local'): string {
  if (!date) {
    return ''
  }
  const datePart = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
  if (type === 'date') {
    return datePart
  }
  return `${datePart}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Parses the string value from an <input type="date"> or <input type="datetime-local">.
 *
 * For type="date", the value is "YYYY-MM-DD". new Date("YYYY-MM-DD") parses as UTC midnight,
 * which shifts the date in non-UTC timezones. We instead construct a local midnight Date to
 * ensure the selected calendar day is preserved regardless of the user's timezone.
 */
function parseInputValue(value: string, type: 'date' | 'datetime-local'): Date {
  if (type === 'date') {
    const [year, month, day] = value.split('-').map(Number)
    return new Date(year!, month! - 1, day!)
  }
  return new Date(value)
}

export function DatePickerCard({
  label,
  date,
  minDate,
  placeholder,
  onDateChange,
  ariaLabel,
  type = 'datetime-local',
}: {
  label: string
  date: Date | undefined
  minDate?: Date
  placeholder: string
  onDateChange: (date: Date | undefined) => void
  ariaLabel: string
  /** Controls picker granularity. Use "date" for day-level values, "datetime-local" for exact timestamps. Defaults to "datetime-local". */
  type?: 'date' | 'datetime-local'
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const dayjsInstance = useLocalizedDayjs()
  const formattedDate = useFormattedDate(dayjsInstance(date), FORMAT_DATE_MEDIUM)
  const formattedDateTime = useFormattedDateTime(dayjsInstance(date), FORMAT_DATE_TIME_MEDIUM)
  const displayValue = type === 'date' ? formattedDate : formattedDateTime

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      if (!value) {
        onDateChange(undefined)
        return
      }
      const selected = parseInputValue(value, type)
      const clamped =
        minDate && selected.getTime() <= minDate.getTime() ? new Date(minDate.getTime() + 60000) : selected
      onDateChange(clamped)
      // Blur to close the native picker once a value is selected.
      inputRef.current?.blur()
    },
    [onDateChange, minDate, type],
  )

  return (
    <Flex
      flex={1}
      flexBasis={0}
      position="relative"
      flexDirection="column"
      backgroundColor="$surface2"
      borderRadius="$rounded16"
      p="$spacing16"
      gap="$spacing4"
      minHeight={72}
    >
      <Text variant="body3" color="$neutral2">
        {label}
      </Text>
      <Flex position="relative" minHeight={28}>
        <style>{DATETIME_INPUT_CSS}</style>
        <Text variant="subheading1" color={date ? '$neutral1' : '$neutral3'} pointerEvents="none">
          {date ? displayValue : placeholder}
        </Text>
        <input
          ref={inputRef}
          type={type}
          className={DATETIME_INPUT_CLASS}
          value={toInputValue(date, type)}
          min={toInputValue(minDate, type)}
          onChange={handleChange}
          style={DATETIME_INPUT_OVERLAY_STYLE}
          aria-label={ariaLabel}
          title={placeholder}
        />
      </Flex>
    </Flex>
  )
}
