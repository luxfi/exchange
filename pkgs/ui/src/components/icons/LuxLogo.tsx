import { Path, Svg } from 'react-native-svg'
import type { GeneratedIcon, IconProps } from 'pkgs/ui/src/components/factories/createIcon'

export const LuxLogo = (props: IconProps) => (
  <Svg viewBox="0 0 32 32" fill="none" {...props}>
    <Path
      d="M16 2L2 16l14 14 14-14L16 2zm0 4.5L26.5 16 16 25.5 5.5 16 16 6.5z"
      fill="currentColor"
    />
    <Path
      d="M16 10l-6 6 6 6 6-6-6-6z"
      fill="currentColor"
    />
  </Svg>
)

export default LuxLogo
