import { Path, Svg } from 'react-native-svg'
import type { IconProps } from 'pkgs/ui/src/components/factories/createIcon'

export const DEXGeneric = (props: IconProps) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
)
export default DEXGeneric
