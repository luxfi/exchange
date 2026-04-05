// biome-ignore assist/source/organizeImports: we want to keep the import order
import './wdyr'
// biome-ignore assist/source/organizeImports: we want to keep the import order
import { isNonTestDev } from 'utilities/src/environment/constants'

if (isNonTestDev) {
  require('./ReactotronConfig')
}

<<<<<<< HEAD
import { AppRegistry } from 'react-native'
=======
>>>>>>> upstream/main
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'src/logbox'
import 'src/polyfills'
<<<<<<< HEAD
=======
import { AppRegistry } from 'react-native'
>>>>>>> upstream/main
// biome-ignore assist/source/organizeImports: we want to keep the import order
import App from 'src/app/App'
import AppConfig from './app.config'

AppRegistry.registerComponent(AppConfig.name, () => App)
