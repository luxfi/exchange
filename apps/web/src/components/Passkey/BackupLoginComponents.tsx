import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, TouchableArea } from 'ui/src'
import { BackArrow } from 'ui/src/components/icons/BackArrow'
import { CheckCircleFilled } from 'ui/src/components/icons/CheckCircleFilled'
import { EnvelopeLock } from 'ui/src/components/icons/EnvelopeLock'
import { GoogleLogo } from 'ui/src/components/icons/GoogleLogo'
import { X } from 'ui/src/components/icons/X'
import { useSporeColors } from 'ui/src/hooks/useSporeColors'
import { SpinningLoader } from 'ui/src/loading/SpinningLoader'
import { ElementName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { TestID } from 'uniswap/src/test/fixtures/testIDs'
import { AppleLogo } from '~/components/Icons/AppleLogo'

export function useDigitInput({ length, onComplete }: { length: number; onComplete?: (code: string) => void }) {
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''))
  const refs = useRef<(HTMLInputElement | null)[]>([])

  const handleChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) {
        return
      }

      const char = value.slice(-1)
      const newDigits = [...digits]
      newDigits[index] = char

      if (!char) {
        setDigits(newDigits)
        return
      }

      setDigits(newDigits)

      if (index < length - 1) {
        refs.current[index + 1]?.focus()
      }

      const code = newDigits.join('')
      if (code.length === length && newDigits.every(Boolean)) {
        onComplete?.(code)
      }
    },
    [digits, length, onComplete],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !digits[index] && index > 0) {
        refs.current[index - 1]?.focus()
      }
    },
    [digits],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      if (!pasted) {
        return
      }
      const newDigits = [...digits]
      for (let i = 0; i < pasted.length; i++) {
        const char = pasted[i]
        if (char) {
          newDigits[i] = char
        }
      }
      setDigits(newDigits)

      if (pasted.length === length) {
        onComplete?.(pasted)
      } else {
        refs.current[pasted.length]?.focus()
      }
    },
    [digits, length, onComplete],
  )

  const reset = useCallback(() => {
    setDigits(Array(length).fill(''))
    refs.current[0]?.focus()
  }, [length])

  return { digits, refs, handleChange, handleKeyDown, handlePaste, reset }
}

export type DigitInputState = ReturnType<typeof useDigitInput>

export function DigitInputRow({
  digits,
  refs,
  onChange,
  onKeyDown,
  onPaste,
  inputType = 'text',
  autoFocus = false,
  disabled = false,
}: {
  digits: string[]
  refs: React.RefObject<(HTMLInputElement | null)[]>
  onChange: (index: number, value: string) => void
  onKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void
  onPaste: (e: React.ClipboardEvent) => void
  inputType?: string
  autoFocus?: boolean
  disabled?: boolean
}) {
  return (
    <Flex row gap="$gap8" justifyContent="center" alignSelf="stretch">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            refs.current[index] = el
          }}
          type={inputType}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(e) => onChange(index, e.target.value)}
          onKeyDown={(e) => onKeyDown(index, e)}
          onPaste={index === 0 ? onPaste : undefined}
          autoFocus={autoFocus && index === 0}
          style={{
            flex: 1,
            minWidth: 0,
            height: 60,
            textAlign: 'center' as const,
            fontSize: 20,
            fontWeight: 500,
            border: '1px solid var(--surface3)',
            borderRadius: 16,
            background: 'var(--surface2)',
            color: 'var(--neutral1)',
            outline: 'none',
          }}
          onFocus={(e) => {
            e.currentTarget.style.border = '1.5px solid var(--neutral1)'
          }}
          onBlur={(e) => {
            e.currentTarget.style.border = '1px solid var(--surface3)'
          }}
        />
      ))}
    </Flex>
  )
}

export function IconBox({ children, background }: { children: React.ReactNode; background?: string }) {
  return (
    <Flex
      p="$spacing12"
      backgroundColor={background ?? '$surface3'}
      borderRadius="$rounded12"
      alignItems="center"
      justifyContent="center"
    >
      {children}
    </Flex>
  )
}

