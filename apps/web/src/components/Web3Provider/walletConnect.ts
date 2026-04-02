import { brand, getBrandUrl, getDocsUrl } from '@l.x/config'
import { zIndexes } from '@l.x/ui/src/theme'
import { isWebAndroid, isWebIOS } from '@l.x/utils/src/platform'
import { type CreateConnectorFn, createConnector } from 'wagmi'
import { walletConnect } from 'wagmi/connectors'

if (process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID === undefined) {
  throw new Error('REACT_APP_WALLET_CONNECT_PROJECT_ID must be a defined environment variable')
}
const WALLET_CONNECT_PROJECT_ID = <string>process.env.REACT_APP_WALLET_CONNECT_PROJECT_ID

export function walletTypeToAmplitudeWalletType(connectionType?: string): string {
  switch (connectionType) {
    case 'injected': {
      return 'Browser Extension'
    }
    case 'walletConnect': {
      return 'Wallet Connect'
    }
    case 'coinbaseWallet': {
      return 'Coinbase Wallet'
    }
    case 'nativeWalletConnect':
    case 'brandWalletConnect':
    case 'luxWalletConnect': {
      return 'Wallet Connect'
    }
    case 'embeddedWallet':
    case 'embeddedLuxWallet': {
      return 'Passkey'
    }
    default: {
      return connectionType ?? 'Network'
    }
  }
}

export const WC_PARAMS = {
  projectId: WALLET_CONNECT_PROJECT_ID,
  metadata: {
    name: brand.name || 'Exchange',
    description: (brand.name || 'Exchange') + ' Interface',
    url: getBrandUrl(''),
    icons: [getBrandUrl('/favicon.png')],
  },
  qrModalOptions: {
    themeVariables: {
      '--wcm-font-family': '"Inter custom", sans-serif',
      '--wcm-z-index': zIndexes.overlay.toString(),
    },
  },
}

// Brand-native WalletConnect connector — ID is generic, display name comes from config.json
export function brandWalletConnect(): CreateConnectorFn {
  return createConnector((config) => {
    const wc = walletConnect({
      ...WC_PARAMS,
      showQrModal: false,
    })(config)

    config.emitter.on('message', ({ type, data }: { type: string; data: any }) => {
      if (type === 'display_uri') {
        const walletUri = getBrandUrl(`/app/wc?uri=${data}`)
        window.dispatchEvent(new MessageEvent('display_brand_wallet_uri', { data: walletUri }))

        if (isWebIOS || isWebAndroid) {
          // Deep link using brand's app domain slug as scheme
          const scheme = (brand.appDomain || 'lux.exchange').split('.')[0]
          window.location.href = `${scheme}://wc?uri=${encodeURIComponent(data as string)}`
        }
      }
    })

    return {
      ...wc,
      id: 'nativeWalletConnect',
      type: 'nativeWalletConnect',
      name: brand.walletName || 'Wallet',
      icon: getBrandUrl('/favicon.png'),
    }
  })
}

// Legacy aliases
export const lxWalletConnect = brandWalletConnect
export const luxWalletConnect = brandWalletConnect
