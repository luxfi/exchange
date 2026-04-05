import type { UseMutationResult } from '@tanstack/react-query'
import type { TFunction } from 'i18next'
import { Button, Flex, Input, SpinningLoader, Text, TouchableArea } from 'ui/src'
import { EnvelopeLock } from 'ui/src/components/icons/EnvelopeLock'
import { Eye } from 'ui/src/components/icons/Eye'
import { EyeOff } from 'ui/src/components/icons/EyeOff'
import { Person } from 'ui/src/components/icons/Person'
import { AccountIcon } from 'uniswap/src/features/accounts/AccountIcon'
import { ElementName, ModalName } from 'uniswap/src/features/telemetry/constants'
import Trace from 'uniswap/src/features/telemetry/Trace'
import { DigitInputRow, type DigitInputState, IconBox, StepHeader } from '~/components/Passkey/BackupLoginComponents'

export function OAuthLoadingStep({
  oauthError,
  handleClose,
}: {
  oauthError: string | undefined
  handleClose: () => void
}) {
  return (
    <Flex gap="$gap24" alignItems="center" py="$padding32" width="100%">
      {oauthError ? (
        <>
          <StepHeader onBack={handleClose} onClose={handleClose} />
          <Text variant="body2" color="$statusCritical" textAlign="center">
            {oauthError}
          </Text>
        </>
      ) : (
        <SpinningLoader size={32} />
      )}
    </Flex>
  )
}

export function EmailEntryStep({
  email,
  setEmail,
  isValidEmail,
  isLoading,
  errorMessage,
  sendCodeMutation,
  handleBack,
  handleClose,
  t,
}: {
  email: string
  setEmail: (v: string) => void
  isValidEmail: boolean
  isLoading: boolean
  errorMessage: string | undefined
  sendCodeMutation: UseMutationResult<void, Error, void>
  handleBack: () => void
  handleClose: () => void
  t: TFunction
}) {
  return (
    <Trace logImpression modal={ModalName.RecoverWallet}>
      <StepHeader onBack={handleBack} onClose={handleClose} />
      <Flex gap="$gap16" alignItems="center" width="100%" px="$padding4">
        <IconBox>
          <Person size="$icon.24" color="$neutral1" />
        </IconBox>
        <Flex gap="$gap8" alignItems="center" maxWidth={360}>
          <Text variant="subheading1" textAlign="center">
            {t('account.passkey.recovery.email.title')}
          </Text>
          <Text variant="body2" textAlign="center" color="$neutral2">
            {t('account.passkey.recovery.email.description')}
          </Text>
        </Flex>
      </Flex>
      <Flex width="100%" gap="$gap16">
        <Input
          placeholder={t('account.passkey.recovery.email.title')}
          placeholderTextColor="$neutral3"
          value={email}
          onChangeText={(v) => setEmail(v.trim())}
          onSubmitEditing={() => {
            if (isValidEmail && !isLoading) {
              sendCodeMutation.mutate()
            }
          }}
          keyboardType="email-address"
          autoComplete="email"
          autoFocus
          height={60}
          backgroundColor="$surface2"
          borderWidth={1}
          borderColor="$surface3"
          borderRadius="$rounded20"
          px="$padding20"
          color="$neutral1"
          fontSize={18}
          fontWeight="$book"
        />
        {errorMessage && (
          <Text variant="body3" color="$statusCritical" textAlign="center">
            {errorMessage}
          </Text>
        )}
        <Trace logPress element={ElementName.RecoverWalletEmail}>
          <Flex row alignSelf="stretch">
            <Button
              variant={isValidEmail ? 'branded' : 'default'}
              size="large"
              onPress={() => sendCodeMutation.mutate()}
              isDisabled={!isValidEmail || isLoading}
            >
              {t('common.button.continue')}
            </Button>
          </Flex>
        </Trace>
      </Flex>
    </Trace>
  )
}

export function EmailCodeStep({
  email,
  otpInput,
  submitCodeMutation,
  resendCodeMutation,
  errorMessage,
  handleBack,
  handleClose,
  t,
}: {
  email: string
  otpInput: DigitInputState
  submitCodeMutation: UseMutationResult<void, Error, string>
  resendCodeMutation: UseMutationResult<void, Error, void>
  errorMessage: string | undefined
  handleBack: () => void
  handleClose: () => void
  t: TFunction
}) {
  return (
    <Trace logImpression modal={ModalName.RecoverWallet}>
      <StepHeader onBack={handleBack} onClose={handleClose} />
      <Flex gap="$gap16" alignItems="center" width="100%">
        <IconBox>
          <EnvelopeLock size="$icon.24" color="$neutral1" />
        </IconBox>
        <Flex gap="$gap8" alignItems="center" maxWidth={360}>
          <Text variant="subheading1" textAlign="center">
            {t('account.passkey.backupLogin.code.title')}
          </Text>
          <Text variant="body2" textAlign="center" color="$neutral2">
            {t('account.passkey.backupLogin.code.description', { email })}
          </Text>
        </Flex>
      </Flex>
      <DigitInputRow
        digits={otpInput.digits}
        refs={otpInput.refs}
        onChange={otpInput.handleChange}
        onKeyDown={otpInput.handleKeyDown}
        onPaste={otpInput.handlePaste}
        autoFocus
        disabled={submitCodeMutation.isPending}
      />
      {submitCodeMutation.isPending && (
        <Flex row gap="$gap8" alignItems="center" justifyContent="center">
          <SpinningLoader size={16} />
          <Text variant="body3" color="$neutral2">
            {t('account.passkey.backupLogin.code.verifying')}
          </Text>
        </Flex>
      )}
      {errorMessage && (
        <Text variant="body3" color="$statusCritical" textAlign="center">
          {errorMessage}
        </Text>
      )}
      <Trace logPress element={ElementName.RecoverWalletResendCode}>
        <TouchableArea
          variant="unstyled"
          onPress={() => {
            otpInput.reset()
            resendCodeMutation.mutate()
          }}
          disabled={submitCodeMutation.isPending}
        >
          <Text variant="buttonLabel3" color="$accent1">
            {t('account.passkey.backupLogin.code.resend')}
          </Text>
        </TouchableArea>
      </Trace>
    </Trace>
  )
}