export function StepHeader({ onBack, onClose }: { onBack: () => void; onClose: () => void }) {
  return (
    <Flex row width="100%" justifyContent="space-between" alignItems="center">
      <TouchableArea variant="unstyled" onPress={onBack} testID={TestID.StepHeaderBack}>
        <BackArrow size="$icon.20" color="$neutral2" />
      </TouchableArea>
      <TouchableArea variant="unstyled" onPress={onClose} testID={TestID.StepHeaderClose}>
        <X size="$icon.20" color="$neutral2" />
      </TouchableArea>
    </Flex>
  )
}

function ProviderIcon({ provider, size }: { provider: 'google' | 'apple' | null; size: number }) {
  const colors = useSporeColors()
  if (provider === 'google') {
    return <GoogleLogo size={size} color="$neutral1" />
  }
  if (provider === 'apple') {
    return <AppleLogo height={size} width={size} fill={colors.neutral1.val} />
  }
  return <EnvelopeLock size={size} color="$neutral1" />
}

function getProviderLabel(provider: 'google' | 'apple' | null, t: ReturnType<typeof useTranslation>['t']): string {
  if (provider === 'google') {
    return t('account.passkey.backupLogin.add.google')
  }
  if (provider === 'apple') {
    return t('account.passkey.backupLogin.add.apple')
  }
  return t('account.passkey.backupLogin.add.email')
}

const SIZE_CONFIG = {
  sm: {
    box: 32,
    icon: 16,
    radius: '$rounded8',
    gap: '$spacing2',
    variant: 'body3',
    color: '$neutral2',
    check: '$icon.20',
  },
  lg: {
    box: 40,
    icon: 20,
    radius: '$rounded12',
    gap: '$gap4',
    variant: 'body2',
    color: '$neutral1',
    check: '$icon.24',
  },
} as const

export function BackupMethodSummary({
  provider,
  email,
  size,
}: {
  provider: 'google' | 'apple' | null
  email?: string
  size: 'sm' | 'lg'
}) {
  const { t } = useTranslation()
  const config = SIZE_CONFIG[size]
  return (
    <Flex row gap="$gap12" alignItems="center">
      <Flex
        height={config.box}
        width={config.box}
        backgroundColor="$surface2"
        borderRadius={config.radius}
        alignItems="center"
        justifyContent="center"
      >
        <ProviderIcon provider={provider} size={config.icon} />
      </Flex>
      <Flex flex={1} gap={config.gap}>
        <Text variant={config.variant} color={config.color}>
          {getProviderLabel(provider, t)}
        </Text>
        <Text variant="body3" color="$neutral2" numberOfLines={1}>
          {email}
        </Text>
      </Flex>
      <CheckCircleFilled size={config.check} color="$statusSuccess" />
    </Flex>
  )
}

export function OptionRow({
  icon,
  label,
  onPress,
  element,
  loading,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  onPress?: () => void
  element: ElementName
  loading?: boolean
  disabled?: boolean
}) {
  const isDisabled = !onPress || disabled
  return (
    <Trace logPress element={element}>
      <TouchableArea onPress={onPress} width="100%" disabled={isDisabled}>
        <Flex
          row
          gap="$gap12"
          alignItems="center"
          width="100%"
          p="$spacing12"
          backgroundColor="$surface2"
          opacity={isDisabled ? 0.5 : 1}
        >
          <Flex
            height={32}
            width={32}
            backgroundColor="$surface1"
            borderRadius="$rounded8"
            borderWidth={1}
            borderColor="$surface3"
            alignItems="center"
            justifyContent="center"
          >
            {icon}
          </Flex>
          <Text variant="body2" flex={1}>
            {label}
          </Text>
          {loading && <SpinningLoader size={20} color="$neutral2" />}
        </Flex>
      </TouchableArea>
    </Trace>
  )
}
