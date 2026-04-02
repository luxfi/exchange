import type { ReactNode } from 'react'
import { memo } from 'react'
import { Flex } from 'ui/src'
import { ProgressIndicator } from '@l.x/lx/src/components/ConfirmSwapModal/ProgressIndicator'
import { TransactionModalInnerContainer } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModal'
import { useTransactionModalContext } from '@l.x/lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { usePrepareSwapTransactionEffect } from '@l.x/lx/src/features/transactions/swap/review/hooks/usePrepareSwapTransactionEffect'
import { useSwapOnPrevious } from '@l.x/lx/src/features/transactions/swap/review/hooks/useSwapOnPrevious'
import { SwapErrorScreen } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapErrorScreen'
import { SwapReviewFooter } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewFooter/SwapReviewFooter'
import { SwapReviewLoadingView } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewLoadingView'
import { SwapReviewSwapDetails } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewSwapDetails'
import { SwapReviewWarningModal } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewWarningModal'
import { SwapReviewWrapTransactionDetails } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/SwapReviewWrapTransactionDetails'
import { TransactionAmountsReview } from '@l.x/lx/src/features/transactions/swap/review/SwapReviewScreen/TransactionAmountsReview'
import { SwapReviewCallbacksContextProvider } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewCallbacksStore/SwapReviewCallbacksStoreContextProvider'
import { useSwapReviewCallbacksStore } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewCallbacksStore/useSwapReviewCallbacksStore'
import { SwapReviewStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/SwapReviewStoreContextProvider'
import { SyncActivePlanEffects } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/SyncActivePlanEffects'
import {
  useShowInterfaceReviewSteps,
  useSwapReviewStore,
} from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewStore/useSwapReviewStore'
import { SwapReviewTransactionStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewTransactionStore/SwapReviewTransactionStoreContextProvider'
import {
  useIsSwapMissingParams,
  useIsSwapReviewLoading,
  useSwapReviewError,
  useSwapReviewTransactionStore,
} from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewTransactionStore/useSwapReviewTransactionStore'
import { SwapReviewWarningStoreContextProvider } from '@l.x/lx/src/features/transactions/swap/review/stores/swapReviewWarningStore/SwapReviewWarningStoreContextProvider'
import { useSwapDependenciesStore } from '@l.x/lx/src/features/transactions/swap/stores/swapDependenciesStore/useSwapDependenciesStore'
import { useSwapTxStore } from '@l.x/lx/src/features/transactions/swap/stores/swapTxStore/useSwapTxStore'
import { isChained } from '@l.x/lx/src/features/transactions/swap/utils/routing'
import { TransactionWarning } from '@l.x/lx/src/features/transactions/TransactionDetails/TransactionWarning'
import { logger } from 'utilities/src/logger/logger'
import { isWebPlatform } from 'utilities/src/platform'

interface SwapReviewScreenProps {
  hideContent: boolean
  onSubmitSwap?: () => Promise<void> | void
}

export function SwapReviewScreen({ hideContent, onSubmitSwap }: SwapReviewScreenProps): JSX.Element {
  return <SwapReviewScreenProviders hideContent={hideContent} onSubmitSwap={onSubmitSwap} />
}

export function SwapReviewScreenProviders({ hideContent, onSubmitSwap }: SwapReviewScreenProps): JSX.Element {
  const { onClose, authTrigger, setScreen } = useTransactionModalContext()
  const { derivedSwapInfo, getExecuteSwapService } = useSwapDependenciesStore((s) => ({
    derivedSwapInfo: s.derivedSwapInfo,
    getExecuteSwapService: s.getExecuteSwapService,
  }))
  const swapTxContext = useSwapTxStore((s) => s)

  return (
    <SwapReviewStoreContextProvider hideContent={hideContent}>
      <SyncActivePlanEffects />
      <SwapReviewWarningStoreContextProvider>
        <SwapReviewCallbacksContextProvider
          setScreen={setScreen}
          authTrigger={authTrigger}
          getExecuteSwapService={getExecuteSwapService}
          onSubmitSwap={onSubmitSwap}
          onClose={onClose}
        >
          <SwapReviewTransactionStoreContextProvider derivedSwapInfo={derivedSwapInfo} swapTxContext={swapTxContext}>
            <SwapReviewContent />
          </SwapReviewTransactionStoreContextProvider>
        </SwapReviewCallbacksContextProvider>
      </SwapReviewWarningStoreContextProvider>
    </SwapReviewStoreContextProvider>
  )
}

function SwapReviewContent(): JSX.Element | null {
  const { acceptedDerivedSwapInfo, isWrap, newTradeRequiresAcceptance } = useSwapReviewTransactionStore((s) => ({
    acceptedDerivedSwapInfo: s.acceptedDerivedSwapInfo,
    isWrap: s.isWrap,
    newTradeRequiresAcceptance: s.newTradeRequiresAcceptance,
  }))

  const { steps, currentStep, hideContent } = useSwapReviewStore((s) => ({
    steps: s.steps,
    currentStep: s.currentStep,
    hideContent: s.hideContent,
  }))

  const { trade } = acceptedDerivedSwapInfo?.trade ?? {}
  const isChainedAction = Boolean(trade && isChained({ routing: trade.routing }))

  const showInterfaceReviewSteps = useShowInterfaceReviewSteps() && !newTradeRequiresAcceptance

  const { onPrev } = useSwapOnPrevious()

  const isLoading = useIsSwapReviewLoading()
  const isSwapMissingParams = useIsSwapMissingParams()
  const error = useSwapReviewError()

  usePrepareSwapTransactionEffect()

  if (isLoading) {
    return <SwapReviewLoadingView />
  }

  if (isSwapMissingParams) {
    // This should never happen, but sometimes it does because gui renders the mobile web drawer when isModalOpen is false.
    logger.error('Missing required props in `derivedSwapInfo` to render `SwapReview` screen.', {
      tags: {
        file: 'SwapReviewScreen',
        function: 'render',
      },
    })
    return null
  }

  if (error.submissionError) {
    return (
      <SwapErrorScreen
        submissionError={error.submissionError}
        setSubmissionError={error.setSubmissionError}
        resubmitSwap={error.onSwapButtonClick}
        onPressRetry={error.onPressRetry}
        onClose={onPrev}
      />
    )
  }

  return (
    <>
      <SwapReviewContentWrapper>
        <SwapReviewWarningModal />
        {/* We hide the content via `hideContent` to allow the bottom sheet to animate properly while still rendering the components to allow the sheet to calculate its height. */}
        <Flex
          animation="quick"
          opacity={hideContent ? 0 : 1}
          gap="$spacing16"
          pt={isWebPlatform ? '$spacing8' : undefined}
        >
          {acceptedDerivedSwapInfo && (
            <TransactionAmountsReview
              acceptedDerivedSwapInfo={acceptedDerivedSwapInfo}
              newTradeRequiresAcceptance={newTradeRequiresAcceptance}
              onClose={onPrev}
            />
          )}
          {showInterfaceReviewSteps ? (
            <>
              <ProgressIndicator currentStep={currentStep} steps={steps} isChainedAction={isChainedAction} />
              <ActivePlanWarningBanner />
            </>
          ) : isWrap ? (
            <SwapReviewWrapTransactionDetails />
          ) : (
            <SwapReviewSwapDetails />
          )}
        </Flex>
      </SwapReviewContentWrapper>
      <SwapReviewFooter />
    </>
  )
}

/** Shows balance/gas warnings from the active plan when steps are displayed and not submitting. */
function ActivePlanWarningBanner(): JSX.Element | null {
  const reviewScreenWarning = useSwapReviewTransactionStore((s) => s.reviewScreenWarning)
  const onShowWarning = useSwapReviewCallbacksStore((s) => s.onShowWarning)

  const warning = reviewScreenWarning?.warning

  if (!warning) {
    return null
  }

  return <TransactionWarning warning={warning} onShowWarning={onShowWarning} />
}

const SwapReviewContentWrapper = memo(function SwapReviewContentWrapper({
  children,
}: {
  children: ReactNode
}): JSX.Element {
  const { bottomSheetViewStyles } = useTransactionModalContext()
  return (
    <TransactionModalInnerContainer bottomSheetViewStyles={bottomSheetViewStyles} fullscreen={false}>
      {children}
    </TransactionModalInnerContainer>
  )
})
