import { Paragraph, styled, Tooltip as TTooltip } from 'tamagui'

const TooltipContent = styled(TTooltip.Content, {
  name: 'TooltipContent',
  backgroundColor: '$surface1',
  borderRadius: '$rounded8',
  px: '$spacing12',
  py: '$spacing8',
  borderWidth: 1,
  borderColor: '$surface3',
  enterStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
  exitStyle: { x: 0, y: -5, opacity: 0, scale: 0.9 },
  animation: [
    'quick',
    {
      opacity: {
        overshootClamping: true,
      },
    },
  ],
})

const TooltipArrow = styled(TTooltip.Arrow, {
  name: 'TooltipArrow',
})

export interface TooltipProps {
  content: string
  children: React.ReactNode
  delay?: number
}

export function Tooltip({ content, children, delay = 300 }: TooltipProps) {
  return (
    <TTooltip delay={delay}>
      <TTooltip.Trigger asChild>{children}</TTooltip.Trigger>
      <TooltipContent>
        <TooltipArrow />
        <Paragraph fontSize={14}>{content}</Paragraph>
      </TooltipContent>
    </TTooltip>
  )
}
