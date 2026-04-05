import { memo, ReactNode } from 'react'
<<<<<<< HEAD
import { Flex } from '@l.x/ui/src'
=======
import { Flex } from 'ui/src'
>>>>>>> upstream/main

interface GroupHoverTransitionProps {
  defaultContent: ReactNode
  hoverContent: ReactNode
<<<<<<< HEAD
  /** When false, only default content is shown and no group-hover transition is applied. */
  showTransition?: boolean
  height: number
  /** CSS transition for the slide (e.g. 'all 0.1s ease-in-out'). */
=======
  showTransition?: boolean
  height: number
>>>>>>> upstream/main
  transition?: string
  /** When true, use $group-item-hover (for parent with group="item"). Default uses $group-hover. */
  useGroupItemHover?: boolean
}

/**
<<<<<<< HEAD
 * Renders two content slots and uses Gui's $group-hover (or $group-item-hover) to slide
=======
 * Renders two content slots and uses Tamagui's $group-hover (or $group-item-hover) to slide
>>>>>>> upstream/main
 * from default to hover when the parent with `group` is hovered. Translate-only (no fade).
 * Requires a parent with the `group` prop (e.g. <Flex group> or <Flex group="item">).
 * Caller should ensure defaultContent and hoverContent each have the given height.
 */
<<<<<<< HEAD
function _GroupHoverTransition({
=======
function GroupHoverTransitionInner({
>>>>>>> upstream/main
  defaultContent,
  hoverContent,
  showTransition = true,
  height,
<<<<<<< HEAD
  transition = 'all 0.1s ease-in-out',
=======
  transition = 'transform 0.1s ease-in-out',
>>>>>>> upstream/main
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

<<<<<<< HEAD
export const GroupHoverTransition = memo(_GroupHoverTransition)
=======
export const GroupHoverTransition = memo(GroupHoverTransitionInner)
>>>>>>> upstream/main
