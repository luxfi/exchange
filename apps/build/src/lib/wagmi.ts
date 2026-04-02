import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { luxMainnet } from './chains'

export const config = getDefaultConfig({
  appName: 'Lux Build',
  projectId: 'a739fdd0c00cbb93bc06df1e27a83d63',
  chains: [luxMainnet],
  ssr: true,
})
