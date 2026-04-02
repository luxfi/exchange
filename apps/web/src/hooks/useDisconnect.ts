import { useWallet as useSolanaWalletContext } from '@solana/wallet-adapter-react'
import { Platform } from '@luxexchange/lx/src/features/platforms/types/Platform'
import { tryCatch } from '@luxfi/utilities/src/errors'
import { logger } from '@luxfi/utilities/src/logger/logger'
import { useEvent } from '@luxfi/utilities/src/react/hooks'
// biome-ignore lint/style/noRestrictedImports: wagmi hook needed for wallet disconnection
import { useDisconnect as useDisconnectWagmi } from 'wagmi'

function useDisconnectEVM(): () => void {
  const { disconnect: disconnectWagmi, connectors } = useDisconnectWagmi()

  return useEvent(() => {
    connectors.forEach((connector) => disconnectWagmi({ connector }))
  })
}

function useDisconnectSVM(): () => void {
  return useSolanaWalletContext().disconnect
}

export function useDisconnect(): () => void {
  const disconnectEVM = useDisconnectEVM()
  const disconnectSVM = useDisconnectSVM()

  return useEvent(() => {
    const platformToDisconnect = { [Platform.EVM]: disconnectEVM, [Platform.SVM]: disconnectSVM }

    for (const [platform, disconnect] of Object.entries(platformToDisconnect)) {
      const { error } = tryCatch(disconnect)
      if (error) {
        logger.error(error, { tags: { file: 'useDisconnect.ts', function: 'useDisconnect' }, extra: { platform } })
      }
    }
  })
}
