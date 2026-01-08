import type { AnvilClient } from 'playwright/anvil/anvil-manager'
import { isLuxdMode } from 'playwright/anvil/anvil-manager'
import { HexString, isValidHexString } from 'utilities/src/addresses/hex'
import { sleep } from 'utilities/src/time/timing'
import { Address } from 'viem'
import { concat, keccak256, pad, toHex } from 'viem/utils'
export const ONE_MILLION_USDT = 1_000_000_000_000n

// Helper to mine blocks or wait for auto-mining
// On luxd mode, blocks are auto-mined so we just wait briefly
async function mineOrWait(client: AnvilClient, blocks: number): Promise<void> {
  if (isLuxdMode()) {
    await sleep(500 * blocks)
  } else {
    await client.mine({ blocks })
  }
}

// Standard WETH9 deployed bytecode (canonical WETH implementation)
// This is the exact bytecode deployed on Ethereum mainnet for WETH
const WETH9_BYTECODE =
  '0x6060604052600436106100af576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806306fdde03146100b9578063095ea7b31461014757806318160ddd146101a157806323b872dd146101ca5780632e1a7d4d14610243578063313ce5671461026657806370a082311461029557806395d89b41146102e2578063a9059cbb14610370578063d0e30db0146103ca578063dd62ed3e146103d4575b6100b7610440565b005b34156100c457600080fd5b6100cc6104dd565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561010c5780820151818401526020810190506100f1565b50505050905090810190601f1680156101395780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561015257600080fd5b610187600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061057b565b604051808215151515815260200191505060405180910390f35b34156101ac57600080fd5b6101b461066d565b6040518082815260200191505060405180910390f35b34156101d557600080fd5b610229600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803590602001909190505061068c565b604051808215151515815260200191505060405180910390f35b341561024e57600080fd5b61026460048080359060200190919050506109d9565b005b341561027157600080fd5b610279610b05565b604051808260ff1660ff16815260200191505060405180910390f35b34156102a057600080fd5b6102cc600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610b18565b6040518082815260200191505060405180910390f35b34156102ed57600080fd5b6102f5610b30565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561033557808201518184015260208101905061031a565b50505050905090810190601f1680156103625780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561037b57600080fd5b6103b0600480803573ffffffffffffffffffffffffffffffffffffffff16906020019091908035906020019091905050610bce565b604051808215151515815260200191505060405180910390f35b6103d2610440565b005b34156103df57600080fd5b61042a600480803573ffffffffffffffffffffffffffffffffffffffff1690602001909190803573ffffffffffffffffffffffffffffffffffffffff16906020019091905050610be3565b6040518082815260200191505060405180910390f35b34600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055503373ffffffffffffffffffffffffffffffffffffffff167fe1fffcc4923d04b559f4d29a8bfc6cda04eb5b0d3c460751c2402c5c5cc9109c346040518082815260200191505060405180910390a2565b60008054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105735780601f1061054857610100808354040283529160200191610573565b820191906000526020600020905b81548152906001019060200180831161055657829003601f168201915b505050505081565b600081600460003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60003073ffffffffffffffffffffffffffffffffffffffff1631905090565b600081600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054101515156106dc57600080fd5b3373ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16141580156107b457507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205414155b156108cf5781600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020541015151561084457600080fd5b81600460008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055505b81600360008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000206000828254039250508190555081600360008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055508273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600190509392505050565b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410151515610a2757600080fd5b80600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825403925050819055503373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501515610ab457600080fd5b3373ffffffffffffffffffffffffffffffffffffffff167f7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65826040518082815260200191505060405180910390a250565b600260009054906101000a900460ff1681565b60036020528060005260406000206000915090505481565b60018054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610bc65780601f10610b9b57610100808354040283529160200191610bc6565b820191906000526020600020905b815481529060010190602001808311610ba957829003601f168201915b505050505081565b6000610bdb33848461068c565b905092915050565b60046020528160005260406000206020528060005260406000206000915091505054815600a165627a7a72305820deb4c2ccab3c2fdca32ab3f46728571c546f74dd26e0d9a23d3c0a82b9e4dc0f0029'

