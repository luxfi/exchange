import { SVGProps } from 'react'
import { Flex, Image, styled, useSporeColors } from '@luxfi/ui/src'
import { brand } from '@l.x/config'

// Default logo — simple triangle (used when no brand logoUrl is set)
function DefaultLogo({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 100 100"
      fill="none"
      onClick={onClick}
      cursor="pointer"
    >
      <path d="M50 85 L15 25 L85 25 Z" fill={color} />
    </svg>
  )
}

const Container = styled(Flex, {
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  cursor: 'auto',
  variants: {
    clickable: {
      true: { cursor: 'pointer' },
    },
  },
})

type NavIconProps = SVGProps<SVGSVGElement> & {
  clickable?: boolean
  onClick?: () => void
}

export const NavIcon = ({ clickable, onClick }: NavIconProps) => {
  const colors = useSporeColors()

  return (
    <Container clickable={clickable}>
      {brand.logoUrl ? (
        <Image
          source={{ uri: brand.logoUrl }}
          width={24}
          height={24}
          style={{ cursor: onClick ? 'pointer' : 'auto' }}
          onPress={onClick}
        />
      ) : (
        <DefaultLogo color={colors.accent1.val} onClick={onClick} />
      )}
    </Container>
  )
}