export function EnterPinStep({
  recoveryWalletAddress,
  passcodeInput,
  showPasscode,
  setShowPasscode,
  pinError,
  cooldown,
  isDecrypting,
  handleBack,
  handleClose,
  t,
}: {
  recoveryWalletAddress: string | undefined
  passcodeInput: DigitInputState
  showPasscode: boolean
  setShowPasscode: (v: boolean) => void
  pinError: string | undefined
  cooldown: { isActive: boolean; formattedTime: string }
  isDecrypting: boolean
  handleBack: () => void
  handleClose: () => void
  t: TFunction
}) {
  return (
    <Trace logImpression modal={ModalName.RecoverWallet}>
      <StepHeader onBack={handleBack} onClose={handleClose} />
      <Flex gap="$gap16" alignItems="center" width="100%" px="$padding4">
        <AccountIcon address={recoveryWalletAddress} size={48} />
        <Flex gap="$gap8" alignItems="center" maxWidth={360}>
          <Text variant="subheading1" textAlign="center">
            {t('account.passkey.recovery.pin.title')}
          </Text>
          <Text variant="body2" textAlign="center" color="$neutral2">
            {t('account.passkey.recovery.pin.description')}
          </Text>
        </Flex>
      </Flex>
      <Flex gap="$gap12" alignSelf="stretch">
        <DigitInputRow
          digits={passcodeInput.digits}
          refs={passcodeInput.refs}
          onChange={passcodeInput.handleChange}
          onKeyDown={passcodeInput.handleKeyDown}
          onPaste={passcodeInput.handlePaste}
          inputType={showPasscode ? 'text' : 'password'}
          autoFocus
          disabled={cooldown.isActive || isDecrypting}
        />
        {pinError && !cooldown.isActive && (
          <Text variant="body3" color="$statusCritical" textAlign="center">
            {pinError}
          </Text>
        )}
        {cooldown.isActive && (
          <Text variant="body3" color="$neutral2" textAlign="center">
            {t('account.passkey.recovery.cooldown', { time: cooldown.formattedTime })}
          </Text>
        )}
        {isDecrypting && (
          <Flex alignItems="center">
            <SpinningLoader size={16} />
          </Flex>
        )}
        <Flex alignItems="center">
          <TouchableArea variant="unstyled" onPress={() => setShowPasscode(!showPasscode)}>
            <Flex row gap="$gap4" alignItems="center">
              {showPasscode ? <EyeOff size="$icon.16" color="$neutral2" /> : <Eye size="$icon.16" color="$neutral2" />}
              <Text variant="buttonLabel3" color="$neutral2">
                {showPasscode ? t('common.hide.button') : t('common.show.button')}
              </Text>
            </Flex>
          </TouchableArea>
        </Flex>
      </Flex>
    </Trace>
  )
}

export function AddPasskeyStep({
  addPasskeyError,
  handleAddPasskey,
  handleClose,
  t,
}: {
  addPasskeyError: string | undefined
  handleAddPasskey: () => void
  handleClose: () => void
  t: TFunction
}) {
  return (
    <Trace logImpression modal={ModalName.RecoverWallet}>
      <Flex height={28} />
      <Flex gap="$gap16" alignItems="center" width="100%" px="$padding4">
        <IconBox background="$accent2">
          <Person size="$icon.24" color="$accent1" />
        </IconBox>
        <Flex gap="$gap8" alignItems="center" maxWidth={360}>
          <Text variant="subheading1" textAlign="center">
            {t('account.passkey.recovery.addPasskey.title')}
          </Text>
          <Text variant="body2" textAlign="center" color="$neutral2">
            {t('account.passkey.recovery.addPasskey.description')}
          </Text>
        </Flex>
      </Flex>
      <Flex gap="$gap16" alignItems="center" width="100%">
        {addPasskeyError && (
          <Text variant="body3" color="$statusCritical" textAlign="center">
            {addPasskeyError}
          </Text>
        )}
        <Trace logPress element={ElementName.RecoverWalletAddPasskey}>
          <Flex row alignSelf="stretch">
            <Button variant="branded" size="medium" onPress={handleAddPasskey}>
              {t('account.passkey.recovery.addPasskey.button')}
            </Button>
          </Flex>
        </Trace>
        <Trace logPress element={ElementName.RecoverWalletSignOut}>
          <TouchableArea variant="unstyled" onPress={handleClose}>
            <Text variant="buttonLabel2" color="$neutral2">
              {t('account.passkey.recovery.signOut')}
            </Text>
          </TouchableArea>
        </Trace>
      </Flex>
    </Trace>
  )
}

export function RecoveringStep({ t }: { t: TFunction }) {
  return (
    <Trace logImpression modal={ModalName.RecoverWallet}>
      <Flex gap="$gap24" alignItems="center" py="$padding32">
        <SpinningLoader size={32} />
        <Text variant="body2" color="$neutral2" textAlign="center">
          {t('account.passkey.recovery.recovering')}
        </Text>
      </Flex>
    </Trace>
  )
}
