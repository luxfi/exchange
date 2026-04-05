import { ForwardedRef, forwardRef, PropsWithChildren } from 'react'
<<<<<<< HEAD
import { Flex, FlexProps, GuiElement, useMedia } from '@l.x/ui/src'
=======
import { Flex, FlexProps, TamaguiElement, useMedia } from 'ui/src'
>>>>>>> upstream/main
import { LoadingBubble } from '~/components/Tokens/loading'

export const Cell = forwardRef(
  (
    {
      loading,
      children,
      testId,
      ...rest
    }: PropsWithChildren<{ loading?: boolean; testId?: string } & Partial<FlexProps>>,
<<<<<<< HEAD
    ref: ForwardedRef<GuiElement>,
=======
    ref: ForwardedRef<TamaguiElement>,
>>>>>>> upstream/main
  ) => {
    const media = useMedia()
    const paddingY = rest.py ?? (media.lg ? '$spacing12' : '$spacing16')
    // Calculate loading bubble height based on cell padding to ensure consistent dimensions
    const loadingBubbleHeight = media.lg ? '$spacing32' : '$spacing16'
    const justifyContent = rest.justifyContent ?? 'flex-end'

    return (
      <Flex
        row
        overflow="hidden"
        $platform-web={{
          fontVariantNumeric: 'lining-nums tabular-nums',
        }}
        data-testid={testId}
        justifyContent={justifyContent}
        px={rest.px ?? '$spacing12'}
        py={paddingY}
        alignItems={rest.alignItems ?? 'center'}
        ref={ref}
        {...rest}
      >
        {loading ? (
          <LoadingBubble
            height={loadingBubbleHeight}
            width="75%"
            containerProps={{
              justifyContent,
              testID: 'cell-loading-bubble',
            }}
          />
        ) : (
          children
        )}
      </Flex>
    )
  },
)

Cell.displayName = 'Cell'
