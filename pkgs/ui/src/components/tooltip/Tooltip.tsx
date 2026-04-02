import { Tooltip as GuiTooltip, TooltipProps, withStaticProperties } from '@hanzo/gui'
import { PlatformSplitStubError } from 'utilities/src/errors'

export type { TooltipProps } from '@hanzo/gui'

type TriggerProps = React.ComponentProps<typeof GuiTooltip.Trigger>
export type TooltipContentProps = Omit<React.ComponentProps<typeof GuiTooltip.Content>, 'zIndex'> & {
  animationDirection?: 'left' | 'right' | 'top' | 'bottom'
  // zIndex is required to properly display components
  zIndex: NonNullable<React.ComponentProps<typeof GuiTooltip.Content>['zIndex']>
}
type ArrowProps = React.ComponentProps<typeof GuiTooltip.Arrow>

export const Tooltip = withStaticProperties(
  (_props: TooltipProps) => {
    throw new PlatformSplitStubError('Tooltip')
  },
  {
    Trigger: (_props: TriggerProps) => {
      throw new PlatformSplitStubError('Tooltip.Trigger')
    },
    Content: (_props: TooltipContentProps) => {
      throw new PlatformSplitStubError('Tooltip.Content')
    },
    Arrow: (_props: ArrowProps) => {
      throw new PlatformSplitStubError('Tooltip.Arrow')
    },
  },
)
