import { Button, Flex, useIsShortMobileDevice } from 'ui/src'
import { useCexTransferProviders } from 'lx/src/features/fiatOnRamp/useCexTransferProviders'
import {
  useIsShowingWebFORNudge,
  useIsWebFORNudgeEnabled,
  useSetIsShowingWebFORNudge,
} from 'lx/src/features/providers/webForNudgeProvider'
import { useTransactionModalContext } from 'lx/src/features/transactions/components/TransactionModal/TransactionModalContext'
import { useIsSwapButtonDisabled } from 'lx/src/features/transactions/swap/components/SwapFormButton/hooks/useIsSwapButtonDisabled'
import { useIsTradeIndicative } from 'lx/src/features/transactions/swap/components/SwapFormButton/hooks/useIsTradeIndicative'
import { useOnReviewPress } from 'lx/src/features/transactions/swap/components/SwapFormButton/hooks/useOnReviewPress'
import { useSwapFormButtonColors } from 'lx/src/features/transactions/swap/components/SwapFormButton/hooks/useSwapFormButtonColors'
import { useSwapFormButtonText } from 'lx/src/features/transactions/swap/components/SwapFormButton/hooks/useSwapFormButtonText'
import { SwapFormButtonTrace } from 'lx/src/features/transactions/swap/components/SwapFormButton/SwapFormButtonTrace'
import { TestID } from 'lx/src/test/fixtures/testIDs'
import { useEvent } from 'utilities/src/react/hooks'

export const SWAP_BUTTON_TEXT_VARIANT = 'buttonLabel1'

// TODO(SWAP-573): Co-locate button action/color/text logic instead of separating the very-coupled UI state
export function SwapFormButton({ tokenColor }: { tokenColor?: string }): JSX.Element {
  const isShortMobileDevice = useIsShortMobileDevice()
  const indicative = useIsTradeIndicative()
  const { handleOnReviewPress } = useOnReviewPress()
  const disabled = useIsSwapButtonDisabled()
  const buttonText = useSwapFormButtonText()
  const { swapRedirectCallback } = useTransactionModalContext()
  const {
    backgroundColor: buttonBackgroundColor,
    variant: buttonVariant,
    emphasis: buttonEmphasis,
    buttonTextColor,
  } = useSwapFormButtonColors(tokenColor)
  const isShowingWebFORNudge = useIsShowingWebFORNudge()
  const setIsShowingWebFORNudge = useSetIsShowingWebFORNudge()
  const promptWebFORNudge = useIsWebFORNudgeEnabled() && !swapRedirectCallback && !isShowingWebFORNudge
  // Only show loading state if the trade is `indicative` and we're not on the landing page.
  // This is so that the `Get Started` button is always enabled/clickable.
  const shouldShowLoading = !!indicative && !swapRedirectCallback

  // preload cex transfer providers to avoid flickering when showing web for nudge
  useCexTransferProviders({ isDisabled: !promptWebFORNudge })

  const setIsShowingWebFORNudgeHandler: () => void = useEvent(() => {
    setIsShowingWebFORNudge(true)
  })

  return (
    <Flex alignItems="center" gap={isShortMobileDevice ? '$spacing8' : '$spacing16'}>
      <SwapFormButtonTrace>
        <Flex row alignSelf="stretch">
          <Button
            variant={buttonVariant}
            emphasis={buttonEmphasis}
            // TODO(WALL-7186): make loading state more representative of the trade state
            loading={shouldShowLoading}
            isDisabled={disabled}
            backgroundColor={buttonBackgroundColor}
            size={isShortMobileDevice ? 'small' : 'large'}
            testID={TestID.ReviewSwap}
            animation="simple"
            onPress={promptWebFORNudge ? setIsShowingWebFORNudgeHandler : handleOnReviewPress}
          >
            {buttonTextColor ? <Button.Text color={buttonTextColor}>{buttonText}</Button.Text> : buttonText}
          </Button>
        </Flex>
      </SwapFormButtonTrace>
    </Flex>
  )
}
