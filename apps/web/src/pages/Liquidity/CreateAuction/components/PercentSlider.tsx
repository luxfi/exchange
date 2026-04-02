import type { RefObject } from 'react'
import { Flex } from '@luxfi/ui/src'

const THUMB_SHADOW = '0 1px 3px rgba(0, 0, 0, 0.25)'

interface PercentSliderProps {
  fillPercent: number
  fillColor: string
  sliderRef: RefObject<HTMLDivElement | null>
}

export function PercentSlider({ fillPercent, fillColor, sliderRef }: PercentSliderProps) {
  return (
    <Flex ref={sliderRef} height={12} position="relative" cursor="pointer" userSelect="none">
      <Flex
        position="absolute"
        left={0}
        right={0}
        top={0}
        bottom={0}
        backgroundColor="$surface3"
        borderRadius="$roundedFull"
        overflow="hidden"
      >
        {fillPercent > 0 && (
          <Flex position="absolute" left={0} top={0} bottom={0} width={`${fillPercent}%`} backgroundColor={fillColor} />
        )}
      </Flex>
      <Flex
        position="absolute"
        top={0}
        bottom={0}
        width={12}
        borderRadius="$roundedFull"
        backgroundColor="$white"
        pointerEvents="none"
        style={{
          left: `calc(${fillPercent}% - 6px)`,
          boxShadow: THUMB_SHADOW,
        }}
      />
    </Flex>
  )
}
