import { EVMAccountDetails, SVMAccountDetails } from '@l.x/lx/src/features/wallet/types/AccountDetails'

export type Wallet = {
  evmAccount?: EVMAccountDetails
  svmAccount?: SVMAccountDetails
}
