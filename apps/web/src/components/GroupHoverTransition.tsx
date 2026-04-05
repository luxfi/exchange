import { memo, ReactNode } from 'react'
import { Flex } from 'ui/src'

interface GroupHoverTransitionProps {
  defaultContent: ReactNode
  hoverContent: ReactNode
  showTransition?: boolean
  height: number
  transition?: string
  /** When true, use $group-item-hover (for parent with group="item"). Default uses $group-hover. */
  useGroupItemHover?: boolean
}

/**
 * Renders two content slots and uses Tamagui's $group-hover (or $group-item-hover) to slide
 * from default to hover when the parent with `group` is hovered. Translate-only (no fade).
 * Requires a parent with the `group` prop (e.g. <Flex group> or <Flex group="item">).
 * Caller should ensure defaultContent and hoverContent each have the given height.
 */
function GroupHoverTransitionInner({
  defaultContent,
  hoverContent,
  showTransition = true,
  height,
  transition = 'transform 0.1s ease-in-out',
  useGroupItemHover = false,
}: GroupHoverTransitionProps): JSX.Element {
  if (!showTransition) {
    return (
      <Flex position="relative" width="100%" overflow="hidden" height={height}>
        {defaultContent}
      </Flex>
    )
  }

  const hoverStyle = { y: -height }

  return (
    <Flex position="relative" width="100%" overflow="hidden" height={height}>
      <Flex
        position="absolute"
        justifyContent="center"
        transition={transition}
        flexDirection="column"
        y={0}
        $group-hover={useGroupItemHover ? undefined : hoverStyle}
        $group-item-hover={useGroupItemHover ? hoverStyle : undefined}
        width="100%"
      >
        {defaultContent}
        {hoverContent}
      </Flex>
    </Flex>
  )
}

export const GroupHoverTransition = memo(GroupHoverTransitionInner)
