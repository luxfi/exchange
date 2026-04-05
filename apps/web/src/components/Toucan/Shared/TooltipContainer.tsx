import { ComponentProps, forwardRef, PropsWithChildren } from 'react'
<<<<<<< HEAD
import { Flex, useShadowPropsShort } from '@l.x/ui/src'
=======
import { Flex, useShadowPropsShort } from 'ui/src'
>>>>>>> upstream/main

type TooltipContainerProps = PropsWithChildren<ComponentProps<typeof Flex>>

export const TooltipContainer = forwardRef<HTMLDivElement, TooltipContainerProps>(function TooltipContainer(
  { children, ...props },
  ref,
) {
  const shadowProps = useShadowPropsShort()

  return (
    <Flex
      ref={ref}
      position="absolute"
      pointerEvents="none"
      backgroundColor="$surface1"
      borderWidth="$spacing1"
      borderColor="$surface3"
      borderRadius="$rounded6"
      {...shadowProps}
      {...props}
    >
      {children}
    </Flex>
  )
})
