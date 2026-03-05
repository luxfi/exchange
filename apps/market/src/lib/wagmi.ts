import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { luxMainnet, zooMainnet, hanzoMainnet, spcMainnet, parsMainnet } from './chains'

export const config = getDefaultConfig({
  appName: 'Lux Market',
  projectId: 'a739fdd0c00cbb93bc06df1e27a83d63',
  chains: [luxMainnet, zooMainnet, hanzoMainnet, spcMainnet, parsMainnet],
  ssr: true,
})