// Minimal ERC20 bytecode for test tokens (supports balanceOf, transfer, approve, allowance, totalSupply)
// Storage layout: slot 0 = balances mapping, slot 1 = allowances mapping, slot 2 = totalSupply
const MINIMAL_ERC20_BYTECODE =
  '0x608060405234801561001057600080fd5b50610451806100206000396000f3fe608060405234801561001057600080fd5b506004361061007d5760003560e01c8063313ce5671161005b578063313ce567146100d657806370a08231146100f4578063a9059cbb14610124578063dd62ed3e1461015457600080fd5b806306fdde0314610082578063095ea7b3146100a057806318160ddd146100c0575b600080fd5b61008a610184565b6040516100979190610345565b60405180910390f35b6100b06100ae3660046103af565b6101bc565b6040519015158152602001610097565b6100c8610232565b604051908152602001610097565b6100de601281565b60405160ff9091168152602001610097565b6100c86101023660046103d9565b6001600160a01b031660009081526020819052604090205490565b6100b06101323660046103af565b610243565b6100c86101623660046103fb565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b60606040518060400160405280600a81526020017f5465737420546f6b656e000000000000000000000000000000000000000000008152509050905b90565b3360008181526001602090815260408083206001600160a01b038716808552925280832085905551919290917f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259061021c9086815260200190565b60405180910390a350600192915050565b600061023e6002545090565b905090565b3360009081526020819052604081205482111561025f57600080fd5b3360009081526020819052604081208054849290610280908490612710565b90915550506001600160a01b038316600090815260208190526040812080548492906102ad908490612710565b90915550506040518281526001600160a01b0384169033907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a350600192915050565b60005b83811015610316578181015183820152602001610300565b50506000910152565b600081518084526103378160208601602086016102fd565b601f01601f19169290920160200192915050565b60208152600061035e602083018461031f565b9392505050565b80356001600160a01b038116811461037c57600080fd5b919050565b634e487b7160e01b600052604160045260246000fd5b600080604083850312156103aa57600080fd5b6103b383610365565b946020939093013593505050565b6000602082840312156103d357600080fd5b61035e82610365565b6000806040838503121561040e57600080fd5b61041783610365565b915061042560208401610365565b90509250929050565b634e487b7160e01b600052601160045260246000fd5b808201808211156104585761045861042e565b9291505056fea164736f6c634300081900'

/**
 * Deploy a contract using hardhat_setCode RPC method
 * This works on both Anvil and luxd dev mode
 */
export async function deployContractBytecode({
  client,
  address,
  bytecode,
}: {
  client: AnvilClient
  address: Address
  bytecode: `0x${string}`
}): Promise<void> {
  // Use the raw request method to call hardhat_setCode
  await client.request({
    method: 'hardhat_setCode' as any,
    params: [address, bytecode],
  })
  await mineOrWait(client, 1)
}

/**
 * Check if a contract exists at the given address
 * luxd returns '0x00' for empty accounts while Anvil returns '0x'
 */
export async function hasContractCode(client: AnvilClient, address: Address): Promise<boolean> {
  const code = await client.getCode({ address })
  // Check for empty code - both '0x' (Anvil) and '0x00' (luxd) mean no contract
  return code !== undefined && code !== '0x' && code !== '0x00' && code.length > 4
}

/**
 * Deploy WETH9 contract (wrapped native token) at the specified address
 * Only deploys if no contract exists at the address
 */
export async function deployWeth9IfNeeded({
  client,
  address,
}: {
  client: AnvilClient
  address: Address
}): Promise<boolean> {
  if (await hasContractCode(client, address)) {
    return false // Already deployed
  }
  await deployContractBytecode({ client, address, bytecode: WETH9_BYTECODE })
  return true
}

/**
 * Deploy a minimal ERC20 contract at the specified address
 * Only deploys if no contract exists at the address
 */
export async function deployErc20IfNeeded({
  client,
  address,
}: {
  client: AnvilClient
  address: Address
}): Promise<boolean> {
  if (await hasContractCode(client, address)) {
    return false // Already deployed
  }
  await deployContractBytecode({ client, address, bytecode: MINIMAL_ERC20_BYTECODE })
  return true
}

// Token addresses for LuxDev deployment (deterministic CREATE addresses from deployer nonce 0+)
// These match DEFAULT_DEPLOYED_CONTRACTS in luxd-manager.ts
const LUXDEV_TOKEN_ADDRESSES = {
  // WLUX (Wrapped LUX) - nonce 0
  WLUX: '0x5FbDB2315678afecb367f032d93F642f64180aa3' as Address,
  // LETH (Bridged ETH) - nonce 1
  LETH: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' as Address,
  // LBTC (Bridged BTC) - nonce 2
  LBTC: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0' as Address,
  // LUSD (Bridged USDC) - nonce 3
  LUSD: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9' as Address,
  // AMM Router - nonce 5
  AMM_ROUTER: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707' as Address,
}

// Minimal AMM Router bytecode - accepts ANY swap call and returns success
// This is a simple fallback contract that accepts any function call and returns an empty uint[] array
// The fallback returns ABI-encoded empty array: offset (0x20) + length (0) = 64 bytes
// This works for all swap functions: swapExactTokensForTokens, swapExactETHForTokens, swapExactTokensForETH
const MINIMAL_AMM_ROUTER_BYTECODE =
  '0x6020600052600060205260406000f3' as `0x${string}`

/**
 * Deploy a minimal AMM router at the specified address
 * Only deploys if no contract exists at the address
 */
export async function deployAmmRouterIfNeeded({
  client,
  address,
}: {
  client: AnvilClient
  address: Address
}): Promise<boolean> {
  if (await hasContractCode(client, address)) {
    return false // Already deployed
  }
  await deployContractBytecode({ client, address, bytecode: MINIMAL_AMM_ROUTER_BYTECODE })
  return true
}

