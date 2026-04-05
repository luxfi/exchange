import { ExpoConfig } from 'expo/config'

const config: ExpoConfig = {
<<<<<<< HEAD
  name: 'Lux',
  slug: 'luxmobile',
  scheme: 'lux',
  owner: 'lux',
=======
  name: 'Uniswap',
  slug: 'uniswapmobile',
  scheme: 'uniswap',
  owner: 'uniswap',
>>>>>>> upstream/main
  extra: {
    eas: {
      projectId: 'f1be3813-43d7-49ac-a792-7f42cf8500f5',
    },
  },
  experiments: {
    buildCacheProvider: 'eas',
  },
}

export default config
