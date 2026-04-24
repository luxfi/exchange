// biome-ignore assist/source/organizeImports: we want to keep the import order
import './wdyr'
// biome-ignore assist/source/organizeImports: we want to keep the import order
import { isNonTestDev } from '@l.x/utils/src/environment/constants'

if (isNonTestDev) {
  require('./ReactotronConfig')
}

import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'src/logbox'
import 'src/polyfills'
