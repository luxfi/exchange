import { TradingApi } from '@l.x/api'
import { useTranslation } from 'react-i18next'
import { Button, Flex, IconButton, Text } from '@l.x/ui/src'
import { HelpCenter } from '@l.x/ui/src/components/icons/HelpCenter'
import { X } from '@l.x/ui/src/components/icons/X'
import { WarningSeverity } from '@l.x/lx/src/components/modals/WarningModal/types'
import { WarningModalContent } from '@l.x/lx/src/components/modals/WarningModal/WarningModal'
import { LearnMoreLink } from '@l.x/lx/src/components/text/LearnMoreLink'
import { lxUrls } from '@l.x/lx/src/constants/urls'
import { ModalName } from '@l.x/lx/src/features/telemetry/constants'
import {
  useTransactionSettingsActions,
  useTransactionSettingsStore,
} from '@l.x/lx/src/features/transactions/components/settings/stores/transactionSettingsStore/useTransactionSettingsStore'
import { TransactionModalInnerContainer } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModal'
import { useTransactionModalContext } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { getErrorContent, TransactionStepFailedError } from '@l.x/lx/src/features/transactions/errors'
import { TransactionStepType } from '@l.x/lx/src/features/transactions/steps/types'
import { openUri } from '@l.x/lx/src/utils/linking'
import { isWebPlatform } from '@l.x/utils/src/platform'

export function SwapErrorScreen({
  submissionError,
  setSubmissionError,
  onPressRetry,
  resubmitSwap,
  onClose,
}: {
  submissionError: Error
  setSubmissionError: (e: Error | undefined) => void
  resubmitSwap: () => void
  onPressRetry: (() => void) | undefined
  onClose: () => void
}): JSX.Element {
  const { t } = useTranslation()
  const { bottomSheetViewStyles } = useTransactionModalContext()
  const { selectedProtocols } = useTransactionSettingsStore((s) => ({
    selectedProtocols: s.selectedProtocols,
  }))
  const { setSelectedProtocols } = useTransactionSettingsActions()

  const { title, message, supportArticleURL, buttonText } = getErrorContent(t, submissionError)

  const isLXBackendError =
    submissionError instanceof TransactionStepFailedError &&
    submissionError.isBackendRejection &&
    submissionError.step.type === TransactionStepType.LXSignature

  const handleTryAgain = (): void => {
    if (onPressRetry) {
      onPressRetry()
    } else if (isLXBackendError) {
      // TODO(WEB-7668): move this into onPressRetry logic.
      // Update swap preferences for this session to exclude LX if Lx x failed
      const updatedProtocols = selectedProtocols.filter((protocol) => protocol !== TradingApi.ProtocolItems.LXSWAP_V2)
      setSelectedProtocols(updatedProtocols)
    } else {
      resubmitSwap()
    }
    setSubmissionError(undefined)
  }

  const onPressGetHelp = async (): Promise<void> => {
    await openUri({ uri: supportArticleURL ?? lxUrls.helpUrl })
  }

  const caption = supportArticleURL ? (
    <Flex gap="$spacing8" alignItems="center">
      <Text color="$neutral2" textAlign="center" variant="body3">
        {message}
      </Text>
      <LearnMoreLink url={supportArticleURL} />
    </Flex>
  ) : (
    <Text color="$neutral2" textAlign="center" variant="body3">
      {message}
    </Text>
  )

  return (
    <TransactionModalInnerContainer bottomSheetViewStyles={bottomSheetViewStyles} fullscreen={false}>
      <Flex gap="$spacing16">
        {isWebPlatform && (
          <Flex row justifyContent="flex-end" m="$spacing12" gap="$spacing8">
            <Button fill={false} emphasis="tertiary" size="xxsmall" icon={<HelpCenter />} onPress={onPressGetHelp}>
              {t('common.getHelp.button')}
            </Button>
            <IconButton size="xxsmall" variant="default" emphasis="text-only" icon={<X />} onPress={onClose} />
          </Flex>
        )}
        <Flex animation="quick" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }}>
          <WarningModalContent
            modalName={ModalName.SwapError}
            title={title}
            captionComponent={caption}
            severity={WarningSeverity.Low}
            rejectText={buttonText ?? t('common.button.tryAgain')}
            onReject={handleTryAgain}
          />
        </Flex>
      </Flex>
    </TransactionModalInnerContainer>
  )
}
