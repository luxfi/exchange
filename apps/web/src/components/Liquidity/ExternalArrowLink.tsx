import { Anchor, Flex, Text } from '@luxfi/ui/src'
import { Arrow } from '@luxfi/ui/src/components/arrow/Arrow'
import { iconSizes } from '@luxfi/ui/src/theme'
import { ClickableGuiStyle } from '~/theme/components/styles'

export function ExternalArrowLink({
  href,
  openInNewTab = true,
  children,
}: {
  href: string
  openInNewTab?: boolean
  children: React.ReactNode
}) {
  return (
    <Anchor
      textDecorationLine="none"
      href={href}
      target={openInNewTab ? '_blank' : undefined}
      {...ClickableGuiStyle}
    >
      <Flex gap="$gap8" alignItems="center" row>
        <Text variant="buttonLabel3" color="$neutral2">
          {children}
        </Text>
        <Arrow size={iconSizes.icon20} color="$neutral2" />
      </Flex>
    </Anchor>
  )
}
