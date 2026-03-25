import { Stack, styled } from '@hanzo/gui'

const ArrowFrame = styled(Stack, {
  name: 'SwapArrow',
  tag: 'button',
  width: 36,
  height: 36,
  borderRadius: '$rounded12',
  borderWidth: 1,
  borderColor: 'rgba(255,255,255,0.06)',
  backgroundColor: '#111',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  marginVertical: -14,
  alignSelf: 'center',
  zIndex: 1,
  animation: 'quick',
  hoverStyle: {
    backgroundColor: '#1a1a1a',
    borderColor: 'rgba(255,255,255,0.12)',
    rotate: '180deg',
  },
})

export interface SwapArrowProps {
  onPress?: () => void
}

export function SwapArrow({ onPress }: SwapArrowProps) {
  return (
    <ArrowFrame onPress={onPress}>
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M7 2.5v9m0 0L4 8.5m3 3l3-3"
          stroke="rgba(255,255,255,0.5)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </ArrowFrame>
  )
}