/**
 * Deploy all required test tokens and contracts for luxd dev mode
 * This should be called before tests that need ERC20 tokens or AMM swaps
 */
export async function deployDevNetworkTokens(client: AnvilClient): Promise<void> {
  if (!isLuxdMode()) {
    return // Only needed for luxd dev mode
  }

  console.log('Deploying LuxDev contracts...')

  // Deploy WLUX (wrapped native token) at the expected address
  const wluxDeployed = await deployWeth9IfNeeded({ client, address: LUXDEV_TOKEN_ADDRESSES.WLUX })
  if (wluxDeployed) {
    console.log(`  WLUX at ${LUXDEV_TOKEN_ADDRESSES.WLUX}`)
  }

  // Deploy test ERC20s
  const lethDeployed = await deployErc20IfNeeded({ client, address: LUXDEV_TOKEN_ADDRESSES.LETH })
  if (lethDeployed) {
    console.log(`  LETH at ${LUXDEV_TOKEN_ADDRESSES.LETH}`)
  }

  const lbtcDeployed = await deployErc20IfNeeded({ client, address: LUXDEV_TOKEN_ADDRESSES.LBTC })
  if (lbtcDeployed) {
    console.log(`  LBTC at ${LUXDEV_TOKEN_ADDRESSES.LBTC}`)
  }

  const lusdDeployed = await deployErc20IfNeeded({ client, address: LUXDEV_TOKEN_ADDRESSES.LUSD })
  if (lusdDeployed) {
    console.log(`  LUSD at ${LUXDEV_TOKEN_ADDRESSES.LUSD}`)
  }

  // Deploy AMM router for swap tests
  const routerDeployed = await deployAmmRouterIfNeeded({ client, address: LUXDEV_TOKEN_ADDRESSES.AMM_ROUTER })
  if (routerDeployed) {
    console.log(`  AMM Router at ${LUXDEV_TOKEN_ADDRESSES.AMM_ROUTER}`)
  }

  console.log('LuxDev contracts deployed')
}

/**
 * For a mapping(address => uint256) at slot `mappingSlot`,
 * the key for `balances[user]` is keccak256(abi.encodePacked(user, mappingSlot)).
 */
function getBalanceSlotKey(user: Address, mappingSlot: number): HexString {
  // user must be left-padded to 32 bytes, and the slot number must be 32 bytes.
  const paddedUser = pad(user, { size: 32 }) // 32-byte address
  const paddedSlot = pad(`0x${mappingSlot.toString(16)}`, { size: 32 }) // 32-byte slot

  const hashResult = keccak256(concat([paddedUser, paddedSlot]))
  if (!isValidHexString(hashResult)) {
    throw new Error(`Invalid hex string: ${hashResult}`)
  }
  return hashResult
}

/**
 * Sets `newBalance` for `user` in the ERC20 at `erc20Address` using Anvil's `anvil_setStorageAt`.
 *
 * @param erc20Address The ERC20 contract address
 * @param user The address whose balance you want to set
 * @param newBalance Desired balance in wei (BigInt)
 * @param mappingSlot The storage slot number where `_balances` mapping is located.
 */
async function setErc20BalanceViaStorage({
  client,
  erc20Address,
  user,
  newBalance,
  mappingSlot = 0,
}: {
  client: AnvilClient
  erc20Address: Address
  user: Address
  newBalance: bigint
  mappingSlot: number
}) {
  // 1. Compute the correct storage key for user's balance
  const balanceSlotKey = getBalanceSlotKey(user, mappingSlot)

  // 2. Encode `newBalance` as a 32-byte hex
  //    EVM stores uint256 in big-endian 32-byte.
  const encodedBalance = toHex(newBalance, { size: 32 })

  // 3. Call `anvil_setStorageAt` so that `balances[user] = newBalance`.
  //    This is an Anvil *custom* JSON-RPC method (not part of standard Ethereum).
  await client.setStorageAt({
    address: erc20Address,
    index: balanceSlotKey,
    value: encodedBalance,
  })

  // 4. Optionally mine a block to "lock in" the state (some frameworks need it):
  await mineOrWait(client, 1)
}

/**
 * Try setting the ERC20 balance using multiple common storage slots
 * This uses Anvil/Hardhat-compatible RPC methods (setStorageAt, mine).
 * Both Anvil and luxd dev mode support these methods.
 */
export async function setErc20BalanceWithMultipleSlots({
  client,
  erc20Address,
  user,
  newBalance,
}: {
  client: AnvilClient
  erc20Address: Address
  user: Address
  newBalance: bigint
}) {
  // Both Anvil and luxd dev mode support setStorageAt and mine

  // Try common slots used by different ERC20 implementations
  const commonSlots = [0, 1, 2, 3, 9]

  for (const slot of commonSlots) {
    await setErc20BalanceViaStorage({ client, erc20Address, user, newBalance, mappingSlot: slot })

    // You could add a verification step here to check if it worked
    // For example, call the balanceOf function and see if it returns the expected value
  }
}
