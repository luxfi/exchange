import { Connection } from '@solana/web3.js'
import { SOLANA_CHAIN_INFO } from 'lx/src/features/chains/svm/info/solana'

const SOLANA_CONNECTION = new Connection(SOLANA_CHAIN_INFO.rpcUrls.default.http[0])

export function getSolanaConnection(): Connection {
  return SOLANA_CONNECTION
}
