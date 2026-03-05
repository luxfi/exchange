import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { luxMainnet, zooMainnet } from './chains'

export const config = getDefaultConfig({
  appName: 'Lux Market',
  projectId: 'a739fdd0c00cbb93bc06df1e27a83d63', // WalletConnect project ID
  chains: [luxMainnet, zooMainnet],
  ssr: true,
})
