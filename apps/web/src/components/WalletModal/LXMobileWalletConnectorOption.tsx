import { QrCode } from '@l.x/ui/src/components/icons/QrCode'
import { CONNECTION_PROVIDER_IDS } from '@l.x/lx/src/constants/web3'
import { isMobileWeb } from '@l.x/utils/src/platform'
import { WalletConnectorOption } from '~/components/WalletModal/WalletConnectorOption'
import { useWalletWithId } from '~/features/accounts/store/hooks'

export function LXMobileWalletConnectorOption() {
  const wallet = useWalletWithId(CONNECTION_PROVIDER_IDS.LX_WALLET_CONNECT_CONNECTOR_ID)

  if (!wallet) {
    return null
  }

  return (
    <WalletConnectorOption
      wallet={wallet}
      rightSideDetail={!isMobileWeb ? <QrCode size="$icon.20" color="$neutral2" /> : null}
    />
  )
}
