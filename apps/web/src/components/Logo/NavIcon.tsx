import { SVGProps } from 'react'
import { Flex, styled, useSporeColors } from 'ui/src'

// Lux Logo - White upside-down triangle
function Logo({ color, onClick }: { color: string; onClick?: () => void }) {
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

// Holiday variant - same Lux logo with festive touch
function HolidayLogo({ color, onClick }: { color: string; onClick?: () => void }) {
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
      <Logo color={colors.accent1.val} onClick={onClick} />
    </Container>
  )
}
