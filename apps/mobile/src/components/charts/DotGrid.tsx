import { memo } from 'react'
import { StyleSheet } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import { useSporeColors } from 'ui/src'
import { opacify } from 'ui/src/theme'

const ROW_SPACING = 17
const COL_SPACING = 30
const DOT_SIZE = 1.5

export const DotGrid = memo(function DotGrid({
  width,
  height,
  opacity = 1,
}: {
  width: number
  height: number
  opacity?: number
}): JSX.Element {
  const colors = useSporeColors()
  const numRows = Math.floor(height / ROW_SPACING) + 1
  const dotColor = opacify(25, colors.neutral3.val)

  return (
    <Svg width={width} height={height} style={[StyleSheet.absoluteFill, { opacity }]}>
      {Array.from({ length: numRows }, (_, i) => (
        <Line
          key={i}
          x1={COL_SPACING / 2}
          y1={i * ROW_SPACING}
          x2={width}
          y2={i * ROW_SPACING}
          stroke={dotColor}
          strokeWidth={DOT_SIZE}
          strokeLinecap="round"
          strokeDasharray={`0 ${COL_SPACING}`}
        />
      ))}
    </Svg>
  )
})
