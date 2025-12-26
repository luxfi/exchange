import { Tooltip as TTooltip, Text, styled, Paragraph } from 'tamagui'

const TooltipContent = styled(TTooltip.Content, {
  name: 'TooltipContent',
  backgroundColor: '$background',
  borderRadius: '$2',
  paddingHorizontal: '$3',
  paddingVertical: '$2',
  borderWidth: 1,
  borderColor: '$borderColor',
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
        <Paragraph size="$2">{content}</Paragraph>
      </TooltipContent>
    </TTooltip>
  )
}
