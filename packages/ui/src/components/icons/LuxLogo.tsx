import { Path, Svg } from 'react-native-svg'

// eslint-disable-next-line no-relative-import-paths/no-relative-import-paths
import { createIcon } from '../factories/createIcon'

// Lux Logo - White upside-down triangle
export const [LuxLogo, AnimatedLuxLogo] = createIcon({
  name: 'LuxLogo',
  getIcon: (props) => (
    <Svg fill="none" viewBox="0 0 100 100" {...props}>
      <Path fill="currentColor" d="M50 85 L15 25 L85 25 Z" />
    </Svg>
  ),
})
