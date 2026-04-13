import '@reach/dialog/styles.css'
import '~/global.css'
import '~/polyfills'
import '~/tracing'

// We intentionally import this to ensure that the WalletConnect provider is bundled as an entrypoint chunk,
// because it will always be requested anyway and we don't want to have a waterfall request pattern.
import * as WalletConnect from '@walletconnect/ethereum-provider'
