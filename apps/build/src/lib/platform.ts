import { PLATFORM_API, INFO_API } from './chains'

export type Network = 'mainnet' | 'testnet' | 'devnet'

// P-Chain JSON-RPC helper
async function platformCall(network: Network, method: string, params?: Record<string, unknown>) {
  const res = await fetch(PLATFORM_API[network], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: params ?? {} }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

async function infoCall(network: Network, method: string, params?: Record<string, unknown>) {
  const res = await fetch(INFO_API[network], {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params: params ?? {} }),
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error.message)
  return json.result
}

export interface Validator {
  nodeID: string
  startTime: string
  endTime: string
  stakeAmount: string
  weight: string
  connected: boolean
  uptime: string
  delegationFee: string
  delegators?: Delegator[]
}

export interface Delegator {
  nodeID: string
  startTime: string
  endTime: string
  stakeAmount: string
  rewardOwner: { addresses: string[] }
}

export interface PlatformHeight {
  height: string
}

export async function getCurrentValidators(network: Network): Promise<Validator[]> {
  const result = await platformCall(network, 'platform.getCurrentValidators')
  return result.validators ?? []
}

export async function getPendingValidators(network: Network) {
  const result = await platformCall(network, 'platform.getPendingValidators')
  return result
}

export async function getBlockchains(network: Network) {
  const result = await platformCall(network, 'platform.getBlockchains')
  return result.blockchains ?? []
}

export async function getHeight(network: Network): Promise<string> {
  const result = await platformCall(network, 'platform.getHeight')
  return result.height
}

export async function getStakingAssetID(network: Network): Promise<string> {
  const result = await platformCall(network, 'platform.getStakingAssetID')
  return result.assetID
}

export async function getMinStake(network: Network) {
  const result = await platformCall(network, 'platform.getMinStake')
  return result
}

export async function getNetworkName(network: Network): Promise<string> {
  const result = await infoCall(network, 'info.getNetworkName')
  return result.networkName
}

export async function getNodeID(network: Network): Promise<string> {
  const result = await infoCall(network, 'info.getNodeID')
  return result.nodeID
}

// Format nLUX to LUX (9 decimals for P-chain)
export function formatStakeAmount(nLux: string): string {
  const num = BigInt(nLux)
  const whole = num / BigInt(1e9)
  const frac = num % BigInt(1e9)
  if (frac === BigInt(0)) return whole.toLocaleString()
  return `${whole.toLocaleString()}.${frac.toString().padStart(9, '0').replace(/0+$/, '')}`
}

// Format uptime percentage (API returns 0-100 range already)
export function formatUptime(uptime: string): string {
  const pct = parseFloat(uptime)
  return `${pct.toFixed(2)}%`
}
