>>>>>>> upstream/main
import '@reach/dialog/styles.css'
import '~/global.css'
import '~/polyfills'
import '~/tracing'
<<<<<<< HEAD

// We intentionally import this to ensure that the WalletConnect provider is bundled as an entrypoint chunk,
// because it will always be requested anyway and we don't want to have a waterfall request pattern.
import * as WalletConnect from '@walletconnect/ethereum-provider'
=======
// We intentionally import this to ensure that the WalletConnect provider is bundled as an entrypoint chunk,
// because it will always be requested anyway and we don't want to have a waterfall request pattern.
import * as WalletConnect from '@walletconnect/ethereum-provider'
/* oxlint-disable typescript/no-unnecessary-condition */
// note the reason for the setupi18n function is to avoid webpack tree shaking the file out
import { setupi18n } from 'uniswap/src/i18n/i18n-setup-interface'
import { setupWagmiAutoConnect } from '~/components/Web3Provider/wagmiAutoConnect'
import { setupTurnstileCSPErrorFilter } from '~/utils/setupTurnstileCSPErrorFilter'
import { setupVitePreloadErrorHandler } from '~/utils/setupVitePreloadErrorHandler'

if (WalletConnect) {
  // oxlint-disable-next-line no-console -- Side effects module needs console for initialization logging
  console.debug('WalletConnect is defined')
}

// adding these so webpack won't tree shake this away, sideEffects was giving trouble
setupi18n()
setupWagmiAutoConnect()
setupVitePreloadErrorHandler()
setupTurnstileCSPErrorFilter()
