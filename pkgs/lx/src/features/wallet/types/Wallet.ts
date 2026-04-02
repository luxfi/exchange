import { EVMAccountDetails, SVMAccountDetails } from 'lx/src/features/wallet/types/AccountDetails'

export type Wallet = {
  evmAccount?: EVMAccountDetails
  svmAccount?: SVMAccountDetails
}
