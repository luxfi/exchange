import { Wallet } from '@l.x/lx/src/features/wallet/types/Wallet'
import { HexString } from '@l.x/utils/src/addresses/hex'

export interface WalletService {
  getWallet(params: { evmAddress?: HexString; svmAddress?: string }): Wallet
}
